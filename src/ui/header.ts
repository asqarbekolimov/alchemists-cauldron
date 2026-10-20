import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

export interface HeaderOptions {
  score: number;
  timeLeft: number;
  lives: number;
  maxLives?: number;
}

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function createStat(
  iconName: IconName,
  label: string,
  value: string,
  field: string,
  modifier = '',
): HTMLElement {
  return element('div', {
    className: `stat${modifier ? ` stat--${modifier}` : ''}`,
    children: [
      icon(iconName, 'stat__icon'),
      element('span', { className: 'stat__label', textContent: label }),
      element('span', {
        className: 'stat__value',
        textContent: value,
        attributes: { 'data-field': field },
      }),
    ],
  });
}

export function createHeader(options: HeaderOptions): HTMLElement {
  const maxLives = options.maxLives ?? 3;

  const lives = element('div', {
    className: 'lives',
    attributes: {
      role: 'img',
      'aria-label': `Lives: ${options.lives} of ${maxLives}`,
      'data-field': 'lives',
    },
  });

  for (let index = 0; index < maxLives; index += 1) {
    lives.append(icon('heart', index < options.lives ? 'life' : 'life life--lost'));
  }

  return element('header', {
    className: 'header',
    children: [
      createStat('flask', 'Score', String(options.score), 'score'),
      createStat('clock', 'Time', formatTime(options.timeLeft), 'timer', 'time'),
      lives,
    ],
  });
}
