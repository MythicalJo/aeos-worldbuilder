import React, { useState, useMemo, useRef } from 'react';
import { TimelineEvent, Character, Location, Book } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
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
  User,
  FileText,
  LayoutList,
  Columns,
  BookOpen,
  X,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';

interface VisualTimelineProps {
  timelineEvents: TimelineEvent[];
  characters: Character[];
  locations: Location[];
  books: Book[];
  selectedBookFilter: string;
  onSelectBookFilter: (filter: string) => void;
  onSelectDoc?: (id: string) => void;
  onOpenEntityDetail?: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEvent?: () => void;
  onUpdateEvent?: (updated: TimelineEvent) => void;
  onDeleteEvent?: (id: string) => void;
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
  onUpdateEvent,
  onDeleteEvent,
  compactMode = false
}) => {
  const { theme, getAccentClasses } = useTheme();
  const accentClasses = getAccentClasses();

  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('vertical');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Edit Event State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editYear, setEditYear] = useState<number>(0);
  const [editYearLabel, setEditYearLabel] = useState<string>('');
  const [editEra, setEditEra] = useState<string>('First Era');
  const [editSummary, setEditSummary] = useState<string>('');
  const [editBookId, setEditBookId] = useState<string>(books[0]?.id || 'book-1');
  const [editImportance, setEditImportance] = useState<TimelineEvent['importance']>('Major');

  const editModalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(editModalRef, () => setIsEditing(false), isEditing);

  const filteredEvents = useMemo(() => {
    return timelineEvents
      .filter((evt) => {
        let matchesBook = true;
        if (selectedBookFilter && selectedBookFilter !== 'all') {
          matchesBook = evt.bookId === selectedBookFilter || evt.bookFilterTag === selectedBookFilter;
        }

        const matchesSearch =
          searchTerm === '' ||
          evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evt.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evt.era.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesBook && matchesSearch;
      })
      .sort((a, b) => a.year - b.year);
  }, [timelineEvents, selectedBookFilter, searchTerm]);

  const eraGroups = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    filteredEvents.forEach((evt) => {
      const eraKey = evt.era || 'Current Era';
      if (!groups[eraKey]) {
        groups[eraKey] = [];
      }
      groups[eraKey].push(evt);
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
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const selectedEvent = timelineEvents.find((e) => e.id === selectedEventId);

  const startEditEvent = (evt: TimelineEvent) => {
    setEditTitle(evt.title);
    setEditYear(evt.year);
    setEditYearLabel(evt.yearLabel || `Year ${evt.year}`);
    setEditEra(evt.era || 'First Era');
    setEditSummary(evt.summary);
    setEditBookId(evt.bookId || books[0]?.id || 'book-1');
    setEditImportance(evt.importance || 'Major');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !onUpdateEvent) return;

    onUpdateEvent({
      ...selectedEvent,
      title: editTitle.trim(),
      year: editYear,
      yearLabel: editYearLabel.trim(),
      era: editEra.trim(),
      summary: editSummary.trim(),
      bookId: editBookId,
      importance: editImportance
    });

    setIsEditing(false);
  };

  const handleDeleteCurrentEvent = () => {
    if (!selectedEventId || !onDeleteEvent) return;
    if (confirm('Delete this timeline event permanently?')) {
      onDeleteEvent(selectedEventId);
      setSelectedEventId(null);
      setIsEditing(false);
    }
  };

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const containerBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422]'
    : isLight
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#09090b] text-[#e4e4e7]';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1]'
    : 'bg-[#0c0c0e] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  return (
    <div className={`flex-1 flex flex-col h-full min-h-0 ${containerBg} overflow-hidden select-none`}>
      {/* Top Filter & Toolbar Bar */}
      <div className={`p-3 border-b ${headerBg} flex flex-wrap items-center justify-between gap-2 shrink-0`}>
        {/* Dynamic Book Selection Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 ${cardBg} rounded-xl border px-2.5 py-1 text-xs`}>
            <BookOpen className={`w-3.5 h-3.5 ${accentClasses.text} shrink-0`} />
            <span className="opacity-60 font-bold hidden sm:inline">Book:</span>
            <select
              value={selectedBookFilter}
              onChange={(e) => onSelectBookFilter(e.target.value)}
              className="bg-transparent font-bold text-xs py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Project Books</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[140px] max-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${cardBg} border text-xs pl-8 pr-2 py-1 rounded-xl focus:outline-none focus:border-indigo-500`}
            />
          </div>
        </div>

        {/* View Controls & Actions */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center ${cardBg} p-0.5 rounded-xl border text-xs`}>
            <button
              onClick={() => setOrientation('vertical')}
              className={`p-1 rounded-lg transition-colors ${
                orientation === 'vertical' ? `${containerBg} ${accentClasses.text} font-bold border` : 'opacity-60 hover:opacity-100'
              }`}
              title="Vertical Worldbuilder Timeline"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOrientation('horizontal')}
              className={`p-1 rounded-lg transition-colors ${
                orientation === 'horizontal' ? `${containerBg} ${accentClasses.text} font-bold border` : 'opacity-60 hover:opacity-100'
              }`}
              title="Horizontal Timeline Rail"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          {onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className={`flex items-center gap-1 text-xs ${accentClasses.bg} text-white px-3 py-1 rounded-xl font-bold transition-all shadow`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Timeline Canvas */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        {filteredEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-60 space-y-2">
            <Clock className="w-10 h-10 opacity-40" />
            <p className="text-xs">No timeline events found matching the selected project book filter.</p>
          </div>
        ) : orientation === 'horizontal' ? (
          /* HORIZONTAL TIMELINE TRACK */
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex flex-col justify-center relative no-scrollbar">
            <div className="relative min-w-max flex items-center py-16 px-10 gap-12">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-indigo-500/30 rounded -translate-y-1/2 z-0" />

              {filteredEvents.map((evt, idx) => {
                const isSelected = evt.id === selectedEventId;
                const isTop = idx % 2 === 0;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                    className="relative flex flex-col items-center group cursor-pointer shrink-0 z-10 w-56"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-indigo-600 border-white scale-125 shadow-lg'
                          : `${cardBg} border-indigo-500/80 group-hover:scale-110`
                      }`}
                    >
                      {getEventIcon(evt.eventType)}
                    </div>

                    <span className={`mt-2 text-[10px] font-mono font-bold ${accentClasses.text} ${cardBg} px-2 py-0.5 rounded border`}>
                      {evt.yearLabel || `Year ${evt.year}`}
                    </span>

                    <div
                      className={`absolute w-56 p-3 rounded-xl border transition-all duration-300 ${
                        isTop ? 'bottom-16' : 'top-16'
                      } ${
                        isSelected
                          ? `${cardBg} border-indigo-500 shadow-xl ring-2 ring-indigo-500/50`
                          : `${cardBg} shadow-md opacity-90 hover:opacity-100`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[9px] font-bold ${accentClasses.text} uppercase tracking-wider ${cardBg} px-1.5 py-0.2 rounded border truncate`}>
                          {evt.era}
                        </span>
                        <span className="text-[9px] opacity-60 font-medium">{evt.importance}</span>
                      </div>
                      <h4 className="font-bold text-xs truncate group-hover:text-indigo-500">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] opacity-75 leading-snug line-clamp-2 mt-1">
                        {evt.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VERTICAL TIMELINE STREAM */
          <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-indigo-500/30" />

            {Object.entries(eraGroups).map(([era, events]: [string, TimelineEvent[]]) => (
              <div key={era} className="space-y-3 relative z-10">
                <div className={`sticky top-0 z-20 flex items-center gap-2 ${containerBg} py-1 backdrop-blur-md`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accentClasses.text} ${cardBg} border px-2 py-0.5 rounded shadow-sm`}>
                    {era}
                  </span>
                  <div className="flex-1 h-[1px] opacity-20 bg-current" />
                </div>

                <div className="space-y-3 ml-2">
                  {events.map((evt) => {
                    const isSelected = evt.id === selectedEventId;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                        className={`group relative pl-8 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? `${cardBg} border-indigo-500 shadow-xl ring-2 ring-indigo-500/40`
                            : `${cardBg} opacity-90 hover:opacity-100`
                        }`}
                      >
                        <div
                          className={`absolute left-[-15px] top-4 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-110 flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 border-white shadow-md'
                              : `${containerBg} border-indigo-500/80`
                          }`}
                        >
                          {getEventIcon(evt.eventType)}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="font-bold text-xs md:text-sm group-hover:text-indigo-500 truncate">
                              {evt.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono font-bold ${accentClasses.text} ${cardBg} px-2 py-0.5 rounded border`}>
                              {evt.yearLabel || `Year ${evt.year}`}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] opacity-80 leading-relaxed mt-1">
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

      {/* Selected Event Details Sheet */}
      {selectedEvent && (
        <div className={`p-4 ${headerBg} border-t space-y-3 shrink-0 z-30 shadow-2xl animate-in slide-in-from-bottom`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${cardBg} border flex items-center justify-center`}>
                {getEventIcon(selectedEvent.eventType)}
              </div>
              <div>
                <h3 className="font-bold text-sm">{selectedEvent.title}</h3>
                <span className={`text-[10px] ${accentClasses.text} font-mono`}>
                  {selectedEvent.yearLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onUpdateEvent && (
                <button
                  onClick={() => startEditEvent(selectedEvent)}
                  className={`p-1.5 rounded-lg ${cardBg} border text-xs font-bold flex items-center gap-1 hover:text-indigo-500`}
                  title="Edit Event Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={() => setSelectedEventId(null)}
                className="p-1 rounded opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-xl border`}>
            {selectedEvent.summary}
          </p>

          {/* Involved Characters (Safely Filters Nonexistent Ghost Entities) */}
          {selectedEvent.characterIds && selectedEvent.characterIds.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider flex items-center gap-1">
                <User className={`w-3 h-3 ${accentClasses.text}`} />
                Involved Characters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.characterIds
                  .map((cid) => characters.find((c) => c.id === cid))
                  .filter((c): c is Character => c !== undefined)
                  .map((charObj) => (
                    <button
                      key={charObj.id}
                      onClick={() => onOpenEntityDetail && onOpenEntityDetail('character', charObj.id)}
                      className={`${cardBg} border border-indigo-500/30 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors hover:border-indigo-500`}
                    >
                      👤 {charObj.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {selectedEvent.markdownNoteId && onSelectDoc && (
            <button
              onClick={() => onSelectDoc(selectedEvent.markdownNoteId!)}
              className={`w-full py-2 px-3 ${accentClasses.bg} text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow`}
            >
              <FileText className="w-4 h-4" />
              <span>Open Worldbuilder Note</span>
            </button>
          )}
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditing && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={editModalRef} className={`w-full max-w-lg ${headerBg} border rounded-2xl p-4 space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit2 className={`w-4 h-4 ${accentClasses.text}`} />
                <span>Edit Timeline Event</span>
              </h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded opacity-70 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Event Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Year (Numeric)</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Year Label</label>
                  <input
                    type="text"
                    value={editYearLabel}
                    onChange={(e) => setEditYearLabel(e.target.value)}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Associated Book</label>
                  <select
                    value={editBookId}
                    onChange={(e) => setEditBookId(e.target.value)}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none`}
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Era</label>
                  <input
                    type="text"
                    value={editEra}
                    onChange={(e) => setEditEra(e.target.value)}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description / Summary</label>
                <textarea
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  rows={3}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {onDeleteEvent && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentEvent}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 rounded-lg font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Event</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 opacity-70 hover:opacity-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
