import { formatLeaderboardDate } from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../utils/types';
import { element } from '../utils/dom';
import { icon } from './icons';

export interface LeaderboardHandlers {
  getEntries: () => ILeaderboardEntry[];
  onClear: () => void;
}

export interface LeaderboardView {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

const COLUMNS = [
  { label: 'Rank', className: 'leaderboard__rank' },
  { label: 'Name', className: 'leaderboard__name' },
  { label: 'Score', className: 'leaderboard__score' },
  { label: 'Date', className: 'leaderboard__date' },
];

function createRow(entry: ILeaderboardEntry, index: number): HTMLElement {
  return element('tr', {
    children: [
      element('td', { className: 'leaderboard__rank', textContent: String(index + 1) }),
      element('td', { className: 'leaderboard__name', textContent: entry.name }),
      element('td', { className: 'leaderboard__score', textContent: String(entry.score) }),
      element('td', {
        className: 'leaderboard__date',
        textContent: formatLeaderboardDate(entry.date),
      }),
    ],
  });
}

export function createLeaderboardView(handlers: LeaderboardHandlers): LeaderboardView {
  const headerCells = COLUMNS.map((column) =>
    element('th', {
      className: column.className,
      textContent: column.label,
      attributes: { scope: 'col' },
    }),
  );

  const tableHead = element('thead', {
    children: [element('tr', { children: headerCells })],
  });

  const tableBody = element('tbody');

  const table = element('table', {
    className: 'leaderboard__table',
    children: [tableHead, tableBody],
  });

  const tableWrap = element('div', {
    className: 'leaderboard__table-wrap',
    children: [table],
  });

  const clearButton = element('button', {
    className: 'btn btn--danger-ghost',
    textContent: 'Clear Leaderboard',
    attributes: { type: 'button', 'data-action': 'clear-leaderboard' },
    events: { click: showConfirm },
  });

  const footerClose = element('button', {
    className: 'btn btn--outline',
    textContent: 'Close',
    attributes: { type: 'button', 'data-action': 'leaderboard-close-footer' },
    events: { click: close },
  });

  const footer = element('div', {
    className: 'leaderboard__footer',
    children: [clearButton, footerClose],
  });

  const eyebrow = element('p', {
    className: 'leaderboard__eyebrow',
    textContent: 'Hall of fame',
  });

  const title = element('h2', {
    className: 'leaderboard__title',
    textContent: 'Top Players',
    attributes: { id: 'leaderboard-title' },
  });

  const closeButton = element('button', {
    className: 'leaderboard__close',
    attributes: {
      type: 'button',
      'data-action': 'leaderboard-close-icon',
      'aria-label': 'Close leaderboard',
    },
    children: [icon('close', 'leaderboard__close-icon')],
    events: { click: close },
  });

  const heading = element('div', {
    className: 'leaderboard__heading',
    children: [eyebrow, title],
  });

  const header = element('div', {
    className: 'leaderboard__header',
    children: [heading, closeButton],
  });

  const panel = element('div', {
    className: 'leaderboard__panel',
    children: [header, tableWrap, footer],
  });

  const cancelButton = element('button', {
    className: 'btn btn--outline',
    textContent: 'Cancel',
    attributes: { type: 'button', 'data-action': 'clear-cancel' },
    events: {
      click: () => {
        confirm.hidden = true;
        clearButton.focus();
      },
    },
  });

  const confirmButton = element('button', {
    className: 'btn btn--danger',
    textContent: 'Clear',
    attributes: { type: 'button', 'data-action': 'clear-confirm' },
    events: {
      click: () => {
        handlers.onClear();
        render();
        confirm.hidden = true;
        closeButton.focus();
      },
    },
  });

  const confirmTitle = element('h3', {
    className: 'leaderboard__confirm-title',
    textContent: 'Clear leaderboard?',
    attributes: { id: 'leaderboard-confirm-title' },
  });

  const confirmText = element('p', {
    className: 'leaderboard__confirm-text',
    textContent: 'All saved results will be removed. This cannot be undone.',
  });

  const confirmActions = element('div', {
    className: 'leaderboard__confirm-actions',
    children: [cancelButton, confirmButton],
  });

  const confirmPanel = element('div', {
    className: 'leaderboard__confirm-panel',
    attributes: {
      role: 'alertdialog',
      'aria-labelledby': 'leaderboard-confirm-title',
    },
    children: [confirmTitle, confirmText, confirmActions],
  });

  const confirm = element('div', {
    className: 'leaderboard__confirm',
    attributes: { 'data-field': 'leaderboard-confirm' },
    children: [confirmPanel],
  });

  confirm.hidden = true;

  const root = element('section', {
    className: 'leaderboard',
    attributes: {
      'data-field': 'leaderboard',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'leaderboard-title',
    },
    children: [panel, confirm],
    events: { keydown: handleKeydown },
  });

  root.hidden = true;

  let lastFocused: HTMLElement | undefined;

  function render(): void {
    const entries = handlers.getEntries();
    const rows = entries.map((entry, index) => createRow(entry, index));

    if (rows.length === 0) {
      rows.push(
        element('tr', {
          children: [
            element('td', {
              className: 'leaderboard__empty',
              textContent: 'No scores yet. Finish a run to claim a place.',
              attributes: { colspan: '4' },
            }),
          ],
        }),
      );
    }

    tableBody.replaceChildren(...rows);
    clearButton.disabled = entries.length === 0;
  }

  function open(): void {
    const activeElement = document.activeElement;
    lastFocused = activeElement instanceof HTMLElement ? activeElement : undefined;
    render();
    confirm.hidden = true;
    root.hidden = false;
    closeButton.focus();
  }

  function close(): void {
    root.hidden = true;
    confirm.hidden = true;
    lastFocused?.focus();
  }

  function showConfirm(): void {
    if (clearButton.disabled) {
      return;
    }

    confirm.hidden = false;
    cancelButton.focus();
  }

  function handleKeydown(event: Event): void {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Escape') {
      return;
    }

    event.preventDefault();

    if (!confirm.hidden) {
      confirm.hidden = true;
      clearButton.focus();
      return;
    }

    close();
  }

  return { element: root, open, close };
}
