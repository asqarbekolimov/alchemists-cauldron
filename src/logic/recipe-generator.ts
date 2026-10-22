import { RECIPES } from '../data/recipes';
import type { Difficulty, IRecipe } from '../utils/types';

export function getRecipesByDifficulty(difficulty: Difficulty): readonly IRecipe[] {
  return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

// Picks one random recipe from the pool of the requested difficulty.
export function pickRandomRecipe(difficulty: Difficulty): IRecipe {
  const pool = getRecipesByDifficulty(difficulty);
  const index = Math.floor(Math.random() * pool.length);
  const recipe = pool[index];

  if (!recipe) {
    throw new Error(`No recipes configured for difficulty "${difficulty}".`);
  }

  return recipe;
}
