import type { IIngredient } from '../utils/types';
import { element } from '../utils/dom';
import { icon } from './icons';

export function createCauldron(ingredients: readonly IIngredient[] = []): HTMLElement {
  const list = element('ul', {
    className: 'cauldron__list',
    attributes: { 'data-field': 'cauldron' },
  });

  if (ingredients.length === 0) {
    list.append(
      element('li', {
        className: 'cauldron__hint',
        textContent: 'Add ingredients from the shelf',
      }),
    );
  } else {
    for (const ingredient of ingredients) {
      list.append(
        element('li', {
          className: 'cauldron__item',
          children: [
            element('span', {
              className: 'cauldron__item-icon',
              textContent: ingredient.icon,
              attributes: { 'aria-hidden': 'true' },
            }),
            element('span', { textContent: ingredient.name }),
          ],
        }),
      );
    }
  }

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

  return element('section', {
    className: 'panel cauldron',
    attributes: { 'aria-label': 'Cauldron' },
    children: [object],
  });
}
