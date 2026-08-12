import { Book, Character, Location, Faction, TimelineEvent, MarkdownDoc, WorldSettings, Project, CustomCategory, CustomEntry } from '../types';

export const initialProjects: Project[] = [
  {
    id: "project-1",
    title: "Aethelgard Realm",
    description: "Epic High Fantasy world container featuring the Aether Crystal saga.",
    authorName: "J.R. Vance",
    linkedProjectIds: [],
    createdAt: "2026-01-01"
  },
  {
    id: "project-2",
    title: "Starlight Chronicles",
    description: "Sci-Fi Space Fantasy saga in the Nebula Sector.",
    authorName: "J.R. Vance",
    linkedProjectIds: [],
    createdAt: "2026-02-01"
  }
];

export const initialWorldSettings: WorldSettings = {
  worldTitle: "Aethelgard Realm",
  seriesTitle: "The Chronicles of Aethelgard",
  authorName: "J.R. Vance",
  author: "J.R. Vance",
  primaryMagicSystem: "Aetherial Resonance",
  mainTheme: "Power corrupts the sacred, but fate binds the forgotten.",
  magicSystemName: "Aetherial Resonance",
  currentBookId: "book-1",
  activeProjectId: "project-1"
};

export const initialBooks: Book[] = [
  {
    id: "book-1",
    projectId: "project-1",
    title: "Trilogy Book 1: The Sunken Crown",
    subtitle: "Book I of Aethelgard",
    order: 1,
    status: "Published",
    summary: "When the ancient Aether Crystal fractures beneath the Citadel of Aethelgard, scholar Eldrin Vance discovers a conspiracy that threatens to awaken the slumbering Void Titan.",
    yearRange: "1420 - 1422 TA"
  },
  {
    id: "book-standalone",
    projectId: "project-1",
    title: "Standalone A: Chronicles of Ythan",
    subtitle: "Standalone Legend",
    order: 2,
    status: "Published",
    summary: "A standalone chronicle detailing the lost submerged city of Ythan and the rogue cartographers who mapped the Sunken Delta.",
    yearRange: "1350 - 1390 TA"
  },
  {
    id: "book-2",
    projectId: "project-1",
    title: "Trilogy Book 2: Whispers of the Void",
    subtitle: "Book II of Aethelgard",
    order: 3,
    status: "Drafting",
    summary: "Exiled to the Obsidian Trench, Lyra Shadowstep teams up with disgraced Knight Lord Kaelen Drake to decipher the Shadow Codex before Malakor completes the Rite of Unmaking.",
    yearRange: "1423 - 1424 TA"
  },
  {
    id: "book-3",
    projectId: "project-1",
    title: "Trilogy Book 3: The Eternal Pyre",
    subtitle: "Book III of Aethelgard",
    order: 4,
    status: "Planning",
    summary: "The final clash at the Silverpeak Mountains where all three elemental spires must be reignited before the sun sets forever upon the realm.",
    yearRange: "1425 TA"
  },
  {
    id: "book-starlight-1",
    projectId: "project-2",
    title: "Starlight Book 1: Beyond the Nebula",
    subtitle: "Book I of Nebula",
    order: 1,
    status: "Drafting",
    summary: "Commanding the starship Vanguard, Captain Vane navigates rogue asteroids and uncharted alien outposts.",
    yearRange: "3042 Star Era"
  }
];

export const initialFactions: Faction[] = [
  {
    id: "fac-1",
    projectId: "project-1",
    name: "Sunspire Covenant",
    emblem: "✨",
    motto: "By Light We Prevail",
    allegiance: "Order",
    leaderCharacterId: "char-2",
    description: "An ancient order of battle-mages and paladins pledged to protect the royal lineage and guard the Aether Core."
  },
  {
    id: "fac-2",
    projectId: "project-1",
    name: "Shadowbound Syndicate",
    emblem: "🗡️",
    motto: "In Shadows We Rule",
    allegiance: "Chaos",
    leaderCharacterId: "char-4",
    description: "A clandestine guild operating from the Obsidian Trench, practicing forbidden Void Magic."
  },
  {
    id: "fac-3",
    projectId: "project-1",
    name: "Circle of Verdant Weavers",
    emblem: "🌿",
    motto: "Guard the Living Roots",
    allegiance: "Nature Neutral",
    leaderCharacterId: "char-3",
    description: "Druids and herbalists guarding the Whispering Woods, capable of manipulating living flora."
  },
  {
    id: "fac-4",
    projectId: "project-1",
    name: "Ironclad Merchant League",
    emblem: "⚙️",
    motto: "Gold Controls the Skyways",
    allegiance: "Mercantile",
    description: "Wealthy trade barons controlling the Skyway Fleet and trade routes across the Sunken Delta."
  }
];

