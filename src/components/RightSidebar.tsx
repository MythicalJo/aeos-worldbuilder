import React from 'react';
import { TimelineEvent, Character, Location, Book, Faction } from '../types';
import { VisualTimeline } from './VisualTimeline';
import { useLoreContext } from '../context/LoreContext';
import {
  User,
  MapPin,
  Shield,
  Sparkles,
  FileText,
  X,
  ArrowLeft,
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface RightSidebarProps {
  timelineEvents: TimelineEvent[];
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  books: Book[];
  selectedBookId: string;
  onSelectBookId?: (id: string) => void;
  onSelectDoc: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEvent: () => void;
  isOpen: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  timelineEvents,
  characters,
  locations,
  factions,
  books,
  selectedBookId,
  onSelectBookId,
  onSelectDoc,
  onOpenEntityDetail,
  onCreateEvent,
  isOpen
}) => {
  const { pcRightPanelMode, setPcRightPanelMode, selectedEntity, closeEntityDetail } = useLoreContext();

  if (!isOpen) return null;

  // Selected character / entity object lookup
  const selectedChar =
    selectedEntity && selectedEntity.type === 'character'
      ? characters.find((c) => c.id === selectedEntity.id)
      : null;

  const selectedLoc =
    selectedEntity && selectedEntity.type === 'location'
      ? locations.find((l) => l.id === selectedEntity.id)
      : null;

  const selectedFac =
    selectedEntity && selectedEntity.type === 'faction'
      ? factions.find((f) => f.id === selectedEntity.id)
      : null;

  return (
    <aside className="w-full h-full bg-[#09090b] border-l border-[#27272a] flex flex-col shrink-0 z-20 text-[#e4e4e7] overflow-hidden">
      {pcRightPanelMode === 'entityDetail' && (selectedChar || selectedLoc || selectedFac) ? (
        /* CONTEXTUAL ENTITY PROFILE DRAWER NEXT TO TEXT EDITOR */
        <div className="flex-1 flex flex-col min-h-0 bg-[#09090b] p-4 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Header Navigation */}
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3 shrink-0">
            <button
              onClick={closeEntityDetail}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-[#18181b] border border-[#27272a] px-2.5 py-1 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Timeline</span>
            </button>

            <button
              onClick={closeEntityDetail}
              className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#18181b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CHARACTER PROFILE SHEET */}
          {selectedChar && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {selectedChar.avatarUrl ? (
                  <img
                    src={selectedChar.avatarUrl}
                    alt={selectedChar.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-amber-500/40 shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#18181b] border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-lg shrink-0 shadow-lg">
                    {selectedChar.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                    {selectedChar.role}
                  </span>
                  <h3 className="text-base font-bold text-white truncate mt-1">{selectedChar.name}</h3>
                  <p className="text-xs text-[#a1a1aa] leading-tight">{selectedChar.title}</p>
                </div>
              </div>

              {/* Status & Magic Affinity */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#18181b] p-2 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] uppercase font-bold block">Status</span>
                  <span className="font-semibold text-emerald-400">{selectedChar.status}</span>
                </div>
                <div className="bg-[#18181b] p-2 rounded-lg border border-[#27272a]">
                  <span className="text-[10px] text-[#71717a] uppercase font-bold block">Affinity</span>
                  <span className="font-semibold text-amber-400 truncate block">
                    {selectedChar.magicAffinity || 'None'}
                  </span>
                </div>
              </div>

              {/* Traits Pills */}
              {selectedChar.traits && selectedChar.traits.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                    Traits & Qualities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedChar.traits.map((t) => (
                      <span
                        key={t}
                        className="bg-[#18181b] text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                  Biography & Overview
                </span>
                <p className="text-xs text-[#e4e4e7] leading-relaxed bg-[#0c0c0e] p-3 rounded-lg border border-[#27272a]">
                  {selectedChar.description}
                </p>
              </div>

              {/* Quote */}
              {selectedChar.quote && (
                <blockquote className="border-l-2 border-amber-500 pl-3 py-1 text-xs italic text-amber-300/90 bg-[#18181b]/50 rounded-r">
                  "{selectedChar.quote}"
                </blockquote>
              )}

              {/* Open Note Button */}
              {selectedChar.markdownNoteId && (
                <button
                  onClick={() => onSelectDoc(selectedChar.markdownNoteId!)}
                  className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Lore Note File</span>
                </button>
              )}
            </div>
          )}

          {/* LOCATION PROFILE SHEET */}
          {selectedLoc && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {selectedLoc.imageUrl ? (
                  <img
                    src={selectedLoc.imageUrl}
                    alt={selectedLoc.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-14 rounded-xl object-cover border border-sky-500/40 shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-16 h-14 rounded-xl bg-[#18181b] border border-sky-500/40 flex items-center justify-center font-bold text-sky-400 text-lg shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
                    {selectedLoc.type}
                  </span>
                  <h3 className="text-base font-bold text-white truncate mt-1">{selectedLoc.name}</h3>
                  <p className="text-xs text-[#a1a1aa]">{selectedLoc.region}</p>
                </div>
              </div>

              <p className="text-xs text-[#e4e4e7] leading-relaxed bg-[#0c0c0e] p-3 rounded-lg border border-[#27272a]">
                {selectedLoc.description}
              </p>
            </div>
          )}

          {/* FACTION PROFILE SHEET */}
          {selectedFac && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-2xl shrink-0 shadow-lg">
                  {selectedFac.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                    {selectedFac.allegiance}
                  </span>
                  <h3 className="text-base font-bold text-white truncate mt-1">{selectedFac.name}</h3>
                  <p className="text-xs text-[#a1a1aa] italic">"{selectedFac.motto}"</p>
                </div>
              </div>

              <p className="text-xs text-[#e4e4e7] leading-relaxed bg-[#0c0c0e] p-3 rounded-lg border border-[#27272a]">
                {selectedFac.description}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* GLOBAL TIMELINE CANVAS */
        <VisualTimeline
          timelineEvents={timelineEvents}
          characters={characters}
          locations={locations}
          books={books}
          selectedBookFilter={selectedBookId}
          onSelectBookFilter={(filter) => {
            if (onSelectBookId) onSelectBookId(filter);
          }}
          onSelectDoc={onSelectDoc}
          onOpenEntityDetail={onOpenEntityDetail}
          onCreateEvent={onCreateEvent}
        />
      )}
    </aside>
  );
};
