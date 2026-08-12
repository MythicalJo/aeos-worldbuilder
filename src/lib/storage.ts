import { Book, Character, Location, Faction, TimelineEvent, MarkdownDoc, WorldSettings, Project, CustomCategory, CustomEntry } from '../types';
import {
  initialWorldSettings,
  initialBooks,
  initialFactions,
  initialCharacters,
  initialLocations,
  initialTimelineEvents,
  initialMarkdownDocs,
  initialProjects,
  initialCustomCategories,
  initialCustomEntries
} from '../data/seedData';

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
  SETTINGS: 'lorecraft_settings_v2',
  PROJECTS: 'lorecraft_projects_v2',
  BOOKS: 'lorecraft_books_v2',
  FACTIONS: 'lorecraft_factions_v2',
  CHARACTERS: 'lorecraft_characters_v2',
  LOCATIONS: 'lorecraft_locations_v2',
  CUSTOM_CATEGORIES: 'lorecraft_custom_categories_v2',
  CUSTOM_ENTRIES: 'lorecraft_custom_entries_v2',
  TIMELINE: 'lorecraft_timeline_v2',
  DOCS: 'lorecraft_docs_v2',
  ACTIVE_DOC_ID: 'lorecraft_active_doc_id_v2'
};

export interface DatabaseDump {
  version: string;
  exportedAt: string;
  settings: WorldSettings;
  projects?: Project[];
  books: Book[];
  factions: Faction[];
  characters: Character[];
  locations: Location[];
  customCategories?: CustomCategory[];
  customEntries?: CustomEntry[];
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

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : initialProjects;
  } catch {
    return initialProjects;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch {}
}

export function loadCustomCategories(): CustomCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    return raw ? JSON.parse(raw) : initialCustomCategories;
  } catch {
    return initialCustomCategories;
  }
}

export function saveCustomCategories(categories: CustomCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
  } catch {}
}

export function loadCustomEntries(): CustomEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_ENTRIES);
    return raw ? JSON.parse(raw) : initialCustomEntries;
  } catch {
    return initialCustomEntries;
  }
}

export function saveCustomEntries(entries: CustomEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENTRIES, JSON.stringify(entries));
  } catch {}
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

export function sanitizeAndRecoverDocs(loadedDocs: MarkdownDoc[], projects: Project[], books: Book[]): MarkdownDoc[] {
  if (!loadedDocs || loadedDocs.length === 0) return initialMarkdownDocs;

  const defaultProjId = projects[0]?.id || 'project-1';

  return loadedDocs.map((doc) => {
    const projId = doc.projectId || defaultProjId;
    const projBooks = books.filter((b) => !b.projectId || b.projectId === projId);
    const defaultBookId = projBooks[0]?.id || books[0]?.id || 'book-1';
    const bookId = doc.bookId || defaultBookId;

    return {
      ...doc,
      projectId: projId,
      bookId: bookId,
      category: doc.category || 'Chapter Draft'
    };
  });
}

export function migrateLegacyMiscEntries(entries: CustomEntry[], categories: CustomCategory[]): { entries: CustomEntry[]; categories: CustomCategory[] } {
  const hasMiscEntries = entries.some((e) => e.categoryId === 'misc');
  if (!hasMiscEntries) return { entries, categories };

  let targetCategory = categories.find((c) => c.name.toLowerCase().includes('lore') || c.name.toLowerCase().includes('notes'));
  let updatedCategories = [...categories];

  if (!targetCategory) {
    targetCategory = {
      id: 'cat-notes',
      projectId: 'project-1',
      name: 'Lore & Notes',
      iconName: 'Scroll',
      description: 'General story reference notes'
    };
    updatedCategories.push(targetCategory);
  }

  const updatedEntries = entries.map((e) => {
    if (e.categoryId === 'misc') {
      return { ...e, categoryId: targetCategory!.id };
    }
    return e;
  });

  return { entries: updatedEntries, categories: updatedCategories };
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
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    settings: loadSettings(),
    projects: loadProjects(),
    books: loadBooks(),
    factions: loadFactions(),
    characters: loadCharacters(),
    locations: loadLocations(),
    customCategories: loadCustomCategories(),
    customEntries: loadCustomEntries(),
    timeline: loadTimeline(),
    docs: loadDocs()
  };
}

export function importFullDatabase(dump: DatabaseDump): boolean {
  try {
    if (dump.settings) saveSettings(dump.settings);
    if (dump.projects) saveProjects(dump.projects);
    if (dump.books) saveBooks(dump.books);
    if (dump.factions) saveFactions(dump.factions);
    if (dump.characters) saveCharacters(dump.characters);
    if (dump.locations) saveLocations(dump.locations);
    if (dump.customCategories) saveCustomCategories(dump.customCategories);
    if (dump.customEntries) saveCustomEntries(dump.customEntries);
    if (dump.timeline) saveTimeline(dump.timeline);
    if (dump.docs) saveDocs(dump.docs);
    idbImportDatabase(dump).catch((err) => console.error('IndexedDB import error:', err));
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

export function resetToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.FACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_DOC_ID);
  } catch {}
  idbResetToDefaults().catch((err) => console.error('IndexedDB reset error:', err));
}

export { idbLoadAllData, idbExportDatabase, idbImportDatabase, idbResetToDefaults };
