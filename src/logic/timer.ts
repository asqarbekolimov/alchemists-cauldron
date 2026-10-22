// Remaining time is always derived from absolute timestamps, never counted down.
export function getRemainingSeconds(endTime: number, now: number): number {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}

// Adds the brew bonus but never lets the remaining time exceed the starting time.
export function addTimeBonus(
  endTime: number,
  bonusSeconds: number,
  startingTime: number,
  now: number,
): number {
  return Math.min(now + startingTime * 1000, endTime + bonusSeconds * 1000);
}
