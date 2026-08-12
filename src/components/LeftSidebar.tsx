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
  Sparkles,
  BookOpen,
  Filter,
  Layers
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
  const [activeTab, setActiveTab] = useState<'characters' | 'locations' | 'factions' | 'docs'>('characters');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter items by book and search term
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

  const filteredDocs = docs.filter((d) => {
    return (
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <aside className="w-64 md:w-72 bg-[#09090b] border-r border-[#27272a] flex flex-col h-full shrink-0 z-20 text-[#e4e4e7]">
      {/* Top Sidebar Header & Tabs */}
      <div className="p-3 border-b border-[#27272a] space-y-2.5 bg-[#09090b]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717a] flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Databases
          </span>

          {/* PC-Only Master Matrix View Toggle Button */}
          <button
            onClick={() => {
              if (onToggleMatrixView) onToggleMatrixView();
              else toggleMatrixView();
            }}
            className="hidden md:flex items-center gap-1 text-[10px] bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded transition-all font-semibold shadow-sm"
            title="Open Master Matrix Canvas (PC Only)"
          >
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Matrix</span>
          </button>

          <button
            onClick={() => {
              if (activeTab === 'characters') onCreateEntity('character');
              else if (activeTab === 'locations') onCreateEntity('location');
              else if (activeTab === 'factions') onCreateEntity('faction');
            }}
            className="flex items-center gap-1 text-xs bg-[#18181b] hover:bg-[#27272a] text-indigo-400 border border-[#27272a] px-2 py-0.5 rounded transition-colors shrink-0"
            title={`Add New ${activeTab.slice(0, -1)}`}
          >
            <Plus className="w-3 h-3" />
            <span className="capitalize">{activeTab.slice(0, -1)}</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
          <button
            onClick={() => setActiveTab('characters')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Characters"
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
            title="Locations & Map Atlas"
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
            title="Factions & Guilds"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Factions</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'docs'
                ? 'bg-[#09090b] text-indigo-400 shadow-sm border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Markdown Notes & Lore Documents"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[10px]">Notes</span>
          </button>
        </div>

        {/* Filter / Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#71717a]" />
          <input
            type="text"
            placeholder={`Filter ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] text-xs pl-8 pr-3 py-1.5 rounded text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Character Role Filter Pill Bar */}
        {activeTab === 'characters' && (
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] no-scrollbar">
            {['all', 'protagonist', 'antagonist', 'supporting', 'legend'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2 py-0.5 rounded capitalize font-medium whitespace-nowrap transition-colors ${
                  roleFilter === role
                    ? 'bg-[#18181b] text-indigo-400 border border-indigo-600'
                    : 'bg-[#18181b]/50 text-[#71717a] hover:text-[#e4e4e7]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* CHARACTERS LIST */}
        {activeTab === 'characters' && (
          <>
            {filteredCharacters.length === 0 ? (
              <div className="p-4 text-center text-[#71717a] text-xs">
                No characters found matching search.
              </div>
            ) : (
              filteredCharacters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenEntityDetail('character', c.id)}
                  className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded transition-all cursor-pointer relative"
                >
                  <div className="flex items-start gap-2">
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded object-cover shrink-0 border border-[#27272a]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-semibold text-xs text-white truncate group-hover:text-indigo-400">
                          {c.name}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            c.role === 'Protagonist'
                              ? 'bg-indigo-950/60 text-indigo-400 border-indigo-500/30'
                              : c.role === 'Antagonist'
                              ? 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                              : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
                          }`}
                        >
                          {c.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] truncate leading-tight mt-0.5">
                        {c.title}
                      </p>
                      {c.magicAffinity && (
                        <p className="text-[10px] text-indigo-400 truncate mt-0.5 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 shrink-0 text-indigo-400" />
                          <span>{c.magicAffinity}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {c.markdownNoteId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDoc(c.markdownNoteId!);
                      }}
                      className="mt-1.5 w-full py-0.5 px-2 bg-[#18181b] hover:bg-indigo-600/20 text-[#a1a1aa] hover:text-indigo-300 rounded border border-[#27272a] text-[10px] flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>Open Lore Note</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#71717a]" />
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* LOCATIONS LIST */}
        {activeTab === 'locations' && (
          <>
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-[#71717a] text-xs">
                No locations found matching search.
              </div>
            ) : (
              filteredLocations.map((l) => (
                <div
                  key={l.id}
                  onClick={() => onOpenEntityDetail('location', l.id)}
                  className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    {l.imageUrl ? (
                      <img
                        src={l.imageUrl}
                        alt={l.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-8 rounded object-cover shrink-0 border border-[#27272a]"
                      />
                    ) : (
                      <div className="w-10 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-indigo-400 font-bold shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-semibold text-xs text-white truncate group-hover:text-indigo-400">
                          {l.name}
                        </h4>
                        <span className="text-[9px] bg-[#18181b] text-[#a1a1aa] px-1.5 py-0.2 rounded border border-[#27272a]">
                          {l.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] truncate mt-0.5">
                        {l.region}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* FACTIONS LIST */}
        {activeTab === 'factions' && (
          <>
            {filteredFactions.map((f) => (
              <div
                key={f.id}
                onClick={() => onOpenEntityDetail('faction', f.id)}
                className="group p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-sm shrink-0">
                    {f.emblem}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-white truncate group-hover:text-indigo-400">
                        {f.name}
                      </h4>
                      <span className="text-[9px] bg-[#18181b] text-amber-500 font-mono px-1.5 py-0.2 rounded border border-[#27272a]">
                        {f.allegiance}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#71717a] italic truncate mt-0.5">
                      "{f.motto}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* MARKDOWN DOCS QUICK SWITCHER */}
        {activeTab === 'docs' && (
          <>
            {filteredDocs.map((d) => (
              <div
                key={d.id}
                onClick={() => onSelectDoc(d.id)}
                className={`p-2 rounded border transition-all cursor-pointer flex items-start gap-2 ${
                  activeDocId === d.id
                    ? 'bg-[#18181b] border-l-2 border-indigo-600 border-[#27272a] text-white shadow-sm'
                    : 'bg-[#09090b] hover:bg-[#18181b] border-[#27272a] text-[#a1a1aa]'
                }`}
              >
                <FileText
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    activeDocId === d.id ? 'text-indigo-400' : 'text-[#71717a]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs truncate">{d.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-[#71717a]">
                    <span className="bg-[#18181b] px-1.5 py-0.2 rounded border border-[#27272a]">
                      {d.category}
                    </span>
                    <span>{d.wordCount} words</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
