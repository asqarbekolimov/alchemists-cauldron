import type { IGameState, IIngredient } from '../utils/types';
import { element } from '../utils/dom';
import { ingredientIcon } from './icons';

export interface ShelfView {
  element: HTMLElement;
  update(state: IGameState, maxCauldron: number): void;
}

interface ShelfCard {
  id: string;
  name: string;
  button: HTMLButtonElement;
  stockBadge: HTMLElement;
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function createStatChip(modifier: string, label: string, value: number): HTMLElement {
  return element('span', {
    className: `chip chip--${modifier}`,
    children: [
      element('span', { className: 'chip__label', textContent: label }),
      element('span', { className: 'chip__value', textContent: formatSigned(value) }),
    ],
  });
}

function createShelfCard(ingredient: IIngredient, onAdd: (id: string) => void): ShelfCard {
  const stockBadge = element('span', {
    className: 'card__stock',
    attributes: { 'aria-hidden': 'true' },
  });

  const stats = element('span', {
    className: 'card__stats',
    children: [
      createStatChip('temperature', 'T', ingredient.temperature),
      createStatChip('density', 'D', ingredient.density),
      createStatChip('magic', 'MP', ingredient.magicPower),
    ],
  });

  const info = element('span', {
    className: 'card__info',
    children: [element('span', { className: 'card__name', textContent: ingredient.name }), stats],
  });

  const button = element('button', {
    className: 'card',
    attributes: {
      type: 'button',
      'data-ingredient': ingredient.id,
    },
    events: { click: () => onAdd(ingredient.id) },
    children: [
      element('span', {
        className: 'card__icon',
        attributes: { 'aria-hidden': 'true' },
        children: [ingredientIcon(ingredient.icon)],
      }),
      info,
      stockBadge,
    ],
  });

  return { id: ingredient.id, name: ingredient.name, button, stockBadge };
}

export function createShelfView(
  ingredients: readonly IIngredient[],
  onAdd: (id: string) => void,
): ShelfView {
  const list = element('ul', {
    className: 'shelf__list',
    attributes: { 'data-field': 'shelf' },
  });

  const cards: ShelfCard[] = [];

  for (const ingredient of ingredients) {
    const card = createShelfCard(ingredient, onAdd);
    cards.push(card);
    list.append(element('li', { className: 'shelf__item', children: [card.button] }));
  }

  const root = element('section', {
    className: 'panel shelf',
    attributes: { 'aria-labelledby': 'shelf-title' },
    children: [
      element('h2', {
        className: 'panel__title',
        textContent: 'Ingredients',
        attributes: { id: 'shelf-title' },
      }),
      list,
    ],
  });

  function update(state: IGameState, maxCauldron: number): void {
    const isCauldronFull = state.cauldronIngredients.length >= maxCauldron;

    for (const card of cards) {
      const stock = state.shelfStock[card.id] ?? 0;
      const isEmpty = stock <= 0;

      card.stockBadge.textContent = String(stock);
      card.button.classList.toggle('card--empty', isEmpty);
      card.button.disabled = isEmpty || isCauldronFull;
      card.button.setAttribute('aria-label', `Add ${card.name}. Portions left: ${stock}.`);
    }
  }

  return { element: root, update };
}
