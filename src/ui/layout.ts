import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { calculateCauldron } from '../logic/calculate-cauldron';
import {
  addIngredientToCauldron,
  getGameState,
  MAX_CAULDRON_SIZE,
  SHELF_INGREDIENTS,
  subscribe,
} from '../state/game-state';
import { createActions } from './actions';
import { createBarsView } from './bars';
import { createCauldronView } from './cauldron';
import { createHeader } from './header';
import { createRecipeView } from './recipe';
import { createShelfView } from './shelf';

export function mainLayout(): HTMLElement {
  const state = getGameState();

  const shelf = createShelfView(SHELF_INGREDIENTS, (ingredientId) =>
    addIngredientToCauldron(ingredientId),
  );
  const cauldron = createCauldronView();
  const recipe = createRecipeView(MAX_CAULDRON_SIZE);
  const bars = createBarsView();

  const layout = element('div', {
    className: 'layout',
    children: [
      createHeader({ score: state.score, timeLeft: state.timeLeft, lives: state.lives }),
      element('h1', { className: 'title', textContent: "Alchemist's Cauldron" }),
      element('main', {
        className: 'main',
        children: [shelf.element, cauldron.element, recipe.element],
      }),
      bars.element,
      createActions(),
    ],
  });

  const render = (nextState: IGameState): void => {
    const values = calculateCauldron(nextState.cauldronIngredients);

    shelf.update(nextState, MAX_CAULDRON_SIZE);
    cauldron.update(nextState);
    recipe.update(nextState);
    bars.update(nextState.activeRecipe, values);
  };

  subscribe(render);
  render(state);

  return layout;
}
