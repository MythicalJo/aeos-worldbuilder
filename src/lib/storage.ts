import { Book, Character, Location, Faction, TimelineEvent, MarkdownDoc, WorldSettings } from '../types';
import { initialWorldSettings, initialBooks, initialFactions, initialCharacters, initialLocations, initialTimelineEvents, initialMarkdownDocs } from '../data/seedData';
import {
  idbSaveSettings,
  idbSaveBooks,
  idbSaveFactions,
  idbSaveCharacters,
  idbSaveLocations,
  idbSaveTimeline,
  idbSaveDocs,
  idbSaveActiveDocId,
  idbLoadAllData,
  idbExportDatabase,
  idbImportDatabase,
  idbResetToDefaults
} from './idbStorage';

const STORAGE_KEYS = {
  SETTINGS: 'lorecraft_settings_v1',
  BOOKS: 'lorecraft_books_v1',
  FACTIONS: 'lorecraft_factions_v1',
  CHARACTERS: 'lorecraft_characters_v1',
  LOCATIONS: 'lorecraft_locations_v1',
  TIMELINE: 'lorecraft_timeline_v1',
  DOCS: 'lorecraft_docs_v1',
  ACTIVE_DOC_ID: 'lorecraft_active_doc_id_v1'
};

export interface DatabaseDump {
  version: string;
  exportedAt: string;
  settings: WorldSettings;
  books: Book[];
  factions: Faction[];
  characters: Character[];
  locations: Location[];
  timeline: TimelineEvent[];
  docs: MarkdownDoc[];
}

export function loadSettings(): WorldSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : initialWorldSettings;
  } catch {
    return initialWorldSettings;
  }
}

export function saveSettings(settings: WorldSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
  idbSaveSettings(settings).catch((err) => console.error('IndexedDB saveSettings error:', err));
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return raw ? JSON.parse(raw) : initialBooks;
  } catch {
    return initialBooks;
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch {}
  idbSaveBooks(books).catch((err) => console.error('IndexedDB saveBooks error:', err));
}

export function loadFactions(): Faction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FACTIONS);
    return raw ? JSON.parse(raw) : initialFactions;
  } catch {
    return initialFactions;
  }
}

export function saveFactions(factions: Faction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FACTIONS, JSON.stringify(factions));
  } catch {}
  idbSaveFactions(factions).catch((err) => console.error('IndexedDB saveFactions error:', err));
}

export function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    return raw ? JSON.parse(raw) : initialCharacters;
  } catch {
    return initialCharacters;
  }
}

export function saveCharacters(characters: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  } catch {}
  idbSaveCharacters(characters).catch((err) => console.error('IndexedDB saveCharacters error:', err));
}

export function loadLocations(): Location[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return raw ? JSON.parse(raw) : initialLocations;
  } catch {
    return initialLocations;
  }
}

export function saveLocations(locations: Location[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  } catch {}
  idbSaveLocations(locations).catch((err) => console.error('IndexedDB saveLocations error:', err));
}

export function loadTimeline(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    return raw ? JSON.parse(raw) : initialTimelineEvents;
  } catch {
    return initialTimelineEvents;
  }
}

export function saveTimeline(events: TimelineEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(events));
  } catch {}
  idbSaveTimeline(events).catch((err) => console.error('IndexedDB saveTimeline error:', err));
}

export function loadDocs(): MarkdownDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCS);
    return raw ? JSON.parse(raw) : initialMarkdownDocs;
  } catch {
    return initialMarkdownDocs;
  }
}

export function saveDocs(docs: MarkdownDoc[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(docs));
  } catch {}
  idbSaveDocs(docs).catch((err) => console.error('IndexedDB saveDocs error:', err));
}

export function loadActiveDocId(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_DOC_ID) || 'doc-1';
  } catch {
    return 'doc-1';
  }
}

export function saveActiveDocId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC_ID, id);
  } catch {}
  idbSaveActiveDocId(id).catch((err) => console.error('IndexedDB saveActiveDocId error:', err));
}

export function exportFullDatabase(): DatabaseDump {
  return {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    settings: loadSettings(),
    books: loadBooks(),
    factions: loadFactions(),
    characters: loadCharacters(),
    locations: loadLocations(),
    timeline: loadTimeline(),
    docs: loadDocs()
  };
}

export function importFullDatabase(dump: DatabaseDump): boolean {
  try {
    if (dump.settings) saveSettings(dump.settings);
    if (dump.books) saveBooks(dump.books);
    if (dump.factions) saveFactions(dump.factions);
    if (dump.characters) saveCharacters(dump.characters);
    if (dump.locations) saveLocations(dump.locations);
    if (dump.timeline) saveTimeline(dump.timeline);
    if (dump.docs) saveDocs(dump.docs);
    idbImportDatabase(dump).catch((err) => console.error('IndexedDB import error:', err));
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

export function exportWorldBible(): void {
  const dump = exportFullDatabase();
  const jsonString = JSON.stringify(dump, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `world_bible_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorldBible(jsonText: string): boolean {
  try {
    const parsed = JSON.parse(jsonText);
    return importFullDatabase(parsed);
  } catch {
    return false;
  }
}

export function resetToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.FACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_DOC_ID);
  } catch {}
  idbResetToDefaults().catch((err) => console.error('IndexedDB reset error:', err));
}

export function resetToDefaultWorld(): void {
  resetToDefaults();
}

export { idbLoadAllData, idbExportDatabase, idbImportDatabase, idbResetToDefaults };
