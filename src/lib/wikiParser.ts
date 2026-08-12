import { Character, Location, Faction } from '../types';
import { marked } from 'marked';

export function parseWikiLinksToHTML(
  rawMarkdown: string,
  characters: Character[] = [],
  locations: Location[] = [],
  factions: Faction[] = []
): string {
  try {
    // Replace [[Character Name]] or [[Type: Name]] with styled clickable badges
    const processed = rawMarkdown.replace(/\[\[([^\]]+)\]\]/g, (match, innerText: string) => {
      let typePrefix = '';
      let cleanName = innerText.trim();

      // Check if there is an explicit type prefix like "Character: Eldrin Vance"
      if (cleanName.includes(':')) {
        const parts = cleanName.split(':');
        typePrefix = parts[0].trim().toLowerCase();
        cleanName = parts.slice(1).join(':').trim();
      }

      // Check matching Character first
      const foundChar = characters.find(
        (c) => c.name.toLowerCase() === cleanName.toLowerCase() || c.id === cleanName
      );
      if (foundChar || typePrefix === 'character') {
        const charObj = foundChar || characters.find((c) => c.name.toLowerCase().includes(cleanName.toLowerCase()));
        const targetId = charObj ? charObj.id : '';
        const displayName = charObj ? charObj.name : cleanName;

        return `<span class="wiki-link wiki-character inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/50 border border-amber-500/40 px-1.5 py-0.5 rounded hover:bg-amber-900/70 hover:border-amber-400 cursor-pointer transition-all shadow-sm" data-type="character" data-id="${targetId}" data-name="${displayName}">
          <svg class="w-3 h-3 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span>${displayName}</span>
        </span>`;
      }

      // Check matching Location
      const foundLoc = locations.find(
        (l) => l.name.toLowerCase() === cleanName.toLowerCase() || l.id === cleanName
      );
      if (foundLoc || typePrefix === 'location') {
        const locObj = foundLoc || locations.find((l) => l.name.toLowerCase().includes(cleanName.toLowerCase()));
        const targetId = locObj ? locObj.id : '';
        const displayName = locObj ? locObj.name : cleanName;

        return `<span class="wiki-link wiki-location inline-flex items-center gap-1 font-semibold text-sky-400 bg-sky-950/50 border border-sky-500/40 px-1.5 py-0.5 rounded hover:bg-sky-900/70 hover:border-sky-400 cursor-pointer transition-all shadow-sm" data-type="location" data-id="${targetId}" data-name="${displayName}">
          <svg class="w-3 h-3 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>${displayName}</span>
        </span>`;
      }

      // Check matching Faction
      const foundFac = factions.find(
        (f) => f.name.toLowerCase() === cleanName.toLowerCase() || f.id === cleanName
      );
      if (foundFac || typePrefix === 'faction') {
        const facObj = foundFac || factions.find((f) => f.name.toLowerCase().includes(cleanName.toLowerCase()));
        const targetId = facObj ? facObj.id : '';
        const displayName = facObj ? facObj.name : cleanName;

        return `<span class="wiki-link wiki-faction inline-flex items-center gap-1 font-semibold text-indigo-400 bg-indigo-950/50 border border-indigo-500/40 px-1.5 py-0.5 rounded hover:bg-indigo-900/70 hover:border-indigo-400 cursor-pointer transition-all shadow-sm" data-type="faction" data-id="${targetId}" data-name="${displayName}">
          <svg class="w-3 h-3 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          <span>${displayName}</span>
        </span>`;
      }

      // Fallback for untyped or unknown name
      return `<span class="wiki-link wiki-unknown inline-flex items-center gap-1 font-medium text-slate-300 bg-slate-800/80 border border-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-700 cursor-pointer transition-all shadow-sm" data-type="character" data-name="${cleanName}">
        <span>[[${cleanName}]]</span>
      </span>`;
    });

    return marked.parse(processed) as string;
  } catch (err) {
    console.error('Wiki markdown parse error:', err);
    return marked.parse(rawMarkdown) as string;
  }
}
