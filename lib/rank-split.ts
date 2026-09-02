/**
 * rank-split — ported verbatim from old Plait (`src/services/meals.ts`).
 *
 * Given a ranked list (best → worst), returns a map of id → share (0..1).
 * 1st place pays 0% (for n >= 4). Payouts rise exponentially toward last.
 *
 * Approx shape:
 *   n=2 → 30/70
 *   n=3 → 10/25.5/64.5
 *   n=4 →  0/9/24.5/66.5
 *   n=6 →  0/4.25/7.75/14.25/26/47.75
 *   n=8 →  0/2.5/4/6.25/9.75/15.5/24/38
 */
export function computeRankSplit(rankedIds: string[]): Record<string, number> {
  const n = rankedIds.length;
  if (n === 0) return {};
  if (n === 1) return { [rankedIds[0]]: 1 };
  if (n === 2) {
    return { [rankedIds[0]]: 0.3, [rankedIds[1]]: 0.7 };
  }

  const round025 = (x: number) => Math.round(x * 4) / 4;

  if (n === 3) {
    return {
      [rankedIds[0]]: 0.1,
      [rankedIds[1]]: 0.255,
      [rankedIds[2]]: 0.645,
    };
  }

  // n >= 4: first place pays 0%. Distribute 100% across ranks 2..n.
  const m = n - 1;
  const targetRatio = Math.min(30, 2 + m * 1.8);
  const base = m === 1 ? 1 : Math.pow(targetRatio, 1 / (m - 1));
  const weights: number[] = [];
  for (let i = 0; i < m; i++) weights.push(Math.pow(base, i));
  const total = weights.reduce((s, w) => s + w, 0);

  const paid = weights.map((w) => round025((w / total) * 100));
  for (let i = 0; i < paid.length; i++) if (paid[i] < 0) paid[i] = 0;
  for (let i = 1; i < paid.length; i++) {
    if (paid[i] < paid[i - 1]) paid[i] = paid[i - 1];
  }
  const sum = paid.reduce((s, p) => s + p, 0);
  paid[paid.length - 1] = round025(paid[paid.length - 1] + (100 - sum));

  const out: Record<string, number> = {};
  rankedIds.forEach((id, i) => {
    if (i === 0) out[id] = 0;
    else out[id] = paid[i - 1] / 100;
  });
  return out;
}
