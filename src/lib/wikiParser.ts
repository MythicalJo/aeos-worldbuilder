import { Character, Location, Faction } from '../types';
import { marked } from 'marked';

export function parseWikiLinksToHTML(
  rawMarkdown: string,
  characters: Character[] = [],
  locations: Location[] = [],
  factions: Faction[] = []
): string {
  try {
    // Replace [[Character Name]] or [[Type: Name]] with sleek modern reference links
    const processed = rawMarkdown.replace(/\[\[([^\]]+)\]\]/g, (match, innerText: string) => {
      let typePrefix = '';
      let cleanName = innerText.trim();

      if (cleanName.includes(':')) {
        const parts = cleanName.split(':');
        typePrefix = parts[0].trim().toLowerCase();
        cleanName = parts.slice(1).join(':').trim();
      }

      // Check matching Character
      const foundChar = characters.find(
        (c) => c.name.toLowerCase() === cleanName.toLowerCase() || c.id === cleanName
      );
      if (foundChar || typePrefix === 'character') {
        const charObj = foundChar || characters.find((c) => c.name.toLowerCase().includes(cleanName.toLowerCase()));
        const targetId = charObj ? charObj.id : '';
        const displayName = charObj ? charObj.name : cleanName;

        return `<span class="wiki-link wiki-character inline-flex items-baseline gap-1 font-bold text-amber-500 hover:text-amber-400 cursor-pointer underline underline-offset-4 decoration-amber-500/40 hover:decoration-amber-400 transition-all" data-type="character" data-id="${targetId}" data-name="${displayName}">
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

        return `<span class="wiki-link wiki-location inline-flex items-baseline gap-1 font-bold text-sky-500 hover:text-sky-400 cursor-pointer underline underline-offset-4 decoration-sky-500/40 hover:decoration-sky-400 transition-all" data-type="location" data-id="${targetId}" data-name="${displayName}">
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

        return `<span class="wiki-link wiki-faction inline-flex items-baseline gap-1 font-bold text-indigo-500 hover:text-indigo-400 cursor-pointer underline underline-offset-4 decoration-indigo-500/40 hover:decoration-indigo-400 transition-all" data-type="faction" data-id="${targetId}" data-name="${displayName}">
          <span>${displayName}</span>
        </span>`;
      }

      // Fallback
      return `<span class="wiki-link wiki-unknown inline-flex items-baseline gap-1 font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer underline underline-offset-4 decoration-indigo-400/40 transition-all" data-type="character" data-name="${cleanName}">
        <span>${cleanName}</span>
      </span>`;
    });

    return marked.parse(processed) as string;
  } catch (err) {
    console.error('Wiki markdown parse error:', err);
    return marked.parse(rawMarkdown) as string;
  }
}
