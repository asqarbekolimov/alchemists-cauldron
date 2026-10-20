import type { IRecipe, IRecipeRange } from '../utils/types';
import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

export interface BarValues {
  temperature: number;
  density: number;
  magicPower: number;
}

interface BarConfig {
  key: keyof BarValues;
  modifier: string;
  title: string;
  icon: IconName;
  min: number;
  max: number;
}

const BAR_CONFIG: readonly BarConfig[] = [
  {
    key: 'temperature',
    modifier: 'temperature',
    title: 'Temperature',
    icon: 'thermometer',
    min: -30,
    max: 100,
  },
  { key: 'density', modifier: 'density', title: 'Density', icon: 'droplet', min: -20, max: 60 },
  { key: 'magicPower', modifier: 'magic', title: 'Magic Power', icon: 'spark', min: 0, max: 80 },
];

function toPercent(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

function createBar(config: BarConfig, target: IRecipeRange, value: number): HTMLElement {
  const zoneStart = toPercent(target.min, config.min, config.max);
  const zoneEnd = toPercent(target.max, config.min, config.max);

  const zone = element('span', {
    className: 'bar__zone',
    attributes: { 'aria-hidden': 'true' },
  });
  zone.style.left = `${zoneStart}%`;
  zone.style.width = `${zoneEnd - zoneStart}%`;

  const marker = element('span', {
    className: 'bar__marker',
    attributes: { 'aria-hidden': 'true' },
  });
  marker.style.left = `${toPercent(value, config.min, config.max)}%`;

  const scale = element('div', {
    className: 'bar__scale',
    attributes: { 'aria-hidden': 'true' },
    children: [
      element('span', { textContent: String(config.min) }),
      element('span', { textContent: String(config.max) }),
    ],
  });

  return element('div', {
    className: `bar bar--${config.modifier}`,
    children: [
      element('h3', {
        className: 'bar__title',
        children: [icon(config.icon, 'bar__icon'), element('span', { textContent: config.title })],
      }),
      element('div', {
        className: 'bar__track',
        attributes: {
          role: 'meter',
          'aria-label': `${config.title}: current ${value}, target ${target.min} to ${target.max}`,
          'aria-valuemin': String(config.min),
          'aria-valuemax': String(config.max),
          'aria-valuenow': String(value),
          'data-parameter': config.key,
        },
        children: [zone, marker],
      }),
      scale,
    ],
  });
}

export function createBars(recipe: IRecipe, values: BarValues): HTMLElement {
  const targets: Record<keyof BarValues, IRecipeRange> = {
    temperature: recipe.temperature,
    density: recipe.density,
    magicPower: recipe.magicPower,
  };

  const bars = BAR_CONFIG.map((config) =>
    createBar(config, targets[config.key], values[config.key]),
  );

  return element('section', {
    className: 'bars',
    attributes: { 'aria-label': 'Cauldron parameters' },
    children: bars,
  });
}
