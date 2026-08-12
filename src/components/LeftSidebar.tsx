import React, { useState } from 'react';
import { Character, Location, Faction, MarkdownDoc, Book } from '../types';
import { useLoreContext } from '../context/LoreContext';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
  const { toggleMatrixView } = useLoreContext();
  const [activeTab, setActiveTab] = useState<'docs' | 'characters' | 'locations' | 'factions'>('docs');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

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
    return matchesBook && matchesSearch;
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

  const activeCardBg = isSepia
    ? 'bg-[#fbf0d9] border-[#cbb080] font-bold shadow-sm'
    : isLight
    ? 'bg-[#ffffff] border-indigo-500 font-bold shadow-sm'
    : 'bg-[#18181b] border-indigo-500 font-bold shadow-sm';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <aside className={`w-64 md:w-72 ${sidebarBg} border-r flex flex-col h-full shrink-0 z-20 select-none`}>
      {/* Sidebar Header */}
      <div className={`p-3 border-b space-y-2.5 ${sidebarBg}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-1.5 shrink-0">
            <Feather className={`w-3.5 h-3.5 ${accentColor}`} />
            Manuscript & Worldbuilder
          </span>

          <button
            onClick={() => {
              if (onToggleMatrixView) onToggleMatrixView();
              else toggleMatrixView();
            }}
            className={`hidden md:flex items-center gap-1 text-[10px] ${cardBg} border px-2 py-0.5 rounded transition-all font-semibold shadow-sm`}
            title="Open Worldbuilder Matrix Canvas (PC Only)"
          >
            <Layers className={`w-3 h-3 ${accentColor}`} />
            <span>Matrix</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`grid grid-cols-4 ${cardBg} p-0.5 rounded border text-xs`}>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'docs' ? `${activeCardBg} ${accentColor}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Manuscript Chapters & Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Chapters</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'characters' ? `${activeCardBg} ${accentColor}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Worldbuilder Characters"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px]">People</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'locations' ? `${activeCardBg} ${accentColor}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Worldbuilder Places & Settings"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px]">Places</span>
          </button>

          <button
            onClick={() => setActiveTab('factions')}
            className={`py-1 px-1 rounded flex flex-col items-center gap-0.5 font-medium transition-all ${
              activeTab === 'factions' ? `${activeCardBg} ${accentColor}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Worldbuilder Factions & Groups"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Factions</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'docs' ? 'chapters' : activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${cardBg} border text-xs pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-indigo-500`}
          />
        </div>
      </div>

      {/* Tab Content List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* MANUSCRIPT CHAPTERS */}
        {activeTab === 'docs' && (
          <>
            {filteredDocs.map((d) => (
              <div
                key={d.id}
                onClick={() => onSelectDoc(d.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                  activeDocId === d.id
                    ? `${activeCardBg} border-l-4 border-l-indigo-500`
                    : `${cardBg} opacity-80 hover:opacity-100`
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${activeDocId === d.id ? accentColor : 'opacity-60'}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs truncate">{d.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px] opacity-70">
                    <span className={`${cardBg} px-1.5 py-0.2 rounded border truncate max-w-[90px]`}>
                      {d.category}
                    </span>
                    <span>{d.wordCount || 0} words</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* WORLDBUILDER CHARACTERS */}
        {activeTab === 'characters' && (
          <>
            {filteredCharacters.map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenEntityDetail('character', c.id)}
                className={`group p-2 ${cardBg} border rounded-lg transition-all cursor-pointer hover:border-indigo-500/50`}
              >
                <div className="flex items-center gap-2">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded object-cover shrink-0 border"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded ${cardBg} border flex items-center justify-center ${accentColor} font-bold shrink-0 text-xs`}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs truncate group-hover:text-indigo-500">
                      {c.name}
                    </h4>
                    <p className="text-[10px] opacity-70 truncate">{c.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* WORLDBUILDER LOCATIONS */}
        {activeTab === 'locations' && (
          <>
            {filteredLocations.map((l) => (
              <div
                key={l.id}
                onClick={() => onOpenEntityDetail('location', l.id)}
                className={`group p-2 ${cardBg} border rounded-lg transition-all cursor-pointer flex items-center gap-2 hover:border-sky-500/50`}
              >
                <div className={`w-7 h-7 rounded ${cardBg} border flex items-center justify-center text-sky-500 shrink-0`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs truncate group-hover:text-sky-500">
                    {l.name}
                  </h4>
                  <p className="text-[10px] opacity-70 truncate">{l.region}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* WORLDBUILDER FACTIONS */}
        {activeTab === 'factions' && (
          <>
            {filteredFactions.map((f) => (
              <div
                key={f.id}
                onClick={() => onOpenEntityDetail('faction', f.id)}
                className={`group p-2 ${cardBg} border rounded-lg transition-all cursor-pointer flex items-center gap-2 hover:border-indigo-500/50`}
              >
                <div className={`w-7 h-7 rounded ${cardBg} border flex items-center justify-center text-xs shrink-0`}>
                  {f.emblem}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs truncate group-hover:text-indigo-500">
                    {f.name}
                  </h4>
                  <p className="text-[10px] opacity-70 truncate font-mono">{f.allegiance}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
