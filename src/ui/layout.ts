import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { IGameState } from '../utils/types';
import { element } from '../utils/dom';
import { calculateCauldron } from '../logic/calculate-cauldron';
import {
  addIngredientToCauldron,
  brewCauldron,
  exitToMenu,
  getGameState,
  pauseGame,
  resumeGame,
  SHELF_INGREDIENTS,
  startGame,
  subscribe,
} from '../state/game-state';
import {
  canEnterLeaderboard,
  clearLeaderboard,
  getLeaderboardEntries,
  saveLeaderboardEntry,
} from '../state/leaderboard';
import { createActionsView } from './actions';
import { createBarsView } from './bars';
import { createCauldronView } from './cauldron';
import { createGameOverView } from './game-over';
import { createHeaderView } from './header';
import { createLeaderboardView } from './leaderboard';
import { createPauseView } from './pause';
import { createRecipeView } from './recipe';
import { createShelfView } from './shelf';

export function mainLayout(): HTMLElement {
  const state = getGameState();

  const header = createHeaderView(pauseGame);
  const shelf = createShelfView(SHELF_INGREDIENTS, (ingredientId) =>
    addIngredientToCauldron(ingredientId),
  );
  const cauldron = createCauldronView();
  const recipe = createRecipeView();
  const bars = createBarsView();
  const leaderboard = createLeaderboardView({
    getEntries: getLeaderboardEntries,
    onClear: clearLeaderboard,
  });
  const actions = createActionsView({
    onStart: startGame,
    onBrew: () => {
      brewCauldron();
    },
    onLeaderboard: leaderboard.open,
  });
  const gameOver = createGameOverView({
    onPlayAgain: startGame,
    onOpenLeaderboard: leaderboard.open,
    canSaveScore: canEnterLeaderboard,
    onSaveScore: saveLeaderboardEntry,
  });
  const pause = createPauseView({ onResume: resumeGame, onExit: exitToMenu });

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
      pause.element,
      leaderboard.element,
    ],
  });

  const render = (nextState: IGameState): void => {
    const settings = DIFFICULTY_SETTINGS[nextState.difficulty ?? DEFAULT_DIFFICULTY];
    const values = calculateCauldron(nextState.cauldronIngredients);

    layout.classList.toggle('layout--paused', nextState.status === 'paused');
    header.update(nextState);
    shelf.update(nextState, settings.maxCauldronIngredients);
    cauldron.update(nextState);
    recipe.update(nextState, settings.maxCauldronIngredients);
    bars.update(nextState.activeRecipe, values);
    actions.update(nextState);
    gameOver.update(nextState);
    pause.update(nextState);
  };

  subscribe(render);
  render(state);

  return layout;
}
