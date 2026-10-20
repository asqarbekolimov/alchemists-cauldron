import type { IIngredient } from '../utils/types';

export const MIN_STOCK = 2;
export const MAX_STOCK = 15;

function createRandomStock(): number {
  return Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
}

// Gives every ingredient on the shelf its own random 2..15 stock.
export function createStock(ingredients: readonly IIngredient[]): Record<string, number> {
  const stock: Record<string, number> = {};

  for (const ingredient of ingredients) {
    stock[ingredient.id] = createRandomStock();
  }

  return stock;
}
