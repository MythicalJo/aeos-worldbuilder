import { Character, TimelineEvent, MarkdownDoc, Book, Faction, Location, WorldSettings, CustomCategory, CustomEntry } from '../types';
import {
  initialWorldSettings,
  initialBooks,
  initialFactions,
  initialCharacters,
  initialLocations,
  initialTimelineEvents,
  initialMarkdownDocs
} from '../data/seedData';

const DB_NAME = 'AeosWorldbuildingDB';
const DB_VERSION = 1;

export interface AppDataDump {
  version: string;
  exportedAt: string;
  settings: WorldSettings;
  books: Book[];
  factions: Faction[];
  characters: Character[];
  locations: Location[];
  timeline: TimelineEvent[];
  docs: MarkdownDoc[];
  activeDocId?: string;
}

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('characters')) {
        db.createObjectStore('characters', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('timeline')) {
        db.createObjectStore('timeline', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('docs')) {
        db.createObjectStore('docs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('factions')) {
        db.createObjectStore('factions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('locations')) {
        db.createObjectStore('locations', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Generic helper to get all items from an object store
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

// Generic helper to replace all items in an object store
async function setAllInStore<T>(storeName: string, items: T[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      for (const item of items) {
        store.put(item);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Helper to get meta key-value pair
async function getMetaValue<T>(key: string, defaultValue: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction('meta', 'readonly');
    const store = tx.objectStore('meta');
    const request = store.get(key);

    request.onsuccess = () => {
      if (request.result && request.result.value !== undefined) {
        resolve(request.result.value as T);
      } else {
        resolve(defaultValue);
      }
    };
    request.onerror = () => resolve(defaultValue);
  });
}

// Helper to set meta key-value pair
async function setMetaValue<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('meta', 'readwrite');
    const store = tx.objectStore('meta');
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Check if IndexedDB is initialized with seed data
export async function initializeDatabaseIfEmpty(): Promise<void> {
  try {
    const db = await openDB();
    const isInitialized = await getMetaValue<boolean>('initialized', false);

    if (!isInitialized) {
      // Populate seed data into IndexedDB
      await setAllInStore('books', initialBooks);
      await setAllInStore('factions', initialFactions);
      await setAllInStore('characters', initialCharacters);
      await setAllInStore('locations', initialLocations);
      await setAllInStore('timeline', initialTimelineEvents);
      await setAllInStore('docs', initialMarkdownDocs);
      await setMetaValue('settings', initialWorldSettings);
      await setMetaValue('activeDocId', 'doc-1');
      await setMetaValue('initialized', true);
    }
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
  }
}

// Async load functions
export async function idbLoadSettings(): Promise<WorldSettings> {
  await initializeDatabaseIfEmpty();
  return getMetaValue<WorldSettings>('settings', initialWorldSettings);
}

export async function idbSaveSettings(settings: WorldSettings): Promise<void> {
  await setMetaValue('settings', settings);
}

export async function idbLoadBooks(): Promise<Book[]> {
  await initializeDatabaseIfEmpty();
  const books = await getAllFromStore<Book>('books');
  return books.length > 0 ? books : initialBooks;
}

export async function idbSaveBooks(books: Book[]): Promise<void> {
  await setAllInStore('books', books);
}

export async function idbLoadFactions(): Promise<Faction[]> {
  await initializeDatabaseIfEmpty();
  const factions = await getAllFromStore<Faction>('factions');
  return factions.length > 0 ? factions : initialFactions;
}

export async function idbSaveFactions(factions: Faction[]): Promise<void> {
  await setAllInStore('factions', factions);
}

export async function idbLoadCharacters(): Promise<Character[]> {
  await initializeDatabaseIfEmpty();
  const chars = await getAllFromStore<Character>('characters');
  return chars.length > 0 ? chars : initialCharacters;
}

export async function idbSaveCharacters(characters: Character[]): Promise<void> {
  await setAllInStore('characters', characters);
}

export async function idbLoadLocations(): Promise<Location[]> {
  await initializeDatabaseIfEmpty();
  const locs = await getAllFromStore<Location>('locations');
  return locs.length > 0 ? locs : initialLocations;
}

export async function idbSaveLocations(locations: Location[]): Promise<void> {
  await setAllInStore('locations', locations);
}

export async function idbLoadTimeline(): Promise<TimelineEvent[]> {
  await initializeDatabaseIfEmpty();
  const timeline = await getAllFromStore<TimelineEvent>('timeline');
  return timeline.length > 0 ? timeline : initialTimelineEvents;
}

export async function idbSaveTimeline(timeline: TimelineEvent[]): Promise<void> {
  await setAllInStore('timeline', timeline);
}

export async function idbLoadDocs(): Promise<MarkdownDoc[]> {
  await initializeDatabaseIfEmpty();
  const docs = await getAllFromStore<MarkdownDoc>('docs');
  return docs.length > 0 ? docs : initialMarkdownDocs;
}

export async function idbSaveDocs(docs: MarkdownDoc[]): Promise<void> {
  await setAllInStore('docs', docs);
}

export async function idbLoadActiveDocId(): Promise<string> {
  await initializeDatabaseIfEmpty();
  return getMetaValue<string>('activeDocId', 'doc-1');
}

export async function idbSaveActiveDocId(id: string): Promise<void> {
  await setMetaValue('activeDocId', id);
}

// Bulk Load & Dump
export async function idbLoadAllData(): Promise<{
  settings: WorldSettings;
  books: Book[];
  factions: Faction[];
  characters: Character[];
  locations: Location[];
  timeline: TimelineEvent[];
  docs: MarkdownDoc[];
  customCategories?: CustomCategory[];
  customEntries?: CustomEntry[];
  activeDocId: string;
}> {
  await initializeDatabaseIfEmpty();

  const [settings, books, factions, characters, locations, timeline, docs, activeDocId] = await Promise.all([
    idbLoadSettings(),
    idbLoadBooks(),
    idbLoadFactions(),
    idbLoadCharacters(),
    idbLoadLocations(),
    idbLoadTimeline(),
    idbLoadDocs(),
    idbLoadActiveDocId()
  ]);

  return { settings, books, factions, characters, locations, timeline, docs, activeDocId };
}

export async function idbExportDatabase(): Promise<AppDataDump> {
  const data = await idbLoadAllData();
  return {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    ...data
  };
}

export async function idbImportDatabase(dump: Partial<AppDataDump>): Promise<boolean> {
  try {
    if (dump.settings) await idbSaveSettings(dump.settings);
    if (dump.books) await idbSaveBooks(dump.books);
    if (dump.factions) await idbSaveFactions(dump.factions);
    if (dump.characters) await idbSaveCharacters(dump.characters);
    if (dump.locations) await idbSaveLocations(dump.locations);
    if (dump.timeline) await idbSaveTimeline(dump.timeline);
    if (dump.docs) await idbSaveDocs(dump.docs);
    if (dump.activeDocId) await idbSaveActiveDocId(dump.activeDocId);
    return true;
  } catch (err) {
    console.error('Failed to import database into IndexedDB:', err);
    return false;
  }
}

export async function idbResetToDefaults(): Promise<void> {
  await setAllInStore('books', initialBooks);
  await setAllInStore('factions', initialFactions);
  await setAllInStore('characters', initialCharacters);
  await setAllInStore('locations', initialLocations);
  await setAllInStore('timeline', initialTimelineEvents);
  await setAllInStore('docs', initialMarkdownDocs);
  await setMetaValue('settings', initialWorldSettings);
  await setMetaValue('activeDocId', 'doc-1');
  await setMetaValue('initialized', true);
}
