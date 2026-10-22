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

  const timeFill = element('span', { className: 'time-bar__fill' });
  const timeBar = element('div', {
    className: 'time-bar',
    attributes: {
      role: 'progressbar',
      'aria-label': 'Time remaining',
      'aria-valuemin': '0',
      'aria-valuemax': '150',
      'aria-valuenow': '0',
    },
    children: [timeFill],
  });

  const header = element('header', {
    className: 'header',
    children: [score.element, timer.element, lives],
  });

  const root = element('div', {
    className: 'header-shell',
    children: [header, timeBar],
  });

  let renderedLives = -1;
  let renderedMaxLives = -1;
  let isMenuRendered = false;

  function update(state: IGameState): void {
    const maxLives = DIFFICULTY_SETTINGS[state.difficulty ?? DEFAULT_DIFFICULTY].lives;
    const startingTime = DIFFICULTY_SETTINGS[state.difficulty ?? DEFAULT_DIFFICULTY].startingTime;
    const ratio = Math.min(Math.max(state.timeLeft / startingTime, 0), 1);
    const isMenu = state.status === 'menu';

    score.value.textContent = String(state.score);
    timer.value.textContent = formatTime(state.timeLeft);
    timeFill.style.width = `${ratio * 100}%`;
    timeBar.setAttribute('aria-valuemax', String(startingTime));
    timeBar.setAttribute('aria-valuenow', String(state.timeLeft));
    header.classList.toggle('header--low', state.status === 'playing' && state.timeLeft < 15);

    if (isMenu) {
      if (!isMenuRendered) {
        lives.replaceChildren();
        lives.setAttribute('aria-label', 'Lives: not started');
        isMenuRendered = true;
        renderedLives = -1;
      }

      return;
    }

    isMenuRendered = false;

    if (maxLives === renderedMaxLives && state.lives === renderedLives) {
      return;
    }

    lives.replaceChildren();

    for (let index = 0; index < maxLives; index += 1) {
      lives.append(icon('heart', index < state.lives ? 'life' : 'life life--lost'));
    }

    lives.setAttribute('aria-label', `Lives: ${state.lives} of ${maxLives}`);
    renderedLives = state.lives;
    renderedMaxLives = maxLives;
  }

  return { element: root, update };
}
