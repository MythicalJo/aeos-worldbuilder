export type EntityType = 'character' | 'location' | 'faction' | 'magic' | 'item' | 'doc';

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  status: 'Planning' | 'Drafting' | 'Editing' | 'Published';
  summary: string;
  yearRange: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Historical Legend' | 'Deity/Ancient';
  status: 'Alive' | 'Deceased' | 'Missing' | 'Exiled' | 'Ascended';
  bookIds: string[];
  factionId?: string;
  locationId?: string;
  description: string;
  avatarUrl?: string;
  traits: string[];
  magicAffinity?: string;
  markdownNoteId?: string;
  quote?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'City' | 'Kingdom' | 'Dungeon' | 'Sacred Site' | 'Wilderness' | 'Fortress' | 'Realm';
  region: string;
  bookIds: string[];
  controllingFactionId?: string;
  description: string;
  imageUrl?: string;
  landmarks: string[];
  markdownNoteId?: string;
  dangerLevel: 'Safe' | 'Moderate' | 'Perilous' | 'Forbidden';
}

export interface Faction {
  id: string;
  name: string;
  emblem: string;
  allegiance: 'Order' | 'Chaos' | 'Neutral' | 'Rebel' | 'Shadow';
  leaderCharacterId?: string;
  description: string;
  motto: string;
  influenceLevel: 'Dominant' | 'Regional' | 'Secret Society' | 'Declining';
}

export interface TimelineEvent {
  id: string;
  title: string;
  year: number; // Numerical year for sorting
  yearLabel: string; // e.g. "Year 1422 of the Third Age"
  era: 'Age of Dawn' | 'The Shattered Crown' | 'Age of Ashes' | 'The Convergence';
  bookId: string;
  bookFilterTag?: string; // e.g. 'Trilogy Book 1', 'Standalone A', 'Trilogy Book 2', 'Trilogy Book 3'
  eventType: 'Battle' | 'Coronation' | 'Cataclysm' | 'Secret Treaty' | 'Birth/Death' | 'Discovery' | 'Magic Surge';
  characterIds: string[];
  locationIds: string[];
  summary: string;
  markdownNoteId?: string;
  importance: 'World-Changing' | 'Major' | 'Minor';
}

export interface MarkdownDoc {
  id: string;
  title: string;
  category: 'Lore' | 'Magic System' | 'Character Profile' | 'Location Atlas' | 'Chapter Draft' | 'Rules & Notes';
  content: string;
  linkedEntityIds: {
    type: EntityType;
    id: string;
    name: string;
  }[];
  tags: string[];
  updatedAt: string;
  wordCount: number;
}

export interface WorldSettings {
  seriesTitle: string;
  author: string;
  mainTheme: string;
  magicSystemName: string;
  currentBookId: string;
}

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
