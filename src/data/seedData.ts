import { Book, Character, Location, Faction, TimelineEvent, MarkdownDoc, WorldSettings } from '../types';

export const initialWorldSettings: WorldSettings = {
  worldTitle: "Aethelgard Realm",
  seriesTitle: "The Chronicles of Aethelgard",
  authorName: "J.R. Vance",
  author: "J.R. Vance",
  primaryMagicSystem: "Aetherial Resonance",
  mainTheme: "Power corrupts the sacred, but fate binds the forgotten.",
  magicSystemName: "Aetherial Resonance",
  currentBookId: "book-1"
};

export const initialBooks: Book[] = [
  {
    id: "book-1",
    title: "Trilogy Book 1: The Sunken Crown",
    subtitle: "Book I of Aethelgard",
    order: 1,
    status: "Published",
    summary: "When the ancient Aether Crystal fractures beneath the Citadel of Aethelgard, scholar Eldrin Vance discovers a conspiracy that threatens to awaken the slumbering Void Titan.",
    yearRange: "1420 - 1422 TA"
  },
  {
    id: "book-standalone",
    title: "Standalone A: Chronicles of Ythan",
    subtitle: "Standalone Worldbuilding Legend",
    order: 2,
    status: "Published",
    summary: "A standalone chronicle detailing the lost submerged city of Ythan and the rogue cartographers who mapped the Sunken Delta.",
    yearRange: "1350 - 1390 TA"
  },
  {
    id: "book-2",
    title: "Trilogy Book 2: Whispers of the Void",
    subtitle: "Book II of Aethelgard",
    order: 3,
    status: "Drafting",
    summary: "Exiled to the Obsidian Trench, Lyra Shadowstep teams up with disgraced Knight Lord Kaelen Drake to decipher the Shadow Codex before Malakor completes the Rite of Unmaking.",
    yearRange: "1423 - 1424 TA"
  },
  {
    id: "book-3",
    title: "Trilogy Book 3: The Eternal Pyre",
    subtitle: "Book III of Aethelgard",
    order: 4,
    status: "Planning",
    summary: "The final clash at the Silverpeak Mountains where all three elemental spires must be reignited before the sun sets forever upon the realm.",
    yearRange: "1425 TA"
  }
];

export const initialFactions: Faction[] = [
  {
    id: "fac-1",
    name: "Sunspire Covenant",
    emblem: "✨",
    allegiance: "Order",
    leaderCharacterId: "char-2",
    description: "An ancient order of battle-mages and paladins pledged to protect the royal lineage and guard the Aether Core.",
    motto: "By Light We Prevail, In Shadow We Guard.",
    influenceLevel: "Dominant"
  },
  {
    id: "fac-2",
    name: "Shadow Veil Syndicate",
    emblem: "🗡️",
    allegiance: "Rebel",
    leaderCharacterId: "char-6",
    description: "A guild of rogues, information brokers, and relic hunters operating from the subterranean passages beneath the capital.",
    motto: "Unseen, Unbound, Undefeated.",
    influenceLevel: "Regional"
  },
  {
    id: "fac-3",
    name: "Ash Keepers",
    emblem: "🔥",
    allegiance: "Shadow",
    leaderCharacterId: "char-5",
    description: "Fanatical cultists devoted to the Void Titan, seeking to dismantle elemental magic and usher in total entropy.",
    motto: "From Ash We Came, To Ash All Returns.",
    influenceLevel: "Secret Society"
  },
  {
    id: "fac-4",
    name: "Knights of Aethelgard",
    emblem: "🛡️",
    allegiance: "Neutral",
    leaderCharacterId: "char-3",
    description: "The official heavy military order of the High Realm, fiercely loyal to Queen Seraphina.",
    motto: "Honor Iron, Defend the Sovereign.",
    influenceLevel: "Dominant"
  }
];

