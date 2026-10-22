import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { calculateCauldron } from '../logic/calculate-cauldron';
import {
  addIngredientToCauldron,
  brewCauldron,
  getGameState,
  SHELF_INGREDIENTS,
  startGame,
  subscribe,
} from '../state/game-state';
import { createActionsView } from './actions';
import { createBarsView } from './bars';
import { createCauldronView } from './cauldron';
import { createGameOverView } from './game-over';
import { createHeaderView } from './header';
import { createRecipeView } from './recipe';
import { createShelfView } from './shelf';

export function mainLayout(): HTMLElement {
  const state = getGameState();

  const header = createHeaderView();
  const shelf = createShelfView(SHELF_INGREDIENTS, (ingredientId) =>
    addIngredientToCauldron(ingredientId),
  );
  const cauldron = createCauldronView();
  const recipe = createRecipeView();
  const bars = createBarsView();
  const actions = createActionsView({
    onStart: startGame,
    onBrew: () => {
      brewCauldron();
    },
  });
  const gameOver = createGameOverView(startGame);

  const layout = element('div', {
    className: 'layout',
    children: [
      header.element,
      element('h1', { className: 'title', textContent: "Alchemist's Cauldron" }),
      element('main', {
        className: 'main',
        children: [shelf.element, cauldron.element, recipe.element],
      }),
      bars.element,
      actions.element,
      gameOver.element,
    ],
  });

  const render = (nextState: IGameState): void => {
    const settings = DIFFICULTY_SETTINGS[nextState.difficulty ?? DEFAULT_DIFFICULTY];
    const values = calculateCauldron(nextState.cauldronIngredients);

    header.update(nextState);
    shelf.update(nextState, settings.maxCauldronIngredients);
    cauldron.update(nextState);
    recipe.update(nextState, settings.maxCauldronIngredients);
    bars.update(nextState.activeRecipe, values);
    actions.update(nextState);
    gameOver.update(nextState);
  };

  subscribe(render);
  render(state);

  return layout;
}
