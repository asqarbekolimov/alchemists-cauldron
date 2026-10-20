import './styles/main.css';
import { element } from './utils/dom';
import { mainLayout } from './ui/layout';

function createRoot(): HTMLElement {
  return element('div', { attributes: { id: 'app' } });
}

const root = createRoot();
root.append(mainLayout());

document.body.append(root);
