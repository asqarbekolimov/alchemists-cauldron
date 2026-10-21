import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

export interface HeaderView {
  element: HTMLElement;
  update(state: IGameState): void;
}

interface StatElements {
  element: HTMLElement;
  value: HTMLElement;
}

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function createStat(iconName: IconName, label: string, field: string, modifier = ''): StatElements {
  const value = element('span', {
    className: 'stat__value',
    attributes: { 'data-field': field },
  });

  return {
    value,
    element: element('div', {
      className: `stat${modifier ? ` stat--${modifier}` : ''}`,
      children: [
        icon(iconName, 'stat__icon'),
        element('span', { className: 'stat__label', textContent: label }),
        value,
      ],
    }),
  };
}

export function createHeaderView(): HeaderView {
  const score = createStat('flask', 'Score', 'score');
  const timer = createStat('clock', 'Time', 'timer', 'time');

  const lives = element('div', {
    className: 'lives',
    attributes: { 'data-field': 'lives', role: 'img' },
  });

  const root = element('header', {
    className: 'header',
    children: [score.element, timer.element, lives],
  });

  function update(state: IGameState): void {
    const maxLives = DIFFICULTY_SETTINGS[state.difficulty ?? DEFAULT_DIFFICULTY].lives;
    const isMenu = state.status === 'menu';

    score.value.textContent = String(state.score);
    timer.value.textContent = formatTime(state.timeLeft);

    lives.replaceChildren();

    if (isMenu) {
      lives.setAttribute('aria-label', 'Lives: not started');
      return;
    }

    for (let index = 0; index < maxLives; index += 1) {
      lives.append(icon('heart', index < state.lives ? 'life' : 'life life--lost'));
    }

    lives.setAttribute('aria-label', `Lives: ${state.lives} of ${maxLives}`);
  }

  return { element: root, update };
}
