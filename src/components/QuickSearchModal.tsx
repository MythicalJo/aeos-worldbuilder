import React, { useState, useEffect, useRef } from 'react';
import { Character, Location, Faction, TimelineEvent, MarkdownDoc } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
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
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>('');

  useOutsideClick(modalRef, onClose, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
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

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const modalBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] text-[#0f172a] border-[#e2e8f0]'
    : 'bg-[#09090b] text-[#e4e4e7] border-[#27272a]';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1]'
    : 'bg-[#0c0c0e] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090]'
    : isLight
    ? 'bg-[#f8fafc] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4 select-none animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full max-w-2xl ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]`}
      >
        {/* Search Header */}
        <div className={`p-3.5 border-b ${headerBg} flex items-center gap-3 shrink-0`}>
          <Search className={`w-4 h-4 ${accentColor} shrink-0`} />
          <input
            type="text"
            autoFocus
            placeholder="Search manuscript chapters, characters, places, factions, or timeline..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs md:text-sm font-semibold focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Chapters / Markdown Docs */}
          {matchedDocs.length > 0 && (
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} mb-1.5 flex items-center gap-1`}>
                <FileText className="w-3.5 h-3.5" />
                <span>Chapters & Notes ({matchedDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectDoc(d.id);
                      onClose();
                    }}
                    className={`p-2.5 ${cardBg} border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:border-indigo-500`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">{d.title}</h4>
                      <p className="text-[10px] opacity-70">{d.category} • {d.wordCount} words</p>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Characters */}
          {matchedChars.length > 0 && (
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} mb-1.5 flex items-center gap-1`}>
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
                    className={`p-2 ${cardBg} border rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:border-indigo-500`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${cardBg} border flex items-center justify-center font-bold ${accentColor} text-xs shrink-0`}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs truncate">{c.name}</h4>
                      <p className="text-[10px] opacity-70 truncate">{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {matchedLocs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-500 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Places ({matchedLocs.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchedLocs.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onOpenEntityDetail('location', l.id);
                      onClose();
                    }}
                    className={`p-2 ${cardBg} border rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:border-sky-500`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${cardBg} border flex items-center justify-center text-sky-500 text-xs shrink-0`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs truncate">{l.name}</h4>
                      <p className="text-[10px] opacity-70 truncate">{l.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Events */}
          {matchedEvents.length > 0 && (
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} mb-1.5 flex items-center gap-1`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline Events ({matchedEvents.length})</span>
              </div>
              <div className="space-y-1">
                {matchedEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={onClose}
                    className={`p-2 ${cardBg} border rounded-xl flex items-center justify-between cursor-pointer transition-all`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">{e.title}</h4>
                      <p className="text-[10px] opacity-70">{e.yearLabel} • {e.era}</p>
                    </div>
                    <span className={`text-[9px] ${cardBg} border px-1.5 py-0.5 rounded font-mono`}>
                      {e.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-2.5 ${headerBg} border-t text-[10px] opacity-60 flex items-center justify-between shrink-0`}>
          <span>ESC to close</span>
          <span>Book Writing & Worldbuilder Workspace</span>
        </div>
      </div>
    </div>
  );
};
