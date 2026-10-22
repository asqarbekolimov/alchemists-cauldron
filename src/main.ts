import './styles/main.css';
import { element } from './utils/dom';
import { tickGame } from './state/game-state';
import { mainLayout } from './ui/layout';

function createRoot(): HTMLElement {
  return element('div', { attributes: { id: 'app' } });
}

const root = createRoot();
root.append(mainLayout());

document.body.append(root);

// The clock only refreshes the derived label; time itself comes from timestamps.
setInterval(tickGame, 200);
