import React, { useState, useEffect, useRef } from 'react';
import { Character, Location, Faction, Book, MarkdownDoc } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import {
  X,
  User,
  MapPin,
  Shield,
  Edit2,
  Save,
  Sparkles,
  FileText,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

interface EntityDetailModalProps {
  type: 'character' | 'location' | 'faction' | null;
  entityId: string | null;
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  books: Book[];
  docs: MarkdownDoc[];
  onUpdateCharacter: (c: Character) => void;
  onUpdateLocation: (l: Location) => void;
  onUpdateFaction: (f: Faction) => void;
  onDeleteEntity: (type: 'character' | 'location' | 'faction', id: string) => void;
  onSelectDoc: (id: string) => void;
  onOpenCharacterNote?: (characterId: string) => void;
}

const FACTION_EMBLEM_PRESETS = ['⚔️', '✨', '🗡️', '🌿', '⚙️', '🛡️', '👑', '🦅', '🐉', '⚖️', '🔮', '📜', '⚓', '⚜️', '🐺'];

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  type,
  entityId,
  isOpen,
  onClose,
  characters,
  locations,
  factions,
  books,
  docs,
  onUpdateCharacter,
  onUpdateLocation,
  onUpdateFaction,
  onDeleteEntity,
  onSelectDoc,
  onOpenCharacterNote
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Character edit state
  const charObj = type === 'character' ? characters.find((c) => c.id === entityId) : null;
  const [charForm, setCharForm] = useState<Partial<Character>>({});

  // Location edit state
  const locObj = type === 'location' ? locations.find((l) => l.id === entityId) : null;
  const [locForm, setLocForm] = useState<Partial<Location>>({});

  // Faction edit state
  const facObj = type === 'faction' ? factions.find((f) => f.id === entityId) : null;
  const [facForm, setFacForm] = useState<Partial<Faction>>({});

  useOutsideClick(modalRef, onClose, isOpen);

  useEffect(() => {
    if (charObj) setCharForm({ ...charObj });
    if (locObj) setLocForm({ ...locObj });
    if (facObj) setFacForm({ ...facObj });
    setIsEditing(false);
  }, [entityId, type, charObj, locObj, facObj]);

  if (!isOpen || !type) return null;

  const handleSave = () => {
    if (type === 'character' && charObj && charForm.name) {
      onUpdateCharacter({ ...charObj, ...charForm } as Character);
    } else if (type === 'location' && locObj && locForm.name) {
      onUpdateLocation({ ...locObj, ...locForm } as Location);
    } else if (type === 'faction' && facObj && facForm.name) {
      onUpdateFaction({ ...facObj, ...facForm } as Faction);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      if (entityId) onDeleteEntity(type, entityId);
      onClose();
    }
  };

  // Image Upload Handler (Converts File to Base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetType: 'character' | 'location' | 'faction') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (targetType === 'character') {
        setCharForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
      } else if (targetType === 'location') {
        setLocForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      } else if (targetType === 'faction') {
        setFacForm((prev) => ({ ...prev, emblem: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
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
        className={`w-full max-w-xl ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Modal Header */}
        <div className={`p-3.5 border-b ${headerBg} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-2">
            {type === 'character' && <User className={`w-4 h-4 ${accentColor}`} />}
            {type === 'location' && <MapPin className="w-4 h-4 text-sky-500" />}
            {type === 'faction' && <Shield className={`w-4 h-4 ${accentColor}`} />}
            <span className="font-bold text-sm capitalize">
              {type} Profile
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-1 text-xs ${cardBg} border px-2.5 py-1 rounded-lg font-bold transition-all hover:border-indigo-500`}
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-lg transition-colors shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:text-rose-500 transition-colors"
              title="Delete Entity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* ========================================================= */}
          {/* 1. CHARACTER PROFILE & IMAGE MANAGEMENT                   */}
          {/* ========================================================= */}
          {type === 'character' && charObj && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative group shrink-0">
                  {charForm.avatarUrl ? (
                    <img
                      src={charForm.avatarUrl}
                      alt={charForm.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover border shadow-md"
                    />
                  ) : (
                    <div className={`w-20 h-20 rounded-xl ${cardBg} border flex items-center justify-center font-bold ${accentColor} text-xl shadow-md`}>
                      {charObj.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-[10px] font-bold uppercase opacity-60">Full Name</label>
                        <input
                          type="text"
                          value={charForm.name || ''}
                          onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                          className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500`}
                          placeholder="Character Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase opacity-60">Title / Honorific</label>
                          <input
                            type="text"
                            value={charForm.title || ''}
                            onChange={(e) => setCharForm({ ...charForm, title: e.target.value })}
                            className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500`}
                            placeholder="Title"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase opacity-60">Narrative Role</label>
                          <input
                            type="text"
                            value={charForm.role || ''}
                            onChange={(e) => setCharForm({ ...charForm, role: e.target.value })}
                            className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500`}
                            placeholder="e.g. Protagonist, Rival"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColor} ${cardBg} border px-2 py-0.5 rounded`}>
                        {charObj.role}
                      </span>
                      <h3 className="font-bold text-base truncate mt-1">{charObj.name}</h3>
                      <p className="text-xs opacity-70">{charObj.title}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Image Controls Section (When Editing) */}
              {isEditing && (
                <div className={`p-3 ${cardBg} border rounded-xl space-y-2`}>
                  <label className="text-[10px] font-bold uppercase opacity-70 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    Character Image Settings
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'character')}
                        className="hidden"
                      />
                    </label>

                    {charForm.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setCharForm({ ...charForm, avatarUrl: undefined })}
                        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 rounded-lg font-bold transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={charForm.avatarUrl || ''}
                    onChange={(e) => setCharForm({ ...charForm, avatarUrl: e.target.value })}
                    placeholder="Or enter Image URL (https://...)"
                    className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500 mt-1`}
                  />
                </div>
              )}

              {/* Character Details Form / Display */}
              <div>
                <label className="font-bold text-[10px] uppercase opacity-60">Biography & Overview</label>
                {isEditing ? (
                  <textarea
                    value={charForm.description || ''}
                    onChange={(e) => setCharForm({ ...charForm, description: e.target.value })}
                    rows={4}
                    className={`w-full ${cardBg} border p-2 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-indigo-500 mt-1`}
                  />
                ) : (
                  <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-xl border mt-1`}>
                    {charObj.description}
                  </p>
                )}
              </div>

              {/* Quote */}
              {charObj.quote && !isEditing && (
                <blockquote className={`border-l-2 border-indigo-500 pl-3 py-1.5 text-xs italic ${cardBg} rounded-r`}>
                  "{charObj.quote}"
                </blockquote>
              )}

              {/* Magic Affinity */}
              <div>
                <label className={`font-bold text-[10px] uppercase ${accentColor} flex items-center gap-1`}>
                  <Sparkles className="w-3 h-3" /> Magic Affinity
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={charForm.magicAffinity || ''}
                    onChange={(e) => setCharForm({ ...charForm, magicAffinity: e.target.value })}
                    className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs mt-1 focus:outline-none focus:border-indigo-500`}
                  />
                ) : (
                  <p className="font-semibold text-xs mt-1">{charObj.magicAffinity || 'None'}</p>
                )}
              </div>

              {/* Character Notes Opening Button */}
              {!isEditing && (
                <button
                  onClick={() => {
                    if (onOpenCharacterNote) {
                      onOpenCharacterNote(charObj.id);
                    } else if (charObj.markdownNoteId) {
                      onSelectDoc(charObj.markdownNoteId);
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Character Notes File</span>
                </button>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. LOCATION PROFILE & IMAGE MANAGEMENT                   */}
          {/* ========================================================= */}
          {type === 'location' && locObj && (
            <div className="space-y-4">
              {locForm.imageUrl ? (
                <img
                  src={locForm.imageUrl}
                  alt={locForm.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 rounded-xl object-cover border shadow-md"
                />
              ) : (
                <div className={`w-full h-32 rounded-xl ${cardBg} border flex items-center justify-center font-bold text-sky-500 shadow-md`}>
                  <MapPin className="w-8 h-8 opacity-60" />
                </div>
              )}

              {/* Image Controls */}
              {isEditing && (
                <div className={`p-3 ${cardBg} border rounded-xl space-y-2`}>
                  <label className="text-[10px] font-bold uppercase opacity-70 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                    Place Image Settings
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'location')}
                        className="hidden"
                      />
                    </label>
                    {locForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setLocForm({ ...locForm, imageUrl: undefined })}
                        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 rounded-lg font-bold transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={locForm.imageUrl || ''}
                    onChange={(e) => setLocForm({ ...locForm, imageUrl: e.target.value })}
                    placeholder="Or enter Image URL"
                    className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-sky-500 mt-1`}
                  />
                </div>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-60">Location Name</label>
                    <input
                      type="text"
                      value={locForm.name || ''}
                      onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                      className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-sky-500`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-60">Region / Realm</label>
                    <input
                      type="text"
                      value={locForm.region || ''}
                      onChange={(e) => setLocForm({ ...locForm, region: e.target.value })}
                      className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-sky-500`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold text-base text-sky-500">{locObj.name}</h3>
                  <p className="text-xs opacity-70">{locObj.region} • {locObj.type}</p>
                </div>
              )}

              <div>
                <label className="font-bold text-[10px] uppercase opacity-60">Atlas Description</label>
                {isEditing ? (
                  <textarea
                    value={locForm.description || ''}
                    onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                    rows={4}
                    className={`w-full ${cardBg} border p-2 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-sky-500 mt-1`}
                  />
                ) : (
                  <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-xl border mt-1`}>
                    {locObj.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. FACTION PROFILE & EDITABLE EMBLEM MANAGEMENT           */}
          {/* ========================================================= */}
          {type === 'faction' && facObj && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl ${cardBg} border flex items-center justify-center text-2xl shrink-0 shadow-md`}>
                  {facForm.emblem || '⚔️'}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={facForm.name || ''}
                      onChange={(e) => setFacForm({ ...facForm, name: e.target.value })}
                      className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500`}
                      placeholder="Faction Name"
                    />
                  ) : (
                    <>
                      <h3 className="font-bold text-base">{facObj.name}</h3>
                      <p className="text-xs opacity-70 italic">"{facObj.motto}"</p>
                    </>
                  )}
                </div>
              </div>

              {/* Faction Icon Editing Control */}
              {isEditing && (
                <div className={`p-3 ${cardBg} border rounded-xl space-y-2`}>
                  <label className="text-[10px] font-bold uppercase opacity-70 block">
                    Faction Emblem / Icon *
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={facForm.emblem || ''}
                      onChange={(e) => setFacForm({ ...facForm, emblem: e.target.value })}
                      placeholder="Custom Emblem (e.g. ⚔️)"
                      className={`w-24 ${cardBg} border p-1.5 rounded-lg text-center font-bold text-base focus:outline-none focus:border-indigo-500`}
                    />
                    <span className="text-[10px] opacity-60">Or pick from preset icon library:</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {FACTION_EMBLEM_PRESETS.map((iconSymbol) => (
                      <button
                        key={iconSymbol}
                        type="button"
                        onClick={() => setFacForm({ ...facForm, emblem: iconSymbol })}
                        className={`w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all ${
                          facForm.emblem === iconSymbol
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow scale-105'
                            : `${cardBg} opacity-80 hover:opacity-100 hover:border-indigo-500`
                        }`}
                      >
                        {iconSymbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isEditing && (
                <div>
                  <label className="text-[10px] font-bold uppercase opacity-60">Faction Motto</label>
                  <input
                    type="text"
                    value={facForm.motto || ''}
                    onChange={(e) => setFacForm({ ...facForm, motto: e.target.value })}
                    className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500 mt-1`}
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-[10px] uppercase opacity-60">Faction Description</label>
                {isEditing ? (
                  <textarea
                    value={facForm.description || ''}
                    onChange={(e) => setFacForm({ ...facForm, description: e.target.value })}
                    rows={4}
                    className={`w-full ${cardBg} border p-2 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-indigo-500 mt-1`}
                  />
                ) : (
                  <p className={`text-xs leading-relaxed ${cardBg} p-3 rounded-xl border mt-1`}>
                    {facObj.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
