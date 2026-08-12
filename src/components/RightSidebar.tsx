import React from 'react';
import { TimelineEvent, Character, Location, Book, Faction } from '../types';
import { VisualTimeline } from './VisualTimeline';
import { useLoreContext } from '../context/LoreContext';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin,
  FileText,
  X,
  ArrowLeft
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
  onUpdateEvent?: (updated: TimelineEvent) => void;
  onDeleteEvent?: (id: string) => void;
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
  onUpdateEvent,
  onDeleteEvent,
  isOpen
}) => {
  const { theme } = useTheme();
  const { pcRightPanelMode, selectedEntity, closeEntityDetail } = useLoreContext();

  if (!isOpen) return null;

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

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const sidebarBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090] text-[#433422]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a]'
    : 'bg-[#09090b] border-[#27272a] text-[#e4e4e7]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <aside className={`w-full h-full ${sidebarBg} border-l flex flex-col shrink-0 z-20 overflow-hidden select-none`}>
      {pcRightPanelMode === 'entityDetail' && (selectedChar || selectedLoc || selectedFac) ? (
        /* CONTEXTUAL WORLDBUILDER PROFILE DRAWER NEXT TO TEXT EDITOR */
        <div className={`flex-1 flex flex-col min-h-0 ${sidebarBg} p-4 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200`}>
          {/* Header Navigation */}
          <div className="flex items-center justify-between border-b pb-3 shrink-0 opacity-80">
            <button
              onClick={closeEntityDetail}
              className={`flex items-center gap-1.5 text-xs font-bold ${accentColor} ${cardBg} border px-2.5 py-1 rounded transition-colors`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Timeline</span>
            </button>

            <button
              onClick={closeEntityDetail}
              className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10"
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
                    className="w-16 h-16 rounded-xl object-cover border shadow-lg shrink-0"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-xl ${cardBg} border flex items-center justify-center font-bold ${accentColor} text-lg shrink-0 shadow-lg`}>
                    {selectedChar.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} ${cardBg} border px-2 py-0.5 rounded`}>
                    {selectedChar.role}
                  </span>
                  <h3 className="text-base font-bold truncate mt-1">{selectedChar.name}</h3>
                  <p className="text-xs opacity-70 leading-tight">{selectedChar.title}</p>
                </div>
              </div>

              {/* Status & Magic Affinity */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${cardBg} p-2 rounded-lg border`}>
                  <span className="text-[10px] opacity-60 uppercase font-bold block">Status</span>
                  <span className="font-semibold text-emerald-500">{selectedChar.status}</span>
                </div>
                <div className={`${cardBg} p-2 rounded-lg border`}>
                  <span className="text-[10px] opacity-60 uppercase font-bold block">Affinity</span>
                  <span className={`font-semibold ${accentColor} truncate block`}>
                    {selectedChar.magicAffinity || 'None'}
                  </span>
                </div>
              </div>

              {/* Traits Pills */}
              {selectedChar.traits && selectedChar.traits.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">
                    Traits & Qualities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedChar.traits.map((t) => (
                      <span
                        key={t}
                        className={`${cardBg} border px-2 py-0.5 rounded text-[11px] font-medium`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">
                  Biography & Overview
                </span>
                <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-lg border`}>
                  {selectedChar.description}
                </p>
              </div>

              {/* Quote */}
              {selectedChar.quote && (
                <blockquote className={`border-l-2 border-indigo-500 pl-3 py-1 text-xs italic ${cardBg} rounded-r opacity-90`}>
                  "{selectedChar.quote}"
                </blockquote>
              )}

              {/* Open Note Button */}
              {selectedChar.markdownNoteId && (
                <button
                  onClick={() => onSelectDoc(selectedChar.markdownNoteId!)}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Worldbuilder Note</span>
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
                    className="w-16 h-14 rounded-xl object-cover border shadow-lg shrink-0"
                  />
                ) : (
                  <div className={`w-16 h-14 rounded-xl ${cardBg} border flex items-center justify-center font-bold text-sky-500 text-lg shrink-0 shadow-lg`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-sky-500 ${cardBg} border px-2 py-0.5 rounded`}>
                    {selectedLoc.type}
                  </span>
                  <h3 className="text-base font-bold truncate mt-1">{selectedLoc.name}</h3>
                  <p className="text-xs opacity-70">{selectedLoc.region}</p>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-lg border`}>
                {selectedLoc.description}
              </p>
            </div>
          )}

          {/* FACTION PROFILE SHEET */}
          {selectedFac && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-14 h-14 rounded-xl ${cardBg} border flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                  {selectedFac.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} ${cardBg} border px-2 py-0.5 rounded`}>
                    {selectedFac.allegiance}
                  </span>
                  <h3 className="text-base font-bold truncate mt-1">{selectedFac.name}</h3>
                  <p className="text-xs opacity-70 italic">"{selectedFac.motto}"</p>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-lg border`}>
                {selectedFac.description}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* GLOBAL WORLDBUILDER TIMELINE CANVAS */
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
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      )}
    </aside>
  );
};
