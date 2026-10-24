import type { IGameState } from '../utils/types';

// The run is over when the shelf has no portions left and the cauldron is empty.
export function isOutOfIngredients(state: IGameState): boolean {
  const isShelfEmpty = Object.values(state.shelfStock).every((stock) => stock <= 0);

  return isShelfEmpty && state.cauldronIngredients.length === 0;
}
