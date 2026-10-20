import type { IIngredient } from '../utils/types';
import { element } from '../utils/dom';

export interface ShelfItem {
  ingredient: IIngredient;
  stock: number;
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

function createShelfCard({ ingredient, stock }: ShelfItem): HTMLElement {
  const isOutOfStock = stock <= 0;

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

  const card = element('button', {
    className: `card${isOutOfStock ? ' card--empty' : ''}`,
    attributes: {
      type: 'button',
      'data-ingredient': ingredient.id,
      'aria-label': `Add ${ingredient.name}. Portions left: ${stock}.`,
    },
    children: [
      element('span', {
        className: 'card__icon',
        textContent: ingredient.icon,
        attributes: { 'aria-hidden': 'true' },
      }),
      info,
      element('span', {
        className: 'card__stock',
        textContent: String(stock),
        attributes: { 'aria-hidden': 'true' },
      }),
    ],
  });

  if (isOutOfStock) {
    card.disabled = true;
  }

  return card;
}

export function createShelf(items: readonly ShelfItem[]): HTMLElement {
  const list = element('ul', {
    className: 'shelf__list',
    attributes: { 'data-field': 'shelf' },
  });

  for (const item of items) {
    list.append(
      element('li', {
        className: 'shelf__item',
        children: [createShelfCard(item)],
      }),
    );
  }

  return element('section', {
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
}
