import React, { useState } from 'react';
import { Character, Location, Faction, TimelineEvent, Book } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface CreateEntityModalProps {
  mode: 'character' | 'location' | 'faction' | 'event' | null;
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  factions: Faction[];
  locations: Location[];
  characters: Character[];
  onCreateCharacter: (c: Character) => void;
  onCreateLocation: (l: Location) => void;
  onCreateFaction: (f: Faction) => void;
  onCreateTimelineEvent: (e: TimelineEvent) => void;
}

export const CreateEntityModal: React.FC<CreateEntityModalProps> = ({
  mode,
  isOpen,
  onClose,
  books,
  factions,
  locations,
  characters,
  onCreateCharacter,
  onCreateLocation,
  onCreateFaction,
  onCreateTimelineEvent
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<Character['role']>('Supporting');
  const [status, setStatus] = useState<Character['status']>('Alive');
  const [description, setDescription] = useState('');
  const [magicAffinity, setMagicAffinity] = useState('');
  const [quote, setQuote] = useState('');
  const [traitsInput, setTraitsInput] = useState('Brave, Cautious');

  // Location specific
  const [locType, setLocType] = useState<Location['type']>('City');
  const [region, setRegion] = useState('Central Plains');
  const [dangerLevel, setDangerLevel] = useState<Location['dangerLevel']>('Moderate');

  // Faction specific
  const [motto, setMotto] = useState('');
  const [allegiance, setAllegiance] = useState<Faction['allegiance']>('Order');
  const [emblem, setEmblem] = useState('⚔️');

  // Event specific
  const [year, setYear] = useState<number>(1420);
  const [yearLabel, setYearLabel] = useState('Year 1420 TA');
  const [era, setEra] = useState<TimelineEvent['era']>('The Shattered Crown');
  const [eventType, setEventType] = useState<TimelineEvent['eventType']>('Battle');
  const [importance, setImportance] = useState<TimelineEvent['importance']>('Major');
  const [bookId, setBookId] = useState(books[0]?.id || 'book-1');

  if (!isOpen || !mode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `${mode}-${Date.now()}`;

    if (mode === 'character') {
      const traits = traitsInput.split(',').map((t) => t.trim()).filter(Boolean);
      onCreateCharacter({
        id: newId,
        name,
        title: title || 'Adventurer',
        role,
        status,
        bookIds: [bookId],
        description: description || 'New character in the series.',
        avatarUrl: `https://picsum.photos/seed/${newId}/200`,
        traits: traits.length > 0 ? traits : ['Mysterious'],
        magicAffinity,
        quote
      });
    } else if (mode === 'location') {
      onCreateLocation({
        id: newId,
        name,
        type: locType,
        region: region || 'Unknown Region',
        bookIds: [bookId],
        description: description || 'A legendary location.',
        imageUrl: `https://picsum.photos/seed/${newId}/600/400`,
        landmarks: ['Central Plaza'],
        dangerLevel
      });
    } else if (mode === 'faction') {
      onCreateFaction({
        id: newId,
        name,
        emblem: emblem || '⚔️',
        allegiance,
        description: description || 'A prominent organization.',
        motto: motto || 'By honor we lead.',
        influenceLevel: 'Regional'
      });
    } else if (mode === 'event') {
      onCreateTimelineEvent({
        id: newId,
        title: name,
        year,
        yearLabel: yearLabel || `Year ${year} TA`,
        era,
        bookId,
        eventType,
        characterIds: [],
        locationIds: [],
        summary: description || 'A significant historical event.',
        importance
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#09090b] border border-[#27272a] rounded shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] text-[#e4e4e7]">
        {/* Header */}
        <div className="p-3 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]">
          <div className="flex items-center gap-2 font-semibold text-white capitalize text-xs md:text-sm">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create New {mode}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#18181b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 overflow-y-auto space-y-3 text-xs">
          <div>
            <label className="font-medium text-[#a1a1aa] mb-1 block text-[11px]">
              {mode === 'event' ? 'Event Title' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Name`} *
            </label>
            <input
              type="text"
              required
              placeholder={`Enter ${mode} name...`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] p-2 rounded text-[#e4e4e7] focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* CHARACTER FIELDS */}
          {mode === 'character' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Archivist"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Narrative Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Character['role'])}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  >
                    <option value="Protagonist">Protagonist</option>
                    <option value="Antagonist">Antagonist</option>
                    <option value="Supporting">Supporting</option>
                    <option value="Historical Legend">Historical Legend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Magic Affinity</label>
                <input
                  type="text"
                  placeholder="e.g. Time Weaving & Aether Scribing"
                  value={magicAffinity}
                  onChange={(e) => setMagicAffinity(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Traits (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Intellectual, Cautious, Loyal"
                  value={traitsInput}
                  onChange={(e) => setTraitsInput(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                />
              </div>
            </>
          )}

          {/* LOCATION FIELDS */}
          {mode === 'location' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Region</label>
                <input
                  type="text"
                  placeholder="e.g. Northern Frostlands"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Danger Level</label>
                <select
                  value={dangerLevel}
                  onChange={(e) => setDangerLevel(e.target.value as Location['dangerLevel'])}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                >
                  <option value="Safe">Safe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Perilous">Perilous</option>
                  <option value="Forbidden">Forbidden</option>
                </select>
              </div>
            </div>
          )}

          {/* FACTION FIELDS */}
          {mode === 'faction' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Motto</label>
                <input
                  type="text"
                  placeholder="e.g. By Light We Prevail"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">Emblem Icon</label>
                <input
                  type="text"
                  placeholder="⚔️"
                  value={emblem}
                  onChange={(e) => setEmblem(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                />
              </div>
            </div>
          )}

          {/* TIMELINE EVENT FIELDS */}
          {mode === 'event' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Numerical Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Year Label</label>
                  <input
                    type="text"
                    value={yearLabel}
                    onChange={(e) => setYearLabel(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Era</label>
                  <select
                    value={era}
                    onChange={(e) => setEra(e.target.value as TimelineEvent['era'])}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  >
                    <option value="Age of Dawn">Age of Dawn</option>
                    <option value="The Shattered Crown">The Shattered Crown</option>
                    <option value="Age of Ashes">Age of Ashes</option>
                    <option value="The Convergence">The Convergence</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#71717a] text-[10px] uppercase">Importance</label>
                  <select
                    value={importance}
                    onChange={(e) => setImportance(e.target.value as TimelineEvent['importance'])}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  >
                    <option value="World-Changing">World-Changing</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="font-semibold text-[#71717a] text-[10px] uppercase">Description / Lore Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] p-2 rounded text-[#e4e4e7] focus:outline-none focus:border-indigo-500 mt-1"
              placeholder={`Write backstory or summary for this ${mode}...`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] rounded text-xs font-medium border border-[#27272a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs"
            >
              Save {mode}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
