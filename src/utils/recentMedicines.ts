import { medicines } from '../data/medicines';
import type { Medicine } from '../types/medicine';
import { useAppStore } from '../store';

const STORAGE_KEY = 'miaris_recently_viewed';

export function getRecentlyViewedMedicines(): Medicine[] {
  // Try Zustand store first
  try {
    const storeIds = useAppStore.getState().recentlyViewedIds;
    if (storeIds && storeIds.length > 0) {
      const found = storeIds
        .map((id) => medicines.find((m) => m.id === id))
        .filter((m): m is Medicine => Boolean(m));
      if (found.length > 0) return found;
    }
  } catch {
    // Fallback to localStorage directly
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [medicines[0], medicines[1], medicines[2]];
    }
    const ids: string[] = JSON.parse(raw);
    const found = ids
      .map((id) => medicines.find((m) => m.id === id))
      .filter((m): m is Medicine => Boolean(m));

    return found.length > 0 ? found : [medicines[0], medicines[1]];
  } catch {
    return [medicines[0], medicines[1]];
  }
}

export function recordMedicineViewed(id: string): void {
  try {
    useAppStore.getState().addRecentlyViewedId(id);
  } catch {
    // Ignore store access error
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let ids: string[] = raw ? JSON.parse(raw) : [];
    ids = [id, ...ids.filter((item) => item !== id)].slice(0, 6);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}
