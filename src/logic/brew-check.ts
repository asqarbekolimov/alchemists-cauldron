import type { ICauldronValues, IRecipe, IRecipeRange } from '../utils/types';

export function isWithinRange(value: number, range: IRecipeRange, tolerance: number): boolean {
  return value >= range.min - tolerance && value <= range.max + tolerance;
}

// Level 1 checks the plain cauldron sums, with no reactions involved.
export function isBrewSuccessful(
  recipe: IRecipe,
  values: ICauldronValues,
  tolerance: number,
): boolean {
  return (
    isWithinRange(values.temperature, recipe.temperature, tolerance) &&
    isWithinRange(values.density, recipe.density, tolerance) &&
    isWithinRange(values.magicPower, recipe.magicPower, tolerance)
  );
}
