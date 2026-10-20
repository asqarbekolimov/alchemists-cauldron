import { SHELF_INGREDIENTS } from '../data/ingredients';
import { addIngredient } from '../logic/add-ingredient';
import { createStock } from '../logic/stock';
import type { IGameState, IRecipe } from '../utils/types';

export { SHELF_INGREDIENTS } from '../data/ingredients';
export { MAX_CAULDRON_SIZE } from '../logic/add-ingredient';

export const INITIAL_TIME = 150;
export const INITIAL_LIVES = 3;

// Temporary fixed recipe until US 1.3 adds the recipe pool and generator.
const START_RECIPE: IRecipe = {
  id: 'moon-mist',
  name: 'Moon Mist',
  difficulty: 'medium',
  temperature: { min: 32, max: 42 },
  density: { min: 12, max: 22 },
  magicPower: { min: 17, max: 27 },
};

const listeners = new Set<(state: IGameState) => void>();

// A fresh game: new random shelf stock and an empty cauldron.
export function createGameState(): IGameState {
  return {
    status: 'playing',
    score: 0,
    timeLeft: INITIAL_TIME,
    lives: INITIAL_LIVES,
    activeRecipe: START_RECIPE,
    cauldronIngredients: [],
    shelfStock: createStock(SHELF_INGREDIENTS),
    difficulty: 'medium',
  };
}

const store: { state: IGameState } = { state: createGameState() };

export function getGameState(): IGameState {
  return store.state;
}

export function subscribe(listener: (state: IGameState) => void): void {
  listeners.add(listener);
}

export function addIngredientToCauldron(ingredientId: string): void {
  const nextState = addIngredient(store.state, ingredientId);

  if (nextState === store.state) {
    return;
  }

  store.state = nextState;

  for (const listener of listeners) {
    listener(store.state);
  }
}
