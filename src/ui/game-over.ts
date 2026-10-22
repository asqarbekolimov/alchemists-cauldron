import type { GameOverReason, IGameState } from '../utils/types';
import { element } from '../utils/dom';

export interface GameOverView {
  element: HTMLElement;
  update(state: IGameState): void;
}

const REASON_LABELS: Record<GameOverReason, string> = {
  time: "Time's up!",
  lives: 'Out of lives!',
  ingredients: 'Out of ingredients!',
};

export function createGameOverView(onPlayAgain: () => void): GameOverView {
  const reason = element('p', {
    className: 'game-over__reason',
    attributes: { 'data-field': 'game-over-reason' },
  });

  const finalScore = element('strong', { attributes: { 'data-field': 'final-score' } });

  const button = element('button', {
    className: 'btn btn--brew game-over__button',
    textContent: 'Play again',
    attributes: { type: 'button', 'data-action': 'play-again' },
    events: { click: onPlayAgain },
  });

  const eyebrow = element('p', {
    className: 'game-over__eyebrow',
    textContent: 'The cauldron settles',
  });

  const title = element('h2', {
    className: 'game-over__title',
    textContent: 'Game Over',
    attributes: { id: 'game-over-title' },
  });

  const scoreLine = element('p', {
    className: 'game-over__score',
    children: [element('span', { textContent: 'Final score' }), finalScore],
  });

  const panel = element('div', {
    className: 'game-over__panel',
    children: [eyebrow, title, reason, scoreLine, button],
  });

  const root = element('section', {
    className: 'game-over',
    attributes: {
      'data-field': 'game-over',
      'aria-labelledby': 'game-over-title',
    },
    children: [panel],
  });

  root.hidden = true;

  function update(state: IGameState): void {
    const isOver = state.status === 'game-over';

    root.hidden = !isOver;

    if (!isOver) {
      return;
    }

    finalScore.textContent = String(state.score);
    reason.textContent = REASON_LABELS[state.gameOverReason ?? 'time'];
  }

  return { element: root, update };
}
