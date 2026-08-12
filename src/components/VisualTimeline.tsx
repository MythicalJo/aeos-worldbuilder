import React, { useState, useMemo } from 'react';
import { TimelineEvent, Character, Location, Book } from '../types';
import {
  Clock,
  Plus,
  Search,
  Swords,
  Crown,
  Flame,
  Scroll,
  Sparkles,
  Compass,
  Zap,
  Filter,
  User,
  MapPin,
  FileText,
  LayoutList,
  Columns,
  Layers,
  ChevronRight,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';

interface VisualTimelineProps {
  timelineEvents: TimelineEvent[];
  characters: Character[];
  locations: Location[];
  books: Book[];
  selectedBookFilter: string; // 'all' | 'Trilogy Book 1' | 'Standalone A' | 'Trilogy Book 2' | 'Trilogy Book 3' | bookId
  onSelectBookFilter: (filter: string) => void;
  onSelectDoc?: (id: string) => void;
  onOpenEntityDetail?: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEvent?: () => void;
  compactMode?: boolean;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  timelineEvents,
  characters,
  locations,
  books,
  selectedBookFilter,
  onSelectBookFilter,
  onSelectDoc,
  onOpenEntityDetail,
  onCreateEvent,
  compactMode = false
}) => {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('vertical');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Map dropdown values to filter conditions
  const filteredEvents = useMemo(() => {
    return timelineEvents
      .filter((evt) => {
        // Book Filter Check
        let matchesBook = true;
        if (selectedBookFilter && selectedBookFilter !== 'all') {
          const filterLower = selectedBookFilter.toLowerCase();
          const evtTagLower = (evt.bookFilterTag || '').toLowerCase();
          const evtBookIdLower = (evt.bookId || '').toLowerCase();

          // Find book title if ID was passed
          const matchedBookObj = books.find((b) => b.id === selectedBookFilter);
          const bookTitleLower = matchedBookObj ? matchedBookObj.title.toLowerCase() : '';

          matchesBook =
            evtTagLower.includes(filterLower) ||
            evtBookIdLower === filterLower ||
            (bookTitleLower !== '' && bookTitleLower.includes(filterLower));
        }

        // Search Filter Check
        const matchesSearch =
          searchTerm === '' ||
          evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evt.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evt.era.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (evt.bookFilterTag && evt.bookFilterTag.toLowerCase().includes(searchTerm.toLowerCase()));

        // Importance Filter Check
        const matchesImportance =
          importanceFilter === 'all' || evt.importance.toLowerCase() === importanceFilter.toLowerCase();

        return matchesBook && matchesSearch && matchesImportance;
      })
      .sort((a, b) => a.year - b.year);
  }, [timelineEvents, selectedBookFilter, searchTerm, importanceFilter, books]);

  // Group events by Era for timeline markers
  const eraGroups = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    filteredEvents.forEach((evt) => {
      if (!groups[evt.era]) {
        groups[evt.era] = [];
      }
      groups[evt.era].push(evt);
    });
    return groups;
  }, [filteredEvents]);

  const getEventIcon = (type: TimelineEvent['eventType']) => {
    switch (type) {
      case 'Battle':
        return <Swords className="w-4 h-4 text-rose-400" />;
      case 'Coronation':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'Cataclysm':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Secret Treaty':
        return <Scroll className="w-4 h-4 text-emerald-400" />;
      case 'Discovery':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'Magic Surge':
        return <Zap className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const selectedEvent = timelineEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#09090b] text-[#e4e4e7] overflow-hidden select-none">
      {/* Top Filter & Toolbar Bar */}
      <div className="p-3 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Book Selection Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[#71717a] font-medium hidden sm:inline">Book:</span>
            <select
              value={selectedBookFilter}
              onChange={(e) => onSelectBookFilter(e.target.value)}
              className="bg-transparent text-[#e4e4e7] font-semibold text-xs py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#09090b] text-[#e4e4e7]">
                All Books
              </option>
              <option value="Trilogy Book 1" className="bg-[#09090b] text-[#e4e4e7]">
                Trilogy Book 1
              </option>
              <option value="Standalone A" className="bg-[#09090b] text-[#e4e4e7]">
                Standalone A
              </option>
              <option value="Trilogy Book 2" className="bg-[#09090b] text-[#e4e4e7]">
                Trilogy Book 2
              </option>
              <option value="Trilogy Book 3" className="bg-[#09090b] text-[#e4e4e7]">
                Trilogy Book 3
              </option>
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[140px] max-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#71717a]" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] text-xs pl-8 pr-2 py-1 rounded text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* View Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Orientation Switcher */}
          <div className="flex items-center bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
            <button
              onClick={() => setOrientation('vertical')}
              className={`p-1 rounded transition-colors ${
                orientation === 'vertical' ? 'bg-[#09090b] text-amber-400 font-bold border border-[#27272a]' : 'text-[#71717a] hover:text-white'
              }`}
              title="Vertical Visual Timeline"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOrientation('horizontal')}
              className={`p-1 rounded transition-colors ${
                orientation === 'horizontal' ? 'bg-[#09090b] text-amber-400 font-bold border border-[#27272a]' : 'text-[#71717a] hover:text-white'
              }`}
              title="Horizontal Sequential Rail"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          {onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Timeline Plotting Canvas */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        {filteredEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#71717a] space-y-2">
            <Clock className="w-10 h-10 text-[#27272a]" />
            <p className="text-xs">No timeline events found matching the selected book filter.</p>
          </div>
        ) : orientation === 'horizontal' ? (
          /* ========================================================= */
          /* 1. HORIZONTAL SEQUENTIAL TIMELINE TRACK                   */
          /* ========================================================= */
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex flex-col justify-center relative no-scrollbar">
            <div className="relative min-w-max flex items-center py-16 px-10 gap-12">
              {/* Horizontal Connecting Spine Line */}
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500/60 to-indigo-500/30 rounded -translate-y-1/2 z-0" />

              {filteredEvents.map((evt, idx) => {
                const isSelected = evt.id === selectedEventId;
                const isTop = idx % 2 === 0;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                    className="relative flex flex-col items-center group cursor-pointer shrink-0 z-10 w-56"
                  >
                    {/* Event Node Pin on Line */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-amber-500 border-white scale-125 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                          : 'bg-[#18181b] border-amber-500/80 group-hover:scale-110 group-hover:border-amber-400'
                      }`}
                    >
                      {getEventIcon(evt.eventType)}
                    </div>

                    {/* Year Indicator Pill */}
                    <span className="mt-2 text-[10px] font-mono font-bold text-amber-400 bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                      {evt.yearLabel || `Year ${evt.year}`}
                    </span>

                    {/* Event Preview Card (Positioned Above or Below Line) */}
                    <div
                      className={`absolute w-56 p-3 rounded-xl border transition-all duration-300 ${
                        isTop ? 'bottom-16' : 'top-16'
                      } ${
                        isSelected
                          ? 'bg-[#18181b] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                          : 'bg-[#0c0c0e]/95 hover:bg-[#18181b] border-[#27272a] shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40 truncate">
                          {evt.bookFilterTag || evt.era}
                        </span>
                        <span className="text-[9px] text-[#71717a] font-medium">{evt.importance}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-400">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-[#a1a1aa] leading-snug line-clamp-2 mt-1">
                        {evt.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 2. VERTICAL CHRONOLOGICAL STREAM TIMELINE                 */
          /* ========================================================= */
          <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
            {/* Vertical Spine Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/50 via-indigo-500/30 to-slate-800" />

            {Object.entries(eraGroups).map(([era, events]: [string, TimelineEvent[]]) => (
              <div key={era} className="space-y-3 relative z-10">
                {/* Era Marker Badge */}
                <div className="sticky top-0 z-20 flex items-center gap-2 bg-[#09090b]/95 py-1 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-[#18181b] border border-amber-500/30 px-2 py-0.5 rounded shadow-sm">
                    {era}
                  </span>
                  <div className="flex-1 h-[1px] bg-[#27272a]" />
                </div>

                {/* Event Cards */}
                <div className="space-y-3 ml-2">
                  {events.map((evt) => {
                    const isSelected = evt.id === selectedEventId;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                        className={`group relative pl-8 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#18181b] border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                            : 'bg-[#0c0c0e] hover:bg-[#18181b] border-[#27272a]'
                        }`}
                      >
                        {/* Node Dot on Line */}
                        <div
                          className={`absolute left-[-15px] top-4 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-110 flex items-center justify-center ${
                            isSelected
                              ? 'bg-amber-500 border-white shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                              : 'bg-[#09090b] border-amber-500/80'
                          }`}
                        >
                          {getEventIcon(evt.eventType)}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="font-bold text-xs md:text-sm text-white group-hover:text-amber-400 truncate">
                              {evt.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {evt.bookFilterTag && (
                              <span className="text-[9px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.2 rounded">
                                {evt.bookFilterTag}
                              </span>
                            )}
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                              {evt.yearLabel || `Year ${evt.year}`}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#a1a1aa] leading-relaxed mt-1">
                          {evt.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Event Details Modal / Drawer */}
      {selectedEvent && (
        <div className="p-4 bg-[#18181b] border-t border-[#27272a] space-y-3 shrink-0 z-30 shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                {getEventIcon(selectedEvent.eventType)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{selectedEvent.title}</h3>
                <span className="text-[10px] text-amber-400 font-mono">
                  {selectedEvent.yearLabel} {selectedEvent.bookFilterTag ? `• ${selectedEvent.bookFilterTag}` : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedEventId(null)}
              className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#27272a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#e4e4e7] leading-relaxed bg-[#09090b] p-3 rounded-lg border border-[#27272a]">
            {selectedEvent.summary}
          </p>

          {/* Involved Characters */}
          {selectedEvent.characterIds && selectedEvent.characterIds.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                Involved Characters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.characterIds.map((cid) => {
                  const charObj = characters.find((c) => c.id === cid);
                  if (!charObj) return null;
                  return (
                    <button
                      key={cid}
                      onClick={() => onOpenEntityDetail && onOpenEntityDetail('character', cid)}
                      className="bg-[#09090b] hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                    >
                      👤 {charObj.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedEvent.markdownNoteId && onSelectDoc && (
            <button
              onClick={() => onSelectDoc(selectedEvent.markdownNoteId!)}
              className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors shadow"
            >
              <FileText className="w-4 h-4" />
              <span>Open Associated Note</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
