import React, { useState, useRef } from 'react';
import { Character, Location, Faction, TimelineEvent, Book } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';

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
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // Common fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<Character['role']>('Supporting');
  const [status, setStatus] = useState<Character['status']>('Alive');
  const [description, setDescription] = useState('');
  const [magicAffinity, setMagicAffinity] = useState('');
  const [quote, setQuote] = useState('');
  const [traitsInput, setTraitsInput] = useState('Brave, Cautious');
  const [imageUrl, setImageUrl] = useState('');

  // Location specific
  const [locType, setLocType] = useState<Location['type']>('City');
  const [region, setRegion] = useState('Central Realm');
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

  useOutsideClick(modalRef, onClose, isOpen);

  if (!isOpen || !mode) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
        description: description || 'New character in the story.',
        avatarUrl: imageUrl || undefined,
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
        description: description || 'A key location in the realm.',
        imageUrl: imageUrl || undefined,
        landmarks: ['Central Plaza'],
        dangerLevel
      });
    } else if (mode === 'faction') {
      onCreateFaction({
        id: newId,
        name,
        emblem: emblem || '⚔️',
        allegiance,
        description: description || 'A prominent faction.',
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
        summary: description || 'A key event in the timeline.',
        importance
      });
    }

    onClose();
  };

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full max-w-lg ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className={`p-3.5 border-b ${headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2 font-bold text-sm capitalize">
            <Plus className={`w-4 h-4 ${accentColor}`} />
            <span>Create New {mode}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
          <div>
            <label className="font-bold block mb-1">
              {mode === 'event' ? 'Event Title' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Name`} *
            </label>
            <input
              type="text"
              required
              placeholder={`Enter ${mode} name...`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500 font-bold`}
            />
          </div>

          {/* IMAGE UPLOAD SECTION FOR CHARACTER AND LOCATION */}
          {(mode === 'character' || mode === 'location') && (
            <div className={`p-3 ${cardBg} border rounded-xl space-y-2`}>
              <label className="text-[10px] font-bold uppercase opacity-70 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                Image Settings
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-xs shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {imageUrl && (
                  <span className="text-[10px] font-bold text-emerald-500">Image Loaded!</span>
                )}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or enter Image URL"
                className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500 mt-1`}
              />
            </div>
          )}

          {/* CHARACTER FIELDS */}
          {mode === 'character' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Title / Honorific</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Scholar"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Narrative Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Character['role'])}
                    className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none`}
                  >
                    <option value="Protagonist">Protagonist</option>
                    <option value="Antagonist">Antagonist</option>
                    <option value="Supporting">Supporting</option>
                    <option value="Historical Legend">Historical Legend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Magic Affinity</label>
                <input
                  type="text"
                  placeholder="e.g. Glyph Weaving"
                  value={magicAffinity}
                  onChange={(e) => setMagicAffinity(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                />
              </div>
            </>
          )}

          {/* LOCATION FIELDS */}
          {mode === 'location' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold block mb-1">Region</label>
                <input
                  type="text"
                  placeholder="e.g. High Peaks"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Type</label>
                <input
                  type="text"
                  placeholder="e.g. Citadel, City, Ruins"
                  value={locType}
                  onChange={(e) => setLocType(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                />
              </div>
            </div>
          )}

          {/* FACTION FIELDS */}
          {mode === 'faction' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold block mb-1">Motto</label>
                <input
                  type="text"
                  placeholder="e.g. By Light We Prevail"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Emblem Icon</label>
                <input
                  type="text"
                  placeholder="⚔️"
                  value={emblem}
                  onChange={(e) => setEmblem(e.target.value)}
                  className={`w-full ${cardBg} border p-2 rounded-lg focus:outline-none focus:border-indigo-500`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold block mb-1">Description / Backstory</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full ${cardBg} border p-2 rounded-lg leading-relaxed focus:outline-none focus:border-indigo-500`}
              placeholder={`Write description for this ${mode}...`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 opacity-70 hover:opacity-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow"
            >
              Create {mode}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
