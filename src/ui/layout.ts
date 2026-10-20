import { INGREDIENTS } from '../data/ingredients';
import type { IRecipe } from '../utils/types';
import { element } from '../utils/dom';
import { createActions } from './actions';
import { createBars } from './bars';
import { createCauldron } from './cauldron';
import { createHeader } from './header';
import { createRecipePanel } from './recipe';
import { createShelf } from './shelf';

// Static preview data used until the game state is wired up (US 1.3+).
const PREVIEW_RECIPE: IRecipe = {
  id: 'moon-mist',
  name: 'Moon Mist',
  difficulty: 'medium',
  temperature: { min: 32, max: 42 },
  density: { min: 12, max: 22 },
  magicPower: { min: 17, max: 27 },
};

const PREVIEW_STOCK = [9, 12, 7, 10, 8, 5];
const MAX_INGREDIENTS = 4;

export function mainLayout(): HTMLElement {
  const shelfItems = INGREDIENTS.slice(0, 6).map((ingredient, index) => ({
    ingredient,
    stock: PREVIEW_STOCK[index] ?? 0,
  }));

  return element('div', {
    className: 'layout',
    children: [
      createHeader({ score: 0, timeLeft: 150, lives: 3 }),
      element('h1', { className: 'title', textContent: "Alchemist's Cauldron" }),
      element('main', {
        className: 'main',
        children: [
          createShelf(shelfItems),
          createCauldron(),
          createRecipePanel(PREVIEW_RECIPE, 0, MAX_INGREDIENTS),
        ],
      }),
      createBars(PREVIEW_RECIPE, { temperature: 0, density: 0, magicPower: 0 }),
      createActions(),
    ],
  });
}
