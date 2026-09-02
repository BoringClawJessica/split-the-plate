/**
 * split-state — prototype in-progress-split persistence via sessionStorage.
 *
 * The New Split flow now assigns items to people ONCE, up front
 * (on the Items Detected step). Downstream screens (By Item, Review,
 * Gamble Pay) just READ what's already been assigned.
 *
 * We use sessionStorage so the state survives client navigations
 * within a single tab without needing a full app-wide context.
 */

export type SplitPerson = {
  id: string;
  name: string;
  avatar: string;
  handle?: string;
};

export type SplitItem = {
  id: string;
  name: string;
  price: number;
  /** People IDs assigned to this item. If multiple, price is divided evenly. */
  assignedTo: string[];
};

export type SplitState = {
  people: SplitPerson[];
  items: SplitItem[];
  restaurant: string;
  /** Who's collecting the money. Baseline: current user is the leader. */
  leaderId: string;
};

const KEY = "stp:split";

const isBrowser = () => typeof window !== "undefined";

export function readSplit(): SplitState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SplitState;
    if (!parsed || !Array.isArray(parsed.people) || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSplit(state: SplitState): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function clearSplit(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Per-person totals from item assignments.
 * If an item is assigned to N people, its price is split evenly N ways.
 * Unassigned items are ignored (they're implicitly "shared" — the caller
 * decides whether to warn / distribute them).
 */
export function computePerPersonFromAssignments(
  people: SplitPerson[],
  items: SplitItem[],
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of people) out[p.id] = 0;
  for (const item of items) {
    if (item.assignedTo.length === 0) continue;
    const share = item.price / item.assignedTo.length;
    for (const pid of item.assignedTo) {
      if (out[pid] == null) out[pid] = 0;
      out[pid] += share;
    }
  }
  return out;
}

export function unassignedItems(items: SplitItem[]): SplitItem[] {
  return items.filter((i) => i.assignedTo.length === 0);
}
