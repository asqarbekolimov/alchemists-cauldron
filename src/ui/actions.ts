import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

export interface ActionsHandlers {
  onStart: () => void;
  onBrew: () => void;
  onLeaderboard: () => void;
}

export interface ActionsView {
  element: HTMLElement;
  update(state: IGameState): void;
}

function createGhostButton(
  label: string,
  iconName: IconName,
  action: string,
  align: 'start' | 'end',
): HTMLElement {
  return element('button', {
    className: `btn btn--ghost btn--${align}`,
    attributes: { type: 'button', 'data-action': action },
    children: [
      icon(iconName, 'btn__icon'),
      element('span', { className: 'btn__label', textContent: label }),
    ],
  });
}

export function createActionsView(handlers: ActionsHandlers): ActionsView {
  const start = element('button', {
    className: 'btn btn--brew',
    textContent: 'Start Game',
    attributes: { type: 'button', 'data-action': 'start' },
    events: { click: handlers.onStart },
  });

  const brew = element('button', {
    className: 'btn btn--brew',
    textContent: 'Brew',
    attributes: { type: 'button', 'data-action': 'brew' },
    events: { click: handlers.onBrew },
  });

  const leaderboard = element('button', {
    className: 'btn btn--leaderboard',
    attributes: { type: 'button', 'data-action': 'leaderboard' },
    children: [
      icon('trophy', 'btn__icon'),
      element('span', { className: 'btn__label', textContent: 'Leaderboard' }),
    ],
    events: { click: handlers.onLeaderboard },
  });

  const menu = element('div', {
    className: 'actions__menu',
    children: [start, leaderboard],
  });

  const primary = element('div', { className: 'actions__primary' });

  const root = element('footer', {
    className: 'actions',
    children: [
      createGhostButton('Help', 'book', 'help', 'start'),
      primary,
      createGhostButton('Settings', 'gear', 'settings', 'end'),
    ],
  });

  let mode: 'menu' | 'game' | undefined;

  function update(state: IGameState): void {
    const nextMode = state.status === 'menu' ? 'menu' : 'game';

    if (nextMode !== mode) {
      primary.replaceChildren(nextMode === 'menu' ? menu : brew);
      mode = nextMode;
    }

    brew.disabled = state.status !== 'playing' || state.cauldronIngredients.length === 0;
  }

  return { element: root, update };
}
