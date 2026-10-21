import type { ICauldronValues, IIngredient } from '../utils/types';

// Sums the parameter values of every ingredient currently in the cauldron.
export function calculateCauldron(ingredients: readonly IIngredient[]): ICauldronValues {
  const values: ICauldronValues = { temperature: 0, density: 0, magicPower: 0 };

  for (const ingredient of ingredients) {
    values.temperature += ingredient.temperature;
    values.density += ingredient.density;
    values.magicPower += ingredient.magicPower;
  }

  return values;
}