export const initialCharacters: Character[] = [
  {
    id: "char-1",
    projectId: "project-1",
    name: "Eldrin Vance",
    title: "Master Archivist & Aether Scribe",
    role: "Protagonist",
    status: "Alive",
    bookIds: ["book-1", "book-2", "book-3"],
    factionId: "fac-1",
    locationId: "loc-1",
    description: "Born in the Lower Rings of Aethelgard, Eldrin mastered rune deciphering at a young age. His touch resonates with ancient Aetherite.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    traits: ["Intellectual", "Cautious", "Relentless"],
    magicAffinity: "Aetherial Resonance & Glyph Scribing",
    quote: "Truth is not found in victory speeches, but buried beneath the ruins of forgotten empires.",
    markdownNoteId: "doc-char-1"
  },
  {
    id: "char-2",
    projectId: "project-1",
    name: "Kaelen Drake",
    title: "Knight Commander of the Sunspire",
    role: "Protagonist",
    status: "Alive",
    bookIds: ["book-1", "book-2"],
    factionId: "fac-1",
    locationId: "loc-1",
    description: "Sworn protector of the High Citadel. Wields the Sunforged Greatsword and commands the Vanguard Garrison.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    traits: ["Honorable", "Stubborn", "Tactical"],
    magicAffinity: "Solar Pyromancy",
    quote: "My blade does not falter when the realm bleeds.",
    markdownNoteId: "doc-char-2"
  },
  {
    id: "char-3",
    projectId: "project-1",
    name: "Lyra Shadowstep",
    title: "Rogue Warden of the Whispering Woods",
    role: "Supporting",
    status: "Alive",
    bookIds: ["book-1", "book-standalone", "book-2"],
    factionId: "fac-3",
    locationId: "loc-2",
    description: "A silent scout who can blend into foliage and shadows. Knows every secret passage beneath the roots.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    traits: ["Agile", "Secretive", "Compassionate"],
    magicAffinity: "Shadow Camouflage & Verdant Whispers",
    quote: "Listen carefully to the trees; they remember who spilled blood on their soil."
  },
  {
    id: "char-4",
    projectId: "project-1",
    name: "Archmage Malakor",
    title: "The Void Weaver",
    role: "Antagonist",
    status: "Alive",
    bookIds: ["book-1", "book-2", "book-3"],
    factionId: "fac-2",
    locationId: "loc-3",
    description: "Former High Scholar of Aethelgard turned dark sorcerer, seeking to shatter the Aether Core.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    traits: ["Ruthless", "Genius", "Corrupted"],
    magicAffinity: "Void Corruption & Necromantic Spores",
    quote: "Your world is built upon a cracked foundation. I am merely hastening the collapse."
  }
];

export const initialLocations: Location[] = [
  {
    id: "loc-1",
    projectId: "project-1",
    name: "Citadel of Aethelgard",
    type: "High Citadel & Royal Seat",
    region: "Central Spires",
    description: "Towering white-marble citadel housing the Aether Core crystal. Its spires pierce the cloud layer.",
    bookIds: ["book-1", "book-2", "book-3"],
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    dangerLevel: "Safe",
    controllingFactionId: "fac-1",
    landmarks: ["The Sunspire Tower", "Royal Vaults", "Great Library of Runes"]
  },
  {
    id: "loc-2",
    projectId: "project-1",
    name: "Whispering Woods",
    type: "Ancient Forest Realm",
    region: "Eastern Reaches",
    description: "Dense, bio-luminescent forest where ancient trees glow blue beneath the moonlight.",
    bookIds: ["book-1", "book-standalone"],
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    dangerLevel: "Moderate",
    controllingFactionId: "fac-3",
    landmarks: ["Heartwood Shrine", "Moonlit Clearing", "The Glowing Canopy"]
  },
  {
    id: "loc-3",
    projectId: "project-1",
    name: "Obsidian Trench",
    type: "Subterranean Volcanic Ruin",
    region: "Southern Wastes",
    description: "A scorched rift filled with black volcanic glass and flowing magma channels.",
    bookIds: ["book-2", "book-3"],
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    dangerLevel: "Perilous",
    controllingFactionId: "fac-2",
    landmarks: ["Magma Forge", "The Void Gate", "Brimstone Keep"]
  }
];

