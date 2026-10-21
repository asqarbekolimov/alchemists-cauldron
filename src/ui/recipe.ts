import type { IGameState, IRecipeRange } from '../utils/types';
import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

export interface RecipeView {
  element: HTMLElement;
  update(state: IGameState, capacity: number): void;
}

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

export function createRecipeView(): RecipeView {
  const name = element('p', { className: 'recipe__name' });
  const counterValue = element('strong');
  const counter = element('p', {
    className: 'recipe__counter',
    attributes: { 'data-field': 'ingredient-counter', 'aria-live': 'polite' },
    children: [element('span', { textContent: 'Ingredients: ' }), counterValue],
  });
  const targets = element('ul', { className: 'recipe__targets' });

  const root = element('aside', {
    className: 'panel recipe',
    attributes: { 'aria-labelledby': 'recipe-title' },
    children: [
      element('h2', {
        className: 'recipe__eyebrow',
        textContent: 'Current Recipe',
        attributes: { id: 'recipe-title' },
      }),
      name,
      element('div', {
        className: 'recipe__art',
        attributes: { 'aria-hidden': 'true' },
        children: [icon('flask', 'recipe__art-icon')],
      }),
      targets,
      counter,
    ],
  });

  function update(state: IGameState, capacity: number): void {
    const recipe = state.activeRecipe;

    name.textContent = recipe.name;
    targets.replaceChildren(
      createTarget('temperature', 'thermometer', 'Temp', recipe.temperature),
      createTarget('density', 'droplet', 'Density', recipe.density),
      createTarget('magic', 'spark', 'Magic', recipe.magicPower),
    );
    counterValue.textContent = `${state.cauldronIngredients.length} / ${capacity}`;
    counter.classList.toggle('recipe__counter--full', state.cauldronIngredients.length >= capacity);
  }

  return { element: root, update };
}
