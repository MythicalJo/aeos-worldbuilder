import React, { useState, useEffect } from 'react';
import { Character, Location, Faction, TimelineEvent, MarkdownDoc } from '../types';
import {
  Search,
  X,
  User,
  MapPin,
  Shield,
  Clock,
  FileText,
  ChevronRight
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  timeline: TimelineEvent[];
  docs: MarkdownDoc[];
  onSelectDoc: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  characters,
  locations,
  factions,
  timeline,
  docs,
  onSelectDoc,
  onOpenEntityDetail
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          /* Trigger search open handled by parent */
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedChars = trimmed
    ? characters.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.title.toLowerCase().includes(trimmed) ||
          c.traits.some((t) => t.toLowerCase().includes(trimmed))
      )
    : characters.slice(0, 3);

  const matchedLocs = trimmed
    ? locations.filter(
        (l) =>
          l.name.toLowerCase().includes(trimmed) ||
          l.region.toLowerCase().includes(trimmed) ||
          l.type.toLowerCase().includes(trimmed)
      )
    : locations.slice(0, 3);

  const matchedFactions = trimmed
    ? factions.filter(
        (f) =>
          f.name.toLowerCase().includes(trimmed) ||
          f.motto.toLowerCase().includes(trimmed)
      )
    : factions.slice(0, 2);

  const matchedEvents = trimmed
    ? timeline.filter(
        (e) =>
          e.title.toLowerCase().includes(trimmed) ||
          e.summary.toLowerCase().includes(trimmed) ||
          e.era.toLowerCase().includes(trimmed)
      )
    : timeline.slice(0, 3);

  const matchedDocs = trimmed
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(trimmed) ||
          d.category.toLowerCase().includes(trimmed) ||
          d.tags.some((t) => t.toLowerCase().includes(trimmed))
      )
    : docs.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-[#09090b] border border-[#27272a] rounded shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] text-[#e4e4e7]">
        {/* Search Header */}
        <div className="p-3 border-b border-[#27272a] flex items-center gap-3 bg-[#09090b]">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search characters, locations, factions, notes, or timeline events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs md:text-sm text-[#e4e4e7] placeholder-[#71717a] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#18181b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs">
          {/* Notes / Markdown Docs */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Markdown Notes ({matchedDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectDoc(d.id);
                      onClose();
                    }}
                    className="p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{d.title}</h4>
                      <p className="text-[10px] text-[#a1a1aa]">{d.category} • {d.wordCount} words</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#71717a]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Characters */}
          {matchedChars.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>Characters ({matchedChars.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchedChars.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onOpenEntityDetail('character', c.id);
                      onClose();
                    }}
                    className="p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0">
                      {c.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white truncate">{c.name}</h4>
                      <p className="text-[10px] text-[#a1a1aa] truncate">{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {matchedLocs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Locations & Atlas ({matchedLocs.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchedLocs.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onOpenEntityDetail('location', l.id);
                      onClose();
                    }}
                    className="p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-bold text-sky-400 text-xs shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white truncate">{l.name}</h4>
                      <p className="text-[10px] text-[#a1a1aa] truncate">{l.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Events */}
          {matchedEvents.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline Events ({matchedEvents.length})</span>
              </div>
              <div className="space-y-1">
                {matchedEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={onClose}
                    className="p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{e.title}</h4>
                      <p className="text-[10px] text-[#a1a1aa]">{e.yearLabel} • {e.era}</p>
                    </div>
                    <span className="text-[9px] bg-[#18181b] border border-[#27272a] px-1.5 py-0.5 rounded text-amber-500">
                      {e.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="p-2.5 bg-[#09090b] border-t border-[#27272a] text-[10px] text-[#71717a] flex items-center justify-between">
          <span>ESC to close search</span>
          <span>Worldbuilding Bible Engine</span>
        </div>
      </div>
    </div>
  );
};
