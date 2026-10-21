import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { SHELF_INGREDIENTS } from '../data/ingredients';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { pickRandomRecipe } from '../logic/recipe-generator';
import { createStock } from '../logic/stock';
import type { Difficulty, IGameState } from '../utils/types';

export { SHELF_INGREDIENTS } from '../data/ingredients';

export type BrewOutcome = 'success' | 'failure' | 'ignored';

const listeners = new Set<(state: IGameState) => void>();

// Start screen: empty shelf and cauldron, no score, time or lives yet.
export function createMenuState(): IGameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: pickRandomRecipe(DEFAULT_DIFFICULTY),
    cauldronIngredients: [],
    shelfStock: {},
    difficulty: DEFAULT_DIFFICULTY,
  };
}

// A fresh run: new random stock, full time and lives, and a random recipe.
export function createGameState(difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  return {
    status: 'playing',
    score: 0,
    timeLeft: settings.startingTime,
    lives: settings.lives,
    activeRecipe: pickRandomRecipe(difficulty),
    cauldronIngredients: [],
    shelfStock: createStock(SHELF_INGREDIENTS),
    difficulty,
  };
}

const store: { state: IGameState } = { state: createMenuState() };

function updateState(nextState: IGameState): void {
  store.state = nextState;

  for (const listener of listeners) {
    listener(store.state);
  }
}

export function getGameState(): IGameState {
  return store.state;
}

export function subscribe(listener: (state: IGameState) => void): void {
  listeners.add(listener);
}

export function startGame(): void {
  updateState(createGameState(store.state.difficulty ?? DEFAULT_DIFFICULTY));
}

export function addIngredientToCauldron(ingredientId: string): void {
  const nextState = addIngredient(store.state, ingredientId);

  if (nextState !== store.state) {
    updateState(nextState);
  }
}

export function brewCauldron(): BrewOutcome {
  const state = store.state;

  if (state.status !== 'playing' || state.cauldronIngredients.length === 0) {
    return 'ignored';
  }

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const values = calculateCauldron(state.cauldronIngredients);

  if (isBrewSuccessful(state.activeRecipe, values, settings.tolerance)) {
    updateState({
      ...state,
      score: state.score + settings.scorePerBrew,
      timeLeft: Math.min(settings.startingTime, state.timeLeft + settings.timeBonus),
      activeRecipe: pickRandomRecipe(difficulty),
      cauldronIngredients: [],
    });

    return 'success';
  }

  updateState({
    ...state,
    lives: Math.max(0, state.lives - 1),
    cauldronIngredients: [],
  });

  return 'failure';
}
