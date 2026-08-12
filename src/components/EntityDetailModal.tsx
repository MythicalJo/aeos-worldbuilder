import React, { useState, useEffect } from 'react';
import { Character, Location, Faction, Book, MarkdownDoc } from '../types';
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
  Plus
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
}

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
  onSelectDoc
}) => {
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

  useEffect(() => {
    if (charObj) setCharForm({ ...charObj });
    if (locObj) setLocForm({ ...locObj });
    if (facObj) setFacForm({ ...facObj });
    setIsEditing(false);
  }, [entityId, type]);

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
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (entityId) onDeleteEntity(type, entityId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#09090b] border border-[#27272a] rounded shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] text-[#e4e4e7]">
        {/* Modal Header */}
        <div className="p-3 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]">
          <div className="flex items-center gap-2">
            {type === 'character' && <User className="w-4 h-4 text-indigo-400" />}
            {type === 'location' && <MapPin className="w-4 h-4 text-sky-400" />}
            {type === 'faction' && <Shield className="w-4 h-4 text-emerald-400" />}
            <span className="font-semibold text-xs md:text-sm capitalize text-white">
              {type} Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] px-2.5 py-1 rounded border border-[#27272a] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-2.5 py-1 rounded transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}

            <button
              onClick={handleDelete}
              className="p-1 rounded text-[#71717a] hover:text-rose-400 hover:bg-[#18181b]"
              title="Delete Entity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#18181b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 overflow-y-auto space-y-3 text-xs">
          {/* CHARACTER EDIT / VIEW */}
          {type === 'character' && charObj && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={charForm.avatarUrl || 'https://picsum.photos/seed/character/200'}
                  alt={charForm.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded object-cover border border-[#27272a] shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={charForm.name || ''}
                        onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                        className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs font-semibold text-white"
                        placeholder="Character Name"
                      />
                      <input
                        type="text"
                        value={charForm.title || ''}
                        onChange={(e) => setCharForm({ ...charForm, title: e.target.value })}
                        className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs text-[#e4e4e7]"
                        placeholder="Title / Honorific"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-sm text-white">{charObj.name}</h3>
                      <p className="text-[#a1a1aa] font-medium text-xs">{charObj.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#18181b] text-indigo-400 border border-[#27272a] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          {charObj.role}
                        </span>
                        <span className="bg-[#18181b] text-[#a1a1aa] px-1.5 py-0.5 rounded text-[10px]">
                          {charObj.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">
                  Biography & Lore
                </label>
                {isEditing ? (
                  <textarea
                    value={charForm.description || ''}
                    onChange={(e) => setCharForm({ ...charForm, description: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] p-2 rounded text-xs h-24 mt-1 text-[#e4e4e7]"
                  />
                ) : (
                  <p className="text-[#e4e4e7] leading-relaxed mt-1 bg-[#18181b] p-2.5 rounded border border-[#27272a]">
                    {charObj.description}
                  </p>
                )}
              </div>

              {/* Quote */}
              {charObj.quote && (
                <div className="italic text-[#e4e4e7] bg-[#18181b] border-l-2 border-indigo-500 p-2 rounded-r text-xs">
                  "{charObj.quote}"
                </div>
              )}

              {/* Magic Affinity */}
              <div>
                <label className="font-semibold text-indigo-400 text-[10px] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Magic Affinity
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={charForm.magicAffinity || ''}
                    onChange={(e) => setCharForm({ ...charForm, magicAffinity: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs mt-1 text-[#e4e4e7]"
                  />
                ) : (
                  <p className="text-[#e4e4e7] font-medium mt-1">{charObj.magicAffinity || 'None'}</p>
                )}
              </div>

              {/* Associated Note Link */}
              {charObj.markdownNoteId && (
                <button
                  onClick={() => {
                    onSelectDoc(charObj.markdownNoteId!);
                    onClose();
                  }}
                  className="w-full py-1.5 bg-[#18181b] hover:bg-[#27272a] text-indigo-400 border border-[#27272a] rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Character Profile Note</span>
                </button>
              )}
            </div>
          )}

          {/* LOCATION EDIT / VIEW */}
          {type === 'location' && locObj && (
            <div className="space-y-3">
              <img
                src={locForm.imageUrl || 'https://picsum.photos/seed/location/600/300'}
                alt={locForm.name}
                referrerPolicy="no-referrer"
                className="w-full h-32 rounded object-cover border border-[#27272a]"
              />

              {isEditing ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={locForm.name || ''}
                    onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs font-semibold text-white"
                    placeholder="Location Name"
                  />
                  <input
                    type="text"
                    value={locForm.region || ''}
                    onChange={(e) => setLocForm({ ...locForm, region: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] p-1.5 rounded text-xs text-[#e4e4e7]"
                    placeholder="Region"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-sm text-sky-400">{locObj.name}</h3>
                  <p className="text-[#a1a1aa] text-xs">{locObj.region} • {locObj.type}</p>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#71717a] text-[10px] uppercase">
                  Atlas Description
                </label>
                {isEditing ? (
                  <textarea
                    value={locForm.description || ''}
                    onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] p-2 rounded text-xs h-24 mt-1 text-[#e4e4e7]"
                  />
                ) : (
                  <p className="text-[#e4e4e7] leading-relaxed mt-1 bg-[#18181b] p-2.5 rounded border border-[#27272a]">
                    {locObj.description}
                  </p>
                )}
              </div>

              {locObj.markdownNoteId && (
                <button
                  onClick={() => {
                    onSelectDoc(locObj.markdownNoteId!);
                    onClose();
                  }}
                  className="w-full py-1.5 bg-[#18181b] hover:bg-[#27272a] text-sky-400 border border-[#27272a] rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Location Atlas Note</span>
                </button>
              )}
            </div>
          )}

          {/* FACTION EDIT / VIEW */}
          {type === 'faction' && facObj && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-xl shrink-0">
                  {facObj.emblem}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-emerald-400">{facObj.name}</h3>
                  <p className="text-[#a1a1aa] italic text-xs">"{facObj.motto}"</p>
                </div>
              </div>

              <p className="text-[#e4e4e7] leading-relaxed bg-[#18181b] p-2.5 rounded border border-[#27272a]">
                {facObj.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