export const initialCharacters: Character[] = [
  {
    id: "char-1",
    name: "Eldrin Vance",
    title: "Archive Master & Glyph Reader",
    role: "Protagonist",
    status: "Alive",
    bookIds: ["book-1", "book-2", "book-3"],
    factionId: "fac-1",
    locationId: "loc-1",
    description: "A young, brilliant archivist who inadvertently unlocked the forbidden Glyph of Primordials while translating ancient tablets in the Royal Vault.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
    traits: ["Intellectual", "Cautious", "Glyph-Sensitive", "Reluctant Hero"],
    magicAffinity: "Aetheric Scribing & Time Weaving",
    markdownNoteId: "doc-1",
    quote: "Knowledge isn't power until someone lights the candle in the dark."
  },
  {
    id: "char-2",
    name: "High Mage Valeria",
    title: "Grand Chancellor of Sunspire",
    role: "Supporting",
    status: "Alive",
    bookIds: ["book-1", "book-2"],
    factionId: "fac-1",
    locationId: "loc-1",
    description: "Senior councilor of the Sunspire Covenant whose strict adherence to dogma masks a painful secret regarding the Void Titan's origin.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    traits: ["Disciplined", "Formidable", "Secretive", "Light-Wielder"],
    magicAffinity: "Solar Pyromancy & Barrier Weaving",
    markdownNoteId: "doc-2",
    quote: "The light does not compromise with the abyss."
  },
  {
    id: "char-3",
    name: "Lord Kaelen Drake",
    title: "The Iron Commander",
    role: "Supporting",
    status: "Alive",
    bookIds: ["book-1", "book-2", "book-3"],
    factionId: "fac-4",
    locationId: "loc-2",
    description: "A battle-hardened commander who earned his scars defending the Silverpeak Pass during the Siege of the Frost Giants.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    traits: ["Tactical", "Stoic", "Unflinching Loyalty", "Swordsmaster"],
    magicAffinity: "Earth Manipulation & Rune Armor",
    markdownNoteId: "doc-3",
    quote: "Steel holds true when magic falters."
  },
  {
    id: "char-4",
    name: "Queen Seraphina III",
    title: "Sovereign of the Radiant Throne",
    role: "Supporting",
    status: "Alive",
    bookIds: ["book-1", "book-3"],
    factionId: "fac-4",
    locationId: "loc-1",
    description: "The youthful monarch struggling to hold the kingdom together amidst noble rebellions and economic ruin.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
    traits: ["Diplomatic", "Visionary", "Burdened", "Regal"],
    magicAffinity: "Empathic Resonance",
    quote: "A crown is a anvil upon which a ruler's soul is shaped."
  },
  {
    id: "char-5",
    name: "Malakor the Undying",
    title: "Herald of Entropy",
    role: "Antagonist",
    status: "Alive",
    bookIds: ["book-1", "book-2", "book-3"],
    factionId: "fac-3",
    locationId: "loc-4",
    description: "An ancient sorcerer who transcended mortality through shadow alchemy 800 years ago and seeks the total dissolution of time.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    traits: ["Ruthless", "Ancient", "Nihilistic", "Master Strategist"],
    magicAffinity: "Void Corruption & Necromancy",
    quote: "All empires are merely embers waiting to freeze."
  },
  {
    id: "char-6",
    name: "Lyra Shadowstep",
    title: "Master of the Veil",
    role: "Protagonist",
    status: "Alive",
    bookIds: ["book-2", "book-3"],
    factionId: "fac-2",
    locationId: "loc-3",
    description: "An agile thief raised in the underground tunnels of Ythan who possesses rare shadow-walking abilities.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
    traits: ["Cunning", "Agile", "Distrustful", "Loyal to Friends"],
    magicAffinity: "Shadow Meld & Dual Dagger Channeling",
    quote: "If you didn't want it stolen, you shouldn't have left it unguarded."
  },
  {
    id: "char-7",
    name: "Brother Theron",
    title: "Keeper of Forgotten Hymns",
    role: "Historical Legend",
    status: "Deceased",
    bookIds: ["book-1"],
    factionId: "fac-1",
    locationId: "loc-5",
    description: "The 12th Century monk who first bound the Void Titan beneath the Whispering Forest using silver seals.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    traits: ["Self-Sacrificing", "Holy", "Scholarly"],
    magicAffinity: "Divine Binding Seals",
    quote: "Let my bones be the threshold they shall not cross."
  },
  {
    id: "char-8",
    name: "Captain Vane",
    title: "Skyship Marauder",
    role: "Supporting",
    status: "Alive",
    bookIds: ["book-2", "book-3"],
    factionId: "fac-2",
    locationId: "loc-2",
    description: "Captain of the 'Aether Corsair', an experimental brass skyship powered by crystal propulsion.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
    traits: ["Flamboyant", "Daring", "Mercenary Spirit"],
    magicAffinity: "Wind Crafting & Airship Navigation",
    quote: "The sky has no borders, and neither do my prices."
  }
];

