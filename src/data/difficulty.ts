import type { Difficulty } from '../utils/types';

export interface IDifficultySettings {
  shelfSize: number;
  maxCauldronIngredients: number;
  startingTime: number;
  tolerance: number;
  lives: number;
  scorePerBrew: number;
  timeBonus: number;
}

// Single source of numbers from the README difficulty table.
export const DIFFICULTY_SETTINGS: Record<Difficulty, IDifficultySettings> = {
  easy: {
    shelfSize: 4,
    maxCauldronIngredients: 4,
    startingTime: 180,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonus: 15,
  },
  medium: {
    shelfSize: 6,
    maxCauldronIngredients: 4,
    startingTime: 150,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonus: 10,
  },
  hard: {
    shelfSize: 8,
    maxCauldronIngredients: 5,
    startingTime: 150,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonus: 5,
  },
};

// Level 1 always plays on Medium rules.
export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
