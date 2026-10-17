// Safe localStorage access with quota and privacy error resilience

export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key}:`, err);
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[Storage] Quota or access error setting ${key}:`, err);
    // Attempt emergency cleanup of cached data if quota exceeded
    try {
      localStorage.removeItem('vibehub_articles_v1');
      localStorage.removeItem('vibehub_comments_v1');
      localStorage.setItem(key, value);
      return true;
    } catch {
      // Gracefully prevent app crash if still exceeding quota
      return false;
    }
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove ${key}:`, err);
  }
}
