// IndexedDB storage for large media (video backgrounds, high-resolution logos)
// IndexedDB provides hundreds of megabytes of quota, preventing localStorage 5MB QuotaExceededError.

const DB_NAME = 'vibehub_media_store';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaItem(key: string, data: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.warn('[MediaStorage] Failed to write item:', key, tx.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('[MediaStorage] IndexedDB open error:', err);
    return false;
  }
}

export async function getMediaItem(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('[MediaStorage] IndexedDB read error:', err);
    return null;
  }
}

export async function removeMediaItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch (err) {
    console.warn('[MediaStorage] IndexedDB delete error:', err);
  }
}
