import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { formatTime } from '../utils/format';

export interface PauseHandlers {
  onResume: () => void;
  onExit: () => void;
}

export interface PauseView {
  element: HTMLElement;
  update(state: IGameState): void;
}

export function createPauseView(handlers: PauseHandlers): PauseView {
  const timeValue = element('strong', { attributes: { 'data-field': 'pause-time' } });

  const resume = element('button', {
    className: 'btn btn--brew pause__button',
    textContent: 'Resume',
    attributes: { type: 'button', 'data-action': 'resume' },
    events: { click: handlers.onResume },
  });

  const exit = element('button', {
    className: 'btn btn--outline pause__button',
    textContent: 'Exit to Menu',
    attributes: { type: 'button', 'data-action': 'exit-menu' },
    events: { click: handlers.onExit },
  });

  const eyebrow = element('p', {
    className: 'pause__eyebrow',
    textContent: 'The cauldron waits',
  });

  const title = element('h2', {
    className: 'pause__title',
    textContent: 'Paused',
    attributes: { id: 'pause-title' },
  });

  const timeLine = element('p', {
    className: 'pause__time',
    children: [element('span', { textContent: 'Time left' }), timeValue],
  });

  const actions = element('div', {
    className: 'pause__actions',
    children: [resume, exit],
  });

  const panel = element('div', {
    className: 'pause__panel',
    children: [eyebrow, title, timeLine, actions],
  });

  const root = element('section', {
    className: 'pause',
    attributes: {
      'data-field': 'pause',
      'aria-labelledby': 'pause-title',
    },
    children: [panel],
  });

  root.hidden = true;

  function update(state: IGameState): void {
    const isPaused = state.status === 'paused';

    root.hidden = !isPaused;

    if (!isPaused) {
      return;
    }

    timeValue.textContent = formatTime(state.timeLeft);
  }

  return { element: root, update };
}
