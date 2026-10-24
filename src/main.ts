import './styles/main.css';
import { element } from './utils/dom';
import { pauseGame, tickGame } from './state/game-state';
import { mainLayout } from './ui/layout';

function createRoot(): HTMLElement {
  return element('div', { attributes: { id: 'app' } });
}

const root = createRoot();
root.append(mainLayout());

document.body.append(root);

// The clock only refreshes the derived label; time itself comes from timestamps.
setInterval(tickGame, 200);

// A hidden tab must not keep the run going behind the player's back.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseGame();
  }
});