export const initialLocations: Location[] = [
  {
    id: "loc-1",
    name: "Citadel of Aethelgard",
    type: "City",
    region: "Central Plains of Solis",
    bookIds: ["book-1", "book-2", "book-3"],
    controllingFactionId: "fac-1",
    description: "A sprawling white-stone metropolis built around three soaring towers of radiant marble and glass, anchored over the Great Aether Spire.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
    landmarks: ["The Grand Vault of Glyphs", "Radiant Throne Room", "Sunspire Cathedral", "Subterranean Aqueducts"],
    markdownNoteId: "doc-4",
    dangerLevel: "Safe"
  },
  {
    id: "loc-2",
    name: "Silverpeak Mountains",
    type: "Fortress",
    region: "Northern Frostlands",
    bookIds: ["book-1", "book-3"],
    controllingFactionId: "fac-4",
    description: "A razor-sharp mountain range glistening with mineral iron and silver ore, housing impregnable stone watchtowers.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    landmarks: ["Frostbite Gate", "The High Bastion", "Dragon-Chasm Bridge"],
    dangerLevel: "Moderate"
  },
  {
    id: "loc-3",
    name: "Sunken Ruins of Ythan",
    type: "Sacred Site",
    region: "Sinking Delta",
    bookIds: ["book-1", "book-2", "book-standalone"],
    controllingFactionId: "fac-2",
    description: "Half-submerged ancient temples overgrown with phosphorescent moss, home to black-market relic traders and shadow operatives.",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&h=400&fit=crop",
    landmarks: ["Submerged Plaza of Kings", "The Drowned Library", "Thieves' Haven Docks"],
    dangerLevel: "Perilous"
  },
  {
    id: "loc-4",
    name: "Obsidian Trench",
    type: "Dungeon",
    region: "The Ash Waste",
    bookIds: ["book-2", "book-3"],
    controllingFactionId: "fac-3",
    description: "A jagged volcanic chasm emitting dark sulfurous smoke and void particles, where Malakor built his dark crucible.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=400&fit=crop",
    landmarks: ["Crucible of Souls", "The Black Gate", "Lake of Magma"],
    dangerLevel: "Forbidden"
  },
  {
    id: "loc-5",
    name: "Whispering Forest",
    type: "Wilderness",
    region: "Sylvan Reach",
    bookIds: ["book-1"],
    controllingFactionId: "fac-1",
    description: "A dense, ancient woodland where trees echo the voices of forgotten centuries and magical fey creatures roam.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop",
    landmarks: ["Tree of Memory", "Silver Shrine", "Brother Theron's Tomb"],
    dangerLevel: "Moderate"
  },
  {
    id: "loc-6",
    name: "Oakhaven Outpost",
    type: "City",
    region: "Southern Borderlands",
    bookIds: ["book-1", "book-2"],
    controllingFactionId: "fac-4",
    description: "A bustling frontier trading town constructed from heavy oak timber, serving as the gateway to unexplored lands.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
    landmarks: ["The Laughing Dragon Inn", "Lumber Merchant Guild", "Watchman Citadel"],
    dangerLevel: "Safe"
  }
];

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    title: "Discovery of the Aether Spires",
    year: 100,
    yearLabel: "Year 100 DA (Dawn Era)",
    era: "Age of Dawn",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Discovery",
    characterIds: ["char-7"],
    locationIds: ["loc-1"],
    summary: "First scholars locate the glowing crystalline monoliths beneath the central continent, laying the foundation for Aethelgard.",
    importance: "World-Changing"
  },
  {
    id: "evt-2",
    title: "First Cataclysm & Void Binding",
    year: 620,
    yearLabel: "Year 620 DA (Dawn Era)",
    era: "Age of Dawn",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Cataclysm",
    characterIds: ["char-7", "char-5"],
    locationIds: ["loc-5"],
    summary: "Brother Theron sacrifices his life force to bind the Void Titan in the depths beneath Whispering Forest.",
    importance: "World-Changing"
  },
  {
    id: "evt-sa-1",
    title: "Mapping of the Submerged Plaza",
    year: 1375,
    yearLabel: "Year 1375 TA (Standalone Era)",
    era: "The Shattered Crown",
    bookId: "book-standalone",
    bookFilterTag: "Standalone A",
    eventType: "Discovery",
    characterIds: ["char-6"],
    locationIds: ["loc-3"],
    summary: "Rogue cartographers produce the first accurate map of Ythan's subterranean flooded chambers.",
    importance: "Major"
  },
  {
    id: "evt-3",
    title: "Coronation of Queen Seraphina III",
    year: 1415,
    yearLabel: "Year 1415 TA (Third Age)",
    era: "The Shattered Crown",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Coronation",
    characterIds: ["char-4", "char-3"],
    locationIds: ["loc-1"],
    summary: "Following the sudden tragic illness of King Roderick, Seraphina ascends the throne at age 19 amidst political strife.",
    importance: "Major"
  },
  {
    id: "evt-4",
    title: "The Glyph Vault Fracture",
    year: 1420,
    yearLabel: "Year 1420 TA (Book I Opening)",
    era: "The Shattered Crown",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Magic Surge",
    characterIds: ["char-1", "char-2"],
    locationIds: ["loc-1"],
    summary: "Archivist Eldrin Vance triggers an explosive magic resonance while deciphering ancient glyph tablets, cracking the vault floor.",
    importance: "World-Changing"
  },
  {
    id: "evt-5",
    title: "Siege of the Frostbite Gate",
    year: 1421,
    yearLabel: "Year 1421 TA (Book I Midpoint)",
    era: "The Shattered Crown",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Battle",
    characterIds: ["char-3", "char-5"],
    locationIds: ["loc-2"],
    summary: "Lord Kaelen Drake repels an advance force of shadow-infected beasts at the Silverpeak Pass.",
    importance: "Major"
  },
  {
    id: "evt-6",
    title: "Fall of the Ythan Drowned Library",
    year: 1422,
    yearLabel: "Year 1422 TA (Book I Climax)",
    era: "The Shattered Crown",
    bookId: "book-1",
    bookFilterTag: "Trilogy Book 1",
    eventType: "Battle",
    characterIds: ["char-1", "char-6", "char-5"],
    locationIds: ["loc-3"],
    summary: "Malakor's agents raze the secret vault of Ythan, stealing the Second Fragment of the Dark Codex.",
    importance: "Major"
  },
  {
    id: "evt-7",
    title: "The Skyship Skirmish over Ash Waste",
    year: 1423,
    yearLabel: "Year 1423 TA (Book II Opening)",
    era: "Age of Ashes",
    bookId: "book-2",
    bookFilterTag: "Trilogy Book 2",
    eventType: "Battle",
    characterIds: ["char-8", "char-6", "char-3"],
    locationIds: ["loc-4"],
    summary: "Captain Vane channels wind magic to maneuver the 'Aether Corsair' past void drake patrols.",
    importance: "Minor"
  },
  {
    id: "evt-8",
    title: "Discovery of the Shadow Altar",
    year: 1424,
    yearLabel: "Year 1424 TA (Book II Midpoint)",
    era: "Age of Ashes",
    bookId: "book-2",
    bookFilterTag: "Trilogy Book 2",
    eventType: "Discovery",
    characterIds: ["char-1", "char-6"],
    locationIds: ["loc-4"],
    summary: "Eldrin and Lyra infiltrate the Obsidian Trench and witness the ritual awakening of shadow soldiers.",
    importance: "Major"
  },
  {
    id: "evt-9",
    title: "The Three Spires Alignment",
    year: 1425,
    yearLabel: "Year 1425 TA (Book III Climax)",
    era: "The Convergence",
    bookId: "book-3",
    bookFilterTag: "Trilogy Book 3",
    eventType: "Magic Surge",
    characterIds: ["char-1", "char-2", "char-3", "char-4", "char-5", "char-6"],
    locationIds: ["loc-1", "loc-2", "loc-3"],
    summary: "The elemental spires align with the celestial eclipse, triggering the final battle for Aethelgard's existence.",
    importance: "World-Changing"
  }
];

