import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import type { IGameState } from '../utils/types';

export function canAddIngredient(state: IGameState, ingredientId: string): boolean {
  const isPlaying = state.status === 'playing';
  const { maxCauldronIngredients } = DIFFICULTY_SETTINGS[state.difficulty ?? DEFAULT_DIFFICULTY];
  const hasRoom = state.cauldronIngredients.length < maxCauldronIngredients;
  const hasStock = (state.shelfStock[ingredientId] ?? 0) > 0;

  return isPlaying && hasRoom && hasStock;
}

// Adds one portion of an ingredient to the cauldron and spends it from the shelf.
// Returns the same state object when the action is not allowed.
export function addIngredient(state: IGameState, ingredientId: string): IGameState {
  if (!canAddIngredient(state, ingredientId)) {
    return state;
  }

  const ingredient = INGREDIENTS.find((item) => item.id === ingredientId);

  if (!ingredient) {
    return state;
  }

  const stock = state.shelfStock[ingredientId] ?? 0;

  return {
    ...state,
    cauldronIngredients: [...state.cauldronIngredients, ingredient],
    shelfStock: { ...state.shelfStock, [ingredientId]: stock - 1 },
  };
}
