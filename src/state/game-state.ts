import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { SHELF_INGREDIENTS } from '../data/ingredients';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { isOutOfIngredients } from '../logic/game-over';
import { pickRandomRecipe } from '../logic/recipe-generator';
import { createStock } from '../logic/stock';
import { addTimeBonus, getRemainingSeconds } from '../logic/timer';
import type { Difficulty, GameOverReason, IGameState } from '../utils/types';

export { SHELF_INGREDIENTS } from '../data/ingredients';

export type BrewOutcome = 'success' | 'failure' | 'ignored';

const listeners = new Set<(state: IGameState) => void>();

// Start screen: empty shelf and cauldron, no score, time or lives yet.
export function createMenuState(difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: pickRandomRecipe(difficulty),
    cauldronIngredients: [],
    shelfStock: {},
    difficulty,
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
    endTime: Date.now() + settings.startingTime * 1000,
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

function finishRun(state: IGameState, reason: GameOverReason): IGameState {
  return { ...state, status: 'game-over', gameOverReason: reason };
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

// Called by the clock: recomputes the remaining time from the stored end time.
export function tickGame(now = Date.now()): void {
  const state = store.state;

  if (state.status !== 'playing' || state.endTime === undefined) {
    return;
  }

  const timeLeft = getRemainingSeconds(state.endTime, now);

  if (timeLeft <= 0) {
    updateState(finishRun({ ...state, timeLeft: 0 }, 'time'));
    return;
  }

  if (timeLeft !== state.timeLeft) {
    updateState({ ...state, timeLeft });
  }
}

// Freezing keeps the exact remaining time; resume shifts the end timestamp by the pause duration.
export function pauseGame(): void {
  tickGame();

  const state = store.state;

  if (state.status !== 'playing') {
    return;
  }

  const now = Date.now();
  const timeLeft =
    state.endTime === undefined ? state.timeLeft : getRemainingSeconds(state.endTime, now);

  updateState({ ...state, status: 'paused', timeLeft, pausedAt: now });
}

export function resumeGame(): void {
  const state = store.state;

  if (state.status !== 'paused') {
    return;
  }

  const now = Date.now();
  const pauseDuration = state.pausedAt === undefined ? 0 : now - state.pausedAt;
  const endTime = (state.endTime ?? now + state.timeLeft * 1000) + pauseDuration;

  updateState({
    ...state,
    status: 'playing',
    endTime,
    timeLeft: getRemainingSeconds(endTime, now),
    pausedAt: undefined,
  });
}

export function exitToMenu(): void {
  const state = store.state;

  if (state.status !== 'paused') {
    return;
  }

  updateState(createMenuState(state.difficulty ?? DEFAULT_DIFFICULTY));
}

export function addIngredientToCauldron(ingredientId: string): void {
  tickGame();

  const nextState = addIngredient(store.state, ingredientId);

  if (nextState !== store.state) {
    updateState(nextState);
  }
}

export function brewCauldron(): BrewOutcome {
  tickGame();

  const state = store.state;

  if (state.status !== 'playing' || state.cauldronIngredients.length === 0) {
    return 'ignored';
  }

  const difficulty = state.difficulty ?? DEFAULT_DIFFICULTY;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const values = calculateCauldron(state.cauldronIngredients);
  const now = Date.now();

  if (isBrewSuccessful(state.activeRecipe, values, settings.tolerance)) {
    const endTime = addTimeBonus(
      state.endTime ?? now + state.timeLeft * 1000,
      settings.timeBonus,
      settings.startingTime,
      now,
    );
    const brewedState: IGameState = {
      ...state,
      score: state.score + settings.scorePerBrew,
      endTime,
      timeLeft: getRemainingSeconds(endTime, now),
      activeRecipe: pickRandomRecipe(difficulty),
      cauldronIngredients: [],
      status: 'playing',
      gameOverReason: undefined,
    };

    updateState(
      isOutOfIngredients(brewedState) ? finishRun(brewedState, 'ingredients') : brewedState,
    );

    return 'success';
  }

  const failedState: IGameState = {
    ...state,
    lives: Math.max(0, state.lives - 1),
    cauldronIngredients: [],
    status: 'playing',
    gameOverReason: undefined,
  };

  let reason: GameOverReason | undefined;

  if (failedState.lives <= 0) {
    reason = 'lives';
  } else if (isOutOfIngredients(failedState)) {
    reason = 'ingredients';
  }

  updateState(reason ? finishRun(failedState, reason) : failedState);

  return 'failure';
}
