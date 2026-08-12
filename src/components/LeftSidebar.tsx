import React, { useState } from 'react';
import { Character, Location, Faction, MarkdownDoc, Book } from '../types';
import { useLoreContext } from '../context/LoreContext';
import {
  Users,
  MapPin,
  Shield,
  FileText,
  Search,
  Plus,
  ChevronRight,
  BookOpen,
  Layers,
  Feather
} from 'lucide-react';

interface LeftSidebarProps {
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  docs: MarkdownDoc[];
  books: Book[];
  selectedBookId: string;
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEntity: (type: 'character' | 'location' | 'faction') => void;
  isOpen: boolean;
  onToggleMatrixView?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  characters,
  locations,
  factions,
  docs,
  books,
  selectedBookId,
  activeDocId,
  onSelectDoc,
  onOpenEntityDetail,
  onCreateEntity,
  isOpen,
  onToggleMatrixView
}) => {
  const { toggleMatrixView } = useLoreContext();
  const [activeTab, setActiveTab] = useState<'docs' | 'characters' | 'locations' | 'factions'>('docs');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter items
  const filteredDocs = docs.filter((d) => {
    return (
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredCharacters = characters.filter((c) => {
    const matchesBook = selectedBookId === 'all' || c.bookIds.includes(selectedBookId);
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.traits.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || c.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesBook && matchesSearch && matchesRole;
  });

  const filteredLocations = locations.filter((l) => {
    const matchesBook = selectedBookId === 'all' || l.bookIds.includes(selectedBookId);
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBook && matchesSearch;
  });

  const filteredFactions = factions.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.allegiance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.motto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <aside className="w-64 md:w-72 bg-[#09090b] border-r border-[#27272a] flex flex-col h-full shrink-0 z-20 text-[#e4e4e7] select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-[#27272a] space-y-2.5 bg-[#09090b]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717a] flex items-center gap-1.5 shrink-0">
            <Feather className="w-3.5 h-3.5 text-indigo-400" />
            Manuscript & Reference
          </span>

          <button
            onClick={() => {
              if (onToggleMatrixView) onToggleMatrixView();
              else toggleMatrixView();
            }}
            className="hidden md:flex items-center gap-1 text-[10px] bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded transition-all font-semibold shadow-sm"
            title="Open Relationship Matrix Canvas (PC Only)"
          >
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Matrix</span>
          </button>
        </div>

        {/* Tab Selection: Manuscript Chapters First */}
        <div className="grid grid-cols-4 bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'docs'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Manuscript Chapters & Writing Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Chapters</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Characters Story Bible"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px]">People</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Locations & Setting Atlas"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px]">Places</span>
          </button>

          <button
            onClick={() => setActiveTab('factions')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'factions'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Factions & Groups"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Factions</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#71717a]" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'docs' ? 'chapters' : activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] text-xs pl-8 pr-3 py-1.5 rounded text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tab Content List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* MANUSCRIPT CHAPTERS LIST */}
        {activeTab === 'docs' && (
          <>
            {filteredDocs.map((d) => (
              <div
                key={d.id}
                onClick={() => onSelectDoc(d.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                  activeDocId === d.id
                    ? 'bg-[#18181b] border-l-4 border-l-indigo-500 border-[#27272a] text-white shadow-sm font-medium'
                    : 'bg-[#09090b] hover:bg-[#18181b] border-[#27272a] text-[#a1a1aa]'
                }`}
              >
                <FileText
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    activeDocId === d.id ? 'text-indigo-400' : 'text-[#71717a]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate">{d.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-[#71717a]">
                    <span className="bg-[#18181b] px-1.5 py-0.2 rounded border border-[#27272a] truncate max-w-[90px]">
                      {d.category}
                    </span>
                    <span>{d.wordCount || 0} words</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* CHARACTERS STORY BIBLE LIST */}
        {activeTab === 'characters' && (
          <>
            {filteredCharacters.map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenEntityDetail('character', c.id)}
                className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded object-cover shrink-0 border border-[#27272a]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-amber-400 font-bold shrink-0 text-xs">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-white truncate group-hover:text-amber-400">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-[#a1a1aa] truncate">{c.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* LOCATIONS LIST */}
        {activeTab === 'locations' && (
          <>
            {filteredLocations.map((l) => (
              <div
                key={l.id}
                onClick={() => onOpenEntityDetail('location', l.id)}
                className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-sky-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate group-hover:text-sky-400">
                    {l.name}
                  </h4>
                  <p className="text-[10px] text-[#a1a1aa] truncate">{l.region}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* FACTIONS LIST */}
        {activeTab === 'factions' && (
          <>
            {filteredFactions.map((f) => (
              <div
                key={f.id}
                onClick={() => onOpenEntityDetail('faction', f.id)}
                className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-xs shrink-0">
                  {f.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate group-hover:text-indigo-400">
                    {f.name}
                  </h4>
                  <p className="text-[10px] text-amber-500 font-mono truncate">{f.allegiance}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
