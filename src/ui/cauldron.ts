import type { IGameState, IIngredient } from '../utils/types';
import { element } from '../utils/dom';
import { icon, ingredientIcon } from './icons';

export interface CauldronView {
  element: HTMLElement;
  update(state: IGameState): void;
}

function createCauldronItem(ingredient: IIngredient): HTMLElement {
  return element('li', {
    className: 'cauldron__item',
    children: [
      ingredientIcon(ingredient.icon, 'cauldron__item-icon'),
      element('span', { textContent: ingredient.name }),
    ],
  });
}

export function createCauldronView(): CauldronView {
  const hint = element('li', {
    className: 'cauldron__hint',
    textContent: 'Add ingredients from the shelf',
  });

  const list = element('ul', {
    className: 'cauldron__list',
    attributes: { 'data-field': 'cauldron' },
  });

  const liquid = element('div', {
    className: 'cauldron__liquid',
    children: [list],
  });

  const emblem = element('span', {
    className: 'cauldron__emblem',
    children: [icon('spark', 'cauldron__emblem-icon')],
  });

  const body = element('div', {
    className: 'cauldron__body',
    attributes: { 'aria-hidden': 'true' },
    children: [emblem],
  });

  const object = element('div', {
    className: 'cauldron__object',
    children: [liquid, body],
  });

  const root = element('section', {
    className: 'panel cauldron',
    attributes: { 'aria-label': 'Cauldron' },
    children: [object],
  });

  function update(state: IGameState): void {
    list.replaceChildren();

    if (state.cauldronIngredients.length === 0) {
      hint.textContent =
        state.status === 'menu' ? 'Press Start Game to begin' : 'Add ingredients from the shelf';
      list.append(hint);
      return;
    }

    for (const ingredient of state.cauldronIngredients) {
      list.append(createCauldronItem(ingredient));
    }
  }

  return { element: root, update };
}