export const initialCustomCategories: CustomCategory[] = [
  {
    id: "cat-relics",
    projectId: "project-1",
    name: "Relics & Artifacts",
    iconName: "Gem",
    description: "Magical artifacts and ancient relics of Aethelgard."
  },
  {
    id: "cat-rituals",
    projectId: "project-1",
    name: "Spells & Rituals",
    iconName: "Scroll",
    description: "Ancient rituals, spells, and magic lore."
  }
];

export const initialCustomEntries: CustomEntry[] = [
  {
    id: "entry-1",
    projectId: "project-1",
    categoryId: "cat-rituals",
    title: "The Rite of Unmaking",
    subtitle: "Forbidden Ritual",
    description: "An ancient spell recorded in the Shadow Codex that fractures elemental spires.",
    tags: ["magic", "ritual"],
    updatedAt: "2026-08-10"
  },
  {
    id: "entry-2",
    projectId: "project-1",
    categoryId: "cat-relics",
    title: "The Aether Core Crown",
    subtitle: "Royal Artifact",
    description: "Forged in the First Era, this crown channels the raw magic of the Sunspire.",
    tags: ["relic", "crown"],
    updatedAt: "2026-08-11"
  }
];

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: "event-1",
    projectId: "project-1",
    title: "Shattering of the Aether Crystal",
    year: 1420,
    yearLabel: "Year 1420 TA",
    era: "The Shattered Crown",
    summary: "Archmage Malakor destabilizes the central crystal spire, causing magic surges across Aethelgard.",
    eventType: "Cataclysm",
    bookFilterTag: "Trilogy Book 1",
    importance: "World-Changing",
    bookId: "book-1",
    characterIds: ["char-1", "char-4"],
    locationId: "loc-1"
  },
  {
    id: "event-2",
    projectId: "project-1",
    title: "Battle of the Whispering Woods",
    year: 1421,
    yearLabel: "Year 1421 TA",
    era: "The Shattered Crown",
    summary: "The Sunspire Covenant clashes with Void cultists hiding within the bioluminescent forest.",
    eventType: "Battle",
    bookFilterTag: "Trilogy Book 1",
    importance: "Major",
    bookId: "book-1",
    characterIds: ["char-2", "char-3"],
    locationId: "loc-2"
  }
];

export const initialMarkdownDocs: MarkdownDoc[] = [
  {
    id: "doc-1",
    projectId: "project-1",
    bookId: "book-1",
    title: "Chapter 1: The Fracture at Midnight",
    category: "Chapter Draft",
    content: `# Chapter 1: The Fracture at Midnight\n\nThe white marble floor of the Great Library shuddered beneath Eldrin's boots. A high-pitched resonance, like a crystal goblet struck by iron, vibrated through the air.\n\n"It is starting," [[Eldrin Vance]] whispered, clutching his leather notebook. High above in the [[Citadel of Aethelgard]], the Aether Crystal was beginning to crack.\n\nFrom the balcony, [[Kaelen Drake]] drew his sword...`,
    linkedEntityIds: [
      { type: "character", id: "char-1", name: "Eldrin Vance" },
      { type: "location", id: "loc-1", name: "Citadel of Aethelgard" },
      { type: "character", id: "char-2", name: "Kaelen Drake" }
    ],
    tags: ["chapter-1", "draft"],
    updatedAt: "2026-08-11",
    wordCount: 84
  },
  {
    id: "doc-2",
    projectId: "project-1",
    bookId: "book-1",
    title: "Chapter 2: Shadow Over the Whispering Woods",
    category: "Chapter Draft",
    content: `# Chapter 2: Shadow Over the Whispering Woods\n\nThe air smelled of ozone and damp moss. [[Lyra Shadowstep]] crouched on a high branch, looking down at the void cultists marching towards the [[Whispering Woods]].\n\n[[Archmage Malakor]] raised his hands, and dark spores began to bloom...`,
    linkedEntityIds: [
      { type: "character", id: "char-3", name: "Lyra Shadowstep" },
      { type: "location", id: "loc-2", name: "Whispering Woods" },
      { type: "character", id: "char-4", name: "Archmage Malakor" }
    ],
    tags: ["chapter-2", "draft"],
    updatedAt: "2026-08-11",
    wordCount: 52
  }
];
