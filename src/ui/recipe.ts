import type { IRecipe, IRecipeRange } from '../utils/types';
import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

function formatRange(range: IRecipeRange): string {
  return `${range.min}–${range.max}`;
}

function createTarget(
  modifier: string,
  iconName: IconName,
  label: string,
  range: IRecipeRange,
): HTMLElement {
  return element('li', {
    className: `recipe__target recipe__target--${modifier}`,
    children: [
      icon(iconName, 'recipe__target-icon'),
      element('span', { className: 'recipe__target-label', textContent: label }),
      element('span', { className: 'recipe__target-value', textContent: formatRange(range) }),
    ],
  });
}

export function createRecipePanel(recipe: IRecipe, used: number, capacity: number): HTMLElement {
  return element('aside', {
    className: 'panel recipe',
    attributes: { 'aria-labelledby': 'recipe-title' },
    children: [
      element('h2', {
        className: 'recipe__eyebrow',
        textContent: 'Current Recipe',
        attributes: { id: 'recipe-title' },
      }),
      element('p', { className: 'recipe__name', textContent: recipe.name }),
      element('div', {
        className: 'recipe__art',
        attributes: { 'aria-hidden': 'true' },
        children: [icon('flask', 'recipe__art-icon')],
      }),
      element('ul', {
        className: 'recipe__targets',
        children: [
          createTarget('temperature', 'thermometer', 'Temp', recipe.temperature),
          createTarget('density', 'droplet', 'Density', recipe.density),
          createTarget('magic', 'spark', 'Magic', recipe.magicPower),
        ],
      }),
      element('p', {
        className: 'recipe__counter',
        attributes: { 'data-field': 'ingredient-counter' },
        children: [
          element('span', { textContent: 'Ingredients: ' }),
          element('strong', { textContent: `${used} / ${capacity}` }),
        ],
      }),
    ],
  });
}
