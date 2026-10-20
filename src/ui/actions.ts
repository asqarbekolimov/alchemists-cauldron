import { element } from '../utils/dom';
import { icon, type IconName } from './icons';

function createGhostButton(
  label: string,
  iconName: IconName,
  action: string,
  align: 'start' | 'end',
): HTMLElement {
  return element('button', {
    className: `btn btn--ghost btn--${align}`,
    attributes: { type: 'button', 'data-action': action },
    children: [
      icon(iconName, 'btn__icon'),
      element('span', { className: 'btn__label', textContent: label }),
    ],
  });
}

export function createActions(): HTMLElement {
  const brew = element('button', {
    className: 'btn btn--brew',
    textContent: 'Brew',
    attributes: { type: 'button', 'data-action': 'brew' },
  });

  return element('footer', {
    className: 'actions',
    children: [
      createGhostButton('Help', 'book', 'help', 'start'),
      brew,
      createGhostButton('Settings', 'gear', 'settings', 'end'),
    ],
  });
}
