import type { ILeaderboardEntry } from '../utils/types';

export const LEADERBOARD_SIZE = 10;
export const LEADERBOARD_STORAGE_KEY = 'alchemists-cauldron:leaderboard:v1';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 15;
const PLAYER_NAME_PATTERN = /^[A-Za-z0-9 _-]+$/;

export function isValidPlayerName(value: string): boolean {
  const name = value.trim();

  return (
    name.length >= MIN_NAME_LENGTH &&
    name.length <= MAX_NAME_LENGTH &&
    PLAYER_NAME_PATTERN.test(name)
  );
}

export function sortLeaderboard(entries: ILeaderboardEntry[]): ILeaderboardEntry[] {
  return entries.toSorted((a, b) => b.score - a.score || a.date - b.date);
}

export function addLeaderboardEntry(
  entries: ILeaderboardEntry[],
  entry: ILeaderboardEntry,
): ILeaderboardEntry[] {
  return sortLeaderboard([...entries, entry]).slice(0, LEADERBOARD_SIZE);
}

export function isTopTenScore(score: number, entries: ILeaderboardEntry[]): boolean {
  if (!Number.isFinite(score) || score < 0) {
    return false;
  }

  if (entries.length < LEADERBOARD_SIZE) {
    return true;
  }

  const lastEntry = sortLeaderboard(entries)[LEADERBOARD_SIZE - 1];

  return score > lastEntry.score;
}

function isLeaderboardEntry(value: unknown): value is ILeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.name === 'string' &&
    isValidPlayerName(candidate.name) &&
    typeof candidate.score === 'number' &&
    Number.isFinite(candidate.score) &&
    candidate.score >= 0 &&
    typeof candidate.date === 'number' &&
    Number.isFinite(candidate.date) &&
    candidate.date >= 0
  );
}

export function normalizeLeaderboard(value: unknown): ILeaderboardEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries = value.filter(isLeaderboardEntry).map((entry) => ({
    name: entry.name.trim(),
    score: Math.floor(entry.score),
    date: entry.date,
  }));

  return sortLeaderboard(entries).slice(0, LEADERBOARD_SIZE);
}

export function formatLeaderboardDate(timestamp: number): string {
  const value = new Date(timestamp);

  if (Number.isNaN(value.getTime())) {
    return '--';
  }

  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = String(value.getFullYear()).padStart(4, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
