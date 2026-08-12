import React, { useState } from 'react';
import { Character, Location, Faction, MarkdownDoc, Book, CustomCategory, CustomEntry } from '../types';
import { useLoreContext } from '../context/LoreContext';
import { useTheme } from '../context/ThemeContext';
import { PRELOADED_ICONS } from './CreateCategoryModal';
import {
  Users,
  MapPin,
  Shield,
  FileText,
  Search,
  Plus,
  Layers,
  Feather,
  Trash2,
  Gem,
  Sparkles
} from 'lucide-react';

interface LeftSidebarProps {
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  customCategories?: CustomCategory[];
  customEntries?: CustomEntry[];
  docs: MarkdownDoc[];
  books: Book[];
  selectedBookId: string;
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onNewDoc: () => void;
  onDeleteDoc?: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction' | 'custom', id: string) => void;
  onCreateEntity: (type: 'character' | 'location' | 'faction' | 'category' | string) => void;
  onDeleteCustomCategory?: (categoryId: string) => void;
  onDeleteCustomEntry?: (entryId: string) => void;
  isOpen: boolean;
  onToggleMatrixView?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  characters,
  locations,
  factions,
  customCategories = [],
  customEntries = [],
  docs,
  books,
  selectedBookId,
  activeDocId,
  onSelectDoc,
  onNewDoc,
  onDeleteDoc,
  onOpenEntityDetail,
  onCreateEntity,
  onDeleteCustomCategory,
  onDeleteCustomEntry,
  isOpen,
  onToggleMatrixView
}) => {
  const { theme, getAccentClasses } = useTheme();
  const accentClasses = getAccentClasses();
  const { toggleMatrixView } = useLoreContext();
  const [activeTab, setActiveTab] = useState<string>('docs');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  // Filter docs to active project & active book
  const filteredDocs = docs.filter((d) => {
    const matchesProject = !d.bookId || d.bookId === selectedBookId || selectedBookId === 'all';
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesProject && matchesSearch;
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

  const getCustomCategoryEntries = (catId: string) => {
    return customEntries.filter(
      (e) => e.categoryId === catId && (e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const renderIcon = (iconName: string) => {
    const found = PRELOADED_ICONS.find((item) => item.name === iconName);
    const IconComp = found ? found.icon : Gem;
    return <IconComp className="w-3.5 h-3.5" />;
  };

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

  const currentCustomCat = customCategories.find((c) => c.id === activeTab);

  const activeTabDisplayName =
    activeTab === 'docs'
      ? 'chapters'
      : activeTab === 'characters'
      ? 'people'
      : activeTab === 'locations'
      ? 'places'
      : activeTab === 'factions'
      ? 'factions'
      : currentCustomCat?.name || 'entries';

  return (
    <aside className={`w-64 md:w-72 ${sidebarBg} border-r flex flex-col h-full shrink-0 z-20 select-none`}>
      {/* Sidebar Header */}
      <div className={`p-3 border-b space-y-2.5 ${sidebarBg}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-1.5 shrink-0">
            <Feather className={`w-3.5 h-3.5 ${accentClasses.text}`} />
            Books & Worldbuilder
          </span>

          <button
            onClick={() => {
              if (onToggleMatrixView) onToggleMatrixView();
              else toggleMatrixView();
            }}
            className={`hidden md:flex items-center gap-1 text-[10px] ${cardBg} border px-2 py-0.5 rounded transition-all font-semibold shadow-sm`}
            title="Open Worldbuilder Matrix Canvas"
          >
            <Layers className={`w-3 h-3 ${accentClasses.text}`} />
            <span>Matrix</span>
          </button>
        </div>

        {/* Tab Selection Row (Chapters | People | Places | Factions | Custom Categories | +) */}
        <div className={`flex items-center gap-1 ${cardBg} p-1 rounded-xl border text-xs overflow-x-auto no-scrollbar`}>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 font-bold transition-all shrink-0 ${
              activeTab === 'docs' ? `${activeCardBg} ${accentClasses.text}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Chapters"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[10px]">Chapters</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 font-bold transition-all shrink-0 ${
              activeTab === 'characters' ? `${activeCardBg} ${accentClasses.text}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Characters"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px]">People</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 font-bold transition-all shrink-0 ${
              activeTab === 'locations' ? `${activeCardBg} ${accentClasses.text}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Places"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px]">Places</span>
          </button>

          <button
            onClick={() => setActiveTab('factions')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 font-bold transition-all shrink-0 ${
              activeTab === 'factions' ? `${activeCardBg} ${accentClasses.text}` : 'opacity-60 hover:opacity-100'
            }`}
            title="Factions"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Factions</span>
          </button>

          {/* Dynamic Custom Categories */}
          {customCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`py-1 px-2.5 rounded-lg flex items-center gap-1 font-bold transition-all shrink-0 ${
                activeTab === cat.id ? `${activeCardBg} ${accentClasses.text}` : 'opacity-60 hover:opacity-100'
              }`}
              title={cat.name}
            >
              {renderIcon(cat.iconName)}
              <span className="text-[10px]">{cat.name}</span>
            </button>
          ))}

          {/* Integrated + Create Category Button inside Category Bar */}
          <button
            onClick={() => onCreateEntity('category')}
            className={`py-1 px-2 rounded-lg font-bold transition-all shrink-0 border bg-indigo-600/10 border-indigo-500/30 ${accentClasses.text} hover:bg-indigo-600 hover:text-white`}
            title="Create Custom Worldbuilder Category"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60" />
          <input
            type="text"
            placeholder={`Search ${activeTabDisplayName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${cardBg} border text-xs pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500`}
          />
        </div>
      </div>

      {/* Tab Header Action Bar */}
      <div className={`px-3 py-2 border-b flex items-center justify-between text-xs font-bold ${sidebarBg}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] uppercase tracking-wider opacity-60 truncate">
            {activeTab === 'docs'
              ? `Chapters (${filteredDocs.length})`
              : activeTab === 'characters'
              ? `Characters (${filteredCharacters.length})`
              : activeTab === 'locations'
              ? `Places (${filteredLocations.length})`
              : activeTab === 'factions'
              ? `Factions (${filteredFactions.length})`
              : `${currentCustomCat?.name || 'Custom'} (${getCustomCategoryEntries(activeTab).length})`}
          </span>

          {/* Category Delete Action for Custom Category */}
          {currentCustomCat && onDeleteCustomCategory && (
            <button
              onClick={() => onDeleteCustomCategory(currentCustomCat.id)}
              className="p-0.5 rounded opacity-60 hover:opacity-100 hover:text-rose-500 transition-colors"
              title={`Delete Category "${currentCustomCat.name}"`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeTab === 'docs' && (
          <button
            onClick={onNewDoc}
            className={`flex items-center gap-1 text-[11px] ${accentClasses.bg} text-white px-2.5 py-0.5 rounded-lg transition-all shadow`}
          >
            <Plus className="w-3 h-3" />
            <span>Chapter</span>
          </button>
        )}
        {activeTab === 'characters' && (
          <button
            onClick={() => onCreateEntity('character')}
            className={`flex items-center gap-1 text-[11px] ${accentClasses.bg} text-white px-2.5 py-0.5 rounded-lg transition-all shadow`}
          >
            <Plus className="w-3 h-3" />
            <span>Person</span>
          </button>
        )}
        {activeTab === 'locations' && (
          <button
            onClick={() => onCreateEntity('location')}
            className={`flex items-center gap-1 text-[11px] ${accentClasses.bg} text-white px-2.5 py-0.5 rounded-lg transition-all shadow`}
          >
            <Plus className="w-3 h-3" />
            <span>Place</span>
          </button>
        )}
        {activeTab === 'factions' && (
          <button
            onClick={() => onCreateEntity('faction')}
            className={`flex items-center gap-1 text-[11px] ${accentClasses.bg} text-white px-2.5 py-0.5 rounded-lg transition-all shadow`}
          >
            <Plus className="w-3 h-3" />
            <span>Faction</span>
          </button>
        )}
        {activeTab.startsWith('cat-') && (
          <button
            onClick={() => onCreateEntity(activeTab)}
            className={`flex items-center gap-1 text-[11px] ${accentClasses.bg} text-white px-2.5 py-0.5 rounded-lg transition-all shadow`}
          >
            <Plus className="w-3 h-3" />
            <span>Entry</span>
          </button>
        )}
      </div>

      {/* Tab Content List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* CHAPTERS */}
        {activeTab === 'docs' && (
          <>
            {filteredDocs.length === 0 ? (
              <div className="p-4 text-center text-xs opacity-60">No chapters found. Click + Chapter to write!</div>
            ) : (
              filteredDocs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => onSelectDoc(d.id)}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    activeDocId === d.id
                      ? `${activeCardBg} border-l-4 border-l-indigo-500`
                      : `${cardBg} opacity-80 hover:opacity-100`
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${activeDocId === d.id ? accentClasses.text : 'opacity-60'}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs truncate">{d.title}</h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] opacity-70">
                        <span className={`${cardBg} border px-1.5 py-0.2 rounded truncate max-w-[90px]`}>
                          {d.category}
                        </span>
                        <span>{d.wordCount || 0} words</span>
                      </div>
                    </div>
                  </div>

                  {onDeleteDoc && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDoc(d.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* CHARACTERS */}
        {activeTab === 'characters' && (
          <>
            {filteredCharacters.length === 0 ? (
              <div className="p-4 text-center text-xs opacity-60">No characters found. Click + Person to create!</div>
            ) : (
              filteredCharacters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenEntityDetail('character', c.id)}
                  className={`group p-2 ${cardBg} border rounded-xl transition-all cursor-pointer hover:border-indigo-500/50`}
                >
                  <div className="flex items-center gap-2">
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg ${cardBg} border flex items-center justify-center ${accentClasses.text} font-bold shrink-0 text-xs`}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs truncate group-hover:text-indigo-500">
                        {c.name}
                      </h4>
                      <p className="text-[10px] opacity-70 truncate">{c.title || c.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* LOCATIONS */}
        {activeTab === 'locations' && (
          <>
            {filteredLocations.map((l) => (
              <div
                key={l.id}
                onClick={() => onOpenEntityDetail('location', l.id)}
                className={`group p-2 ${cardBg} border rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:border-sky-500/50`}
              >
                <div className={`w-7 h-7 rounded-lg ${cardBg} border flex items-center justify-center text-sky-500 shrink-0`}>
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

        {/* FACTIONS */}
        {activeTab === 'factions' && (
          <>
            {filteredFactions.map((f) => (
              <div
                key={f.id}
                onClick={() => onOpenEntityDetail('faction', f.id)}
                className={`group p-2 ${cardBg} border rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:border-indigo-500/50`}
              >
                <div className={`w-7 h-7 rounded-lg ${cardBg} border flex items-center justify-center text-xs shrink-0`}>
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

        {/* CUSTOM CATEGORY ENTRIES */}
        {activeTab.startsWith('cat-') && (
          <>
            {getCustomCategoryEntries(activeTab).map((entry) => (
              <div
                key={entry.id}
                onClick={() => onOpenEntityDetail('custom', entry.id)}
                className={`group p-2.5 ${cardBg} border rounded-xl transition-all cursor-pointer flex items-start justify-between gap-2 hover:border-amber-500/50`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs truncate group-hover:text-amber-500">{entry.title}</h4>
                  <p className="text-[10px] opacity-70 line-clamp-2 mt-0.5">{entry.description}</p>
                </div>

                {onDeleteCustomEntry && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomEntry(entry.id);
                    }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