export const initialMarkdownDocs: MarkdownDoc[] = [
  {
    id: "doc-1",
    title: "Eldrin Vance — Character Profile",
    category: "Character Profile",
    content: `# Eldrin Vance — Archive Master

> *"Knowledge isn't power until someone lights the candle in the dark."*

## Overview
**Eldrin Vance** is the main protagonist of *The Sunken Crown* (Book I). Born in the humble outskirts of [[Location: Oakhaven Outpost]], Eldrin's innate talent for recognizing ancient **Aetheric Glyphs** earned him a scholarship at the [[Location: Citadel of Aethelgard]].

## Relationships
- **Mentor:** [[Character: High Mage Valeria]]
- **Allies:** [[Character: Lyra Shadowstep]], [[Character: Lord Kaelen Drake]]
- **Antagonist:** [[Character: Malakor the Undying]]
- **Faction:** [[Faction: Sunspire Covenant]]

## Magic & Capabilities
1. **Glyph Deciphering:** Can read pre-cataclysmic scripts without spell failure.
2. **Time Weaving:** Short localized bursts of temporal slowdown (costly on physical stamina).
3. **Aether Resonance:** Detects hidden magic ley lines through physical touch.

## Narrative Arc
In Book I, Eldrin's curiosity causes the crack in the Vault floor during [[Event: The Glyph Vault Fracture]]. Driven by guilt and honor, he embarks on a quest across the realm to seal the breach before [[Character: Malakor the Undying]] awakens.
`,
    linkedEntityIds: [
      { type: 'character', id: 'char-1', name: 'Eldrin Vance' },
      { type: 'character', id: 'char-2', name: 'High Mage Valeria' },
      { type: 'character', id: 'char-6', name: 'Lyra Shadowstep' },
      { type: 'location', id: 'loc-1', name: 'Citadel of Aethelgard' }
    ],
    tags: ["protagonist", "archivist", "aether-magic", "book-1"],
    updatedAt: "2026-08-11",
    wordCount: 185
  },
  {
    id: "doc-2",
    title: "Aetherial Resonance — Magic System Rules",
    category: "Magic System",
    content: `# Aetherial Resonance — Magic System Codex

## Core Fundamentals
In the world of **Aethelgard**, magic is not invoked through spoken incantations alone, but through **Resonance Frequency** with the subterranean [[Location: Citadel of Aethelgard]] Aether Core.

### The Four Harmonic Strands
1. **Solar Pyromancy (Light & Heat)** — Harnessed by [[Faction: Sunspire Covenant]] paladins and [[Character: High Mage Valeria]].
2. **Tectonic Rune Crafting (Matter & Defense)** — Practiced by [[Character: Lord Kaelen Drake]] and the mountain dwarves of [[Location: Silverpeak Mountains]].
3. **Atmospheric Weaving (Wind & Flight)** — Used by skyship captains like [[Character: Captain Vane]].
4. **Shadow Entropy (Void & Decay)** — Forbidden strand mastered by [[Character: Malakor the Undying]] and his cultists at [[Location: Obsidian Trench]].

## Limitations & Costs
- **Resonance Burn:** Overusing magic causes calcification of blood vessels, turning skin into crystalline glass.
- **Rift Backlash:** Drawing power without an anchor node risks triggering localized elemental quakes like [[Event: The Glyph Vault Fracture]].
`,
    linkedEntityIds: [
      { type: 'location', id: 'loc-1', name: 'Citadel of Aethelgard' },
      { type: 'character', id: 'char-2', name: 'High Mage Valeria' },
      { type: 'character', id: 'char-5', name: 'Malakor the Undying' }
    ],
    tags: ["magic-rules", "worldbuilding", "aether", "codex"],
    updatedAt: "2026-08-10",
    wordCount: 172
  },
  {
    id: "doc-3",
    title: "The Citadel of Aethelgard — Location Atlas",
    category: "Location Atlas",
    content: `# The Citadel of Aethelgard

The crown jewel of the realm, ruled by [[Character: Queen Seraphina III]] with military defense directed by [[Character: Lord Kaelen Drake]].

## Geography & Key Sites
- **The Grand Vault of Glyphs:** Located 300 meters beneath the central courtyard. Guarded by [[Faction: Sunspire Covenant]].
- **Subterranean Aqueducts:** Secret smuggling routes maintained by [[Character: Lyra Shadowstep]] and [[Faction: Shadow Veil Syndicate]].
- **Radiant Throne Room:** Featuring stained-glass windows depicting [[Event: Discovery of the Aether Spires]].

## Defense Systems
Surrounded by triple-layered granite walls imbued with anti-void wards created by [[Character: Brother Theron]] during the Dawn Era.
`,
    linkedEntityIds: [
      { type: 'location', id: 'loc-1', name: 'Citadel of Aethelgard' },
      { type: 'character', id: 'char-4', name: 'Queen Seraphina III' },
      { type: 'character', id: 'char-3', name: 'Lord Kaelen Drake' }
    ],
    tags: ["capital", "city", "atlas", "book-1"],
    updatedAt: "2026-08-09",
    wordCount: 128
  },
  {
    id: "doc-4",
    title: "Book I Outline — The Sunken Crown",
    category: "Chapter Draft",
    content: `# Book I: The Sunken Crown — Plot Outline

## Act I: The Shattered Vault (Chapters 1 - 8)
- **Chapter 1:** [[Character: Eldrin Vance]] works late in the Vault of Glyphs. Triggers [[Event: The Glyph Vault Fracture]].
- **Chapter 2:** [[Character: High Mage Valeria]] interrogates Eldrin. Instead of imprisonment, she commands him to investigate the ancient seals.
- **Chapter 3:** Introduction of [[Character: Queen Seraphina III]] and political tension in the capital.

## Act II: The Journey North (Chapters 9 - 18)
- **Chapter 10:** Travel to [[Location: Silverpeak Mountains]]. Meeting with [[Character: Lord Kaelen Drake]].
- **Chapter 14:** [[Event: Siege of the Frostbite Gate]] — Kaelen leads defensive battle against shadow beasts.

## Act III: The Sunken Secrets (Chapters 19 - 25)
- **Chapter 20:** Descent into [[Location: Sunken Ruins of Ythan]]. Team up with [[Character: Lyra Shadowstep]].
- **Chapter 24:** [[Event: Fall of the Ythan Drowned Library]] — Confrontation with [[Character: Malakor the Undying]].
`,
    linkedEntityIds: [
      { type: 'character', id: 'char-1', name: 'Eldrin Vance' },
      { type: 'character', id: 'char-5', name: 'Malakor the Undying' },
      { type: 'location', id: 'loc-2', name: 'Silverpeak Mountains' }
    ],
    tags: ["outline", "book-1", "chapters", "draft"],
    updatedAt: "2026-08-11",
    wordCount: 160
  }
];
