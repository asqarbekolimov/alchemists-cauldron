import { isValidPlayerName } from '../logic/leaderboard';
import type { ISaveLeaderboardResult } from '../state/leaderboard';
import type { GameOverReason, IGameState } from '../utils/types';
import { element } from '../utils/dom';

export interface GameOverHandlers {
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  canSaveScore: (score: number) => boolean;
  onSaveScore: (name: string, score: number) => ISaveLeaderboardResult;
}

export interface GameOverView {
  element: HTMLElement;
  update(state: IGameState): void;
}

const REASON_LABELS: Record<GameOverReason, string> = {
  time: "Time's up!",
  lives: 'Out of lives!',
  ingredients: 'Out of ingredients!',
};

const INVALID_NAME_MESSAGE = 'Use 2-15 characters: letters, digits, space, _ or -.';

export function createGameOverView(handlers: GameOverHandlers): GameOverView {
  const reason = element('p', {
    className: 'game-over__reason',
    attributes: { 'data-field': 'game-over-reason' },
  });

  const finalScore = element('strong', { attributes: { 'data-field': 'final-score' } });

  const scoreLine = element('p', {
    className: 'game-over__score',
    children: [element('span', { textContent: 'Final score' }), finalScore],
  });

  const promptTitle = element('label', {
    className: 'game-over__prompt-title',
    textContent: 'Top 10 result!',
    attributes: { for: 'player-name' },
  });

  const hint = element('p', {
    className: 'game-over__hint',
    textContent: '2-15 characters: letters, digits, space, _ or -.',
  });

  const error = element('p', {
    className: 'game-over__error',
    attributes: { 'data-field': 'name-error', role: 'alert' },
  });

  const nameInput = element('input', {
    className: 'game-over__name',
    attributes: {
      id: 'player-name',
      type: 'text',
      name: 'player-name',
      maxlength: '15',
      placeholder: 'Your name',
      autocomplete: 'off',
      spellcheck: 'false',
      'data-field': 'player-name',
    },
    events: {
      input: () => {
        error.textContent = '';
      },
    },
  });

  const saveButton = element('button', {
    className: 'btn btn--save',
    textContent: 'Save score',
    attributes: { type: 'submit', 'data-action': 'save-score' },
  });

  const saved = element('p', {
    className: 'game-over__saved',
    attributes: { 'data-field': 'score-saved', role: 'status' },
  });

  saved.hidden = true;

  let currentScore = 0;

  function handleSubmit(event: Event): void {
    event.preventDefault();

    const name = nameInput.value.trim();

    if (!isValidPlayerName(name)) {
      error.textContent = INVALID_NAME_MESSAGE;
      nameInput.focus();
      return;
    }

    const result = handlers.onSaveScore(name, currentScore);

    if (!result.saved) {
      error.textContent = 'This score could not be saved.';
      return;
    }

    prompt.hidden = true;
    error.textContent = '';
    saved.textContent = result.persisted
      ? `Saved as ${name}.`
      : `Saved as ${name} for this session only.`;
    saved.hidden = false;
  }

  const prompt = element('form', {
    className: 'game-over__prompt',
    children: [promptTitle, hint, nameInput, saveButton, error],
    events: { submit: handleSubmit },
  });

  const playAgain = element('button', {
    className: 'btn btn--brew game-over__button',
    textContent: 'Play again',
    attributes: { type: 'button', 'data-action': 'play-again' },
    events: { click: handlers.onPlayAgain },
  });

  const leaderboard = element('button', {
    className: 'btn btn--outline game-over__button',
    textContent: 'Leaderboard',
    attributes: { type: 'button', 'data-action': 'game-over-leaderboard' },
    events: { click: handlers.onOpenLeaderboard },
  });

  const actions = element('div', {
    className: 'game-over__actions',
    children: [playAgain, leaderboard],
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

  const panel = element('div', {
    className: 'game-over__panel',
    children: [eyebrow, title, reason, scoreLine, prompt, saved, actions],
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

  let wasOver = false;

  function update(state: IGameState): void {
    const isOver = state.status === 'game-over';

    root.hidden = !isOver;

    if (!isOver) {
      wasOver = false;
      return;
    }

    finalScore.textContent = String(state.score);
    reason.textContent = REASON_LABELS[state.gameOverReason ?? 'time'];

    if (wasOver) {
      return;
    }

    wasOver = true;
    currentScore = state.score;
    prompt.hidden = !handlers.canSaveScore(state.score);
    saved.hidden = true;
    saved.textContent = '';
    error.textContent = '';
    nameInput.value = '';
  }

  return { element: root, update };
}
