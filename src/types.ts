export type EntityType = 'character' | 'location' | 'faction' | 'magic' | 'item' | 'doc';

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  status: 'Planning' | 'Drafting' | 'Editing' | 'Published';
  summary: string;
  yearRange: string;
  volumeNumber?: number;
  description?: string;
  wordCountGoal?: number;
  currentWordCount?: number;
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
  type: string;
  region: string;
  description: string;
  bookIds: string[];
  imageUrl?: string;
  dangerLevel?: string;
  controllingFactionId?: string;
  landmarks?: string[];
  markdownNoteId?: string;
}

export interface Faction {
  id: string;
  name: string;
  allegiance: string;
  motto: string;
  description: string;
  emblem?: string;
  leaderId?: string;
  leaderCharacterId?: string;
  influenceLevel?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  year: number;
  yearLabel: string;
  era: string;
  summary: string;
  eventType: 'Battle' | 'Coronation' | 'Cataclysm' | 'Secret Treaty' | 'Discovery' | 'Magic Surge';
  bookFilterTag?: string;
  importance: 'Major' | 'Minor' | 'Critical' | 'World-Changing';
  bookId?: string;
  characterIds: string[];
  locationId?: string;
  locationIds?: string[];
  markdownNoteId?: string;
}

export interface MarkdownDoc {
  id: string;
  title: string;
  category: 'Lore' | 'Magic System' | 'Character Profile' | 'Location Atlas' | 'Chapter Draft' | 'Rules & Notes';
  content: string;
  linkedEntityIds: (string | { type: string; id: string; name: string })[];
  tags: string[];
  updatedAt: string;
  wordCount?: number;
}

export interface WorldSettings {
  worldTitle: string;
  seriesTitle: string;
  authorName: string;
  author?: string;
  primaryMagicSystem: string;
  magicSystemName?: string;
  defaultBookId?: string;
  currentBookId?: string;
  mainTheme?: string;
}

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
