import {
  LEADERBOARD_STORAGE_KEY,
  addLeaderboardEntry,
  isTopTenScore,
  isValidPlayerName,
  normalizeLeaderboard,
} from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../utils/types';

export interface ISaveLeaderboardResult {
  saved: boolean;
  persisted: boolean;
}

const store: { entries?: ILeaderboardEntry[] } = {};

function readEntries(): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);

    return raw === null ? [] : normalizeLeaderboard(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

function getStoredEntries(): ILeaderboardEntry[] {
  store.entries ??= readEntries();

  return store.entries;
}

function didPersist(nextEntries: ILeaderboardEntry[]): boolean {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(nextEntries));

    return true;
  } catch {
    return false;
  }
}

export function getLeaderboardEntries(): ILeaderboardEntry[] {
  return [...getStoredEntries()];
}

export function canEnterLeaderboard(score: number): boolean {
  return isTopTenScore(score, getStoredEntries());
}

export function saveLeaderboardEntry(
  name: string,
  score: number,
  date = Date.now(),
): ISaveLeaderboardResult {
  const playerName = name.trim();

  if (!isValidPlayerName(playerName) || !canEnterLeaderboard(score)) {
    return { saved: false, persisted: false };
  }

  const nextEntries = addLeaderboardEntry(getStoredEntries(), {
    name: playerName,
    score: Math.max(0, Math.floor(score)),
    date: Number.isFinite(date) ? date : Date.now(),
  });

  store.entries = nextEntries;

  return { saved: true, persisted: didPersist(nextEntries) };
}

export function clearLeaderboard(): void {
  store.entries = [];

  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch {
    return;
  }
}
