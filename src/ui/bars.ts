import type { ICauldronValues, IRecipe } from '../utils/types';
import { element } from '../utils/dom';
import { formatSigned } from '../utils/format';
import { icon, type IconName } from './icons';

export interface BarsView {
  element: HTMLElement;
  update(recipe: IRecipe, values: ICauldronValues): void;
}

interface BarConfig {
  key: keyof ICauldronValues;
  modifier: string;
  title: string;
  icon: IconName;
  min: number;
  max: number;
}

interface BarView {
  config: BarConfig;
  root: HTMLElement;
  track: HTMLElement;
  zone: HTMLElement;
  marker: HTMLElement;
  current: HTMLElement;
}

// Bars that can go negative are symmetric around 0, so the middle of the track is zero.
const BAR_CONFIG: readonly BarConfig[] = [
  {
    key: 'temperature',
    modifier: 'temperature',
    title: 'Temperature',
    icon: 'thermometer',
    min: -60,
    max: 60,
  },
  { key: 'density', modifier: 'density', title: 'Density', icon: 'droplet', min: -60, max: 60 },
  { key: 'magicPower', modifier: 'magic', title: 'Magic Power', icon: 'spark', min: 0, max: 100 },
];

function toPercent(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

function createBar(config: BarConfig): BarView {
  const zone = element('span', {
    className: 'bar__zone',
    attributes: { 'aria-hidden': 'true' },
  });

  const marker = element('span', {
    className: 'bar__marker',
    attributes: { 'aria-hidden': 'true' },
  });

  const trackChildren: HTMLElement[] = [zone];

  if (config.min < 0) {
    const zero = element('span', {
      className: 'bar__zero',
      attributes: { 'aria-hidden': 'true' },
    });
    zero.style.left = `${toPercent(0, config.min, config.max)}%`;
    trackChildren.push(zero);
  }

  trackChildren.push(marker);

  const track = element('div', {
    className: 'bar__track',
    attributes: {
      role: 'meter',
      'aria-label': `${config.title}: 0`,
      'aria-valuemin': String(config.min),
      'aria-valuemax': String(config.max),
      'aria-valuenow': '0',
      'data-parameter': config.key,
    },
    children: trackChildren,
  });

  const current = element('span', { className: 'bar__current', textContent: '0' });

  const midpoint = config.min < 0 ? 0 : (config.min + config.max) / 2;

  const scale = element('div', {
    className: 'bar__scale',
    attributes: { 'aria-hidden': 'true' },
    children: [
      element('span', { textContent: String(config.min) }),
      element('span', { textContent: String(midpoint) }),
      element('span', { textContent: String(config.max) }),
    ],
  });

  const root = element('div', {
    className: `bar bar--${config.modifier}`,
    children: [
      element('h3', {
        className: 'bar__title',
        children: [icon(config.icon, 'bar__icon'), element('span', { textContent: config.title })],
      }),
      current,
      track,
      scale,
    ],
  });

  return { config, root, track, zone, marker, current };
}

export function createBarsView(): BarsView {
  const bars = BAR_CONFIG.map((config) => createBar(config));

  const root = element('section', {
    className: 'bars',
    attributes: { 'aria-label': 'Cauldron parameters' },
    children: bars.map((bar) => bar.root),
  });

  function update(recipe: IRecipe, values: ICauldronValues): void {
    for (const bar of bars) {
      const { config } = bar;
      const target = recipe[config.key];
      const value = values[config.key];
      const zoneStart = toPercent(target.min, config.min, config.max);
      const zoneEnd = toPercent(target.max, config.min, config.max);
      const isInRange = value >= target.min && value <= target.max;

      bar.zone.style.left = `${zoneStart}%`;
      bar.zone.style.width = `${zoneEnd - zoneStart}%`;
      bar.marker.style.left = `${toPercent(value, config.min, config.max)}%`;
      bar.current.textContent = formatSigned(value);
      bar.root.classList.toggle('bar--success', isInRange);
      bar.track.setAttribute('aria-valuenow', String(value));
      bar.track.setAttribute(
        'aria-label',
        `${config.title}: ${formatSigned(value)}, target ${target.min} to ${target.max}`,
      );
    }
  }

  return { element: root, update };
}
