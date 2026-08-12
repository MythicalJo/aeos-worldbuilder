import React, { useState } from 'react';
import {
  Character,
  Location,
  Faction,
  TimelineEvent,
  MarkdownDoc,
  WorldSettings,
  Book
} from '../types';

import { CenterCanvas } from './CenterCanvas';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { SettingsView } from './SettingsView';
import { MasterMatrixView } from './MasterMatrixView';
import { useLoreContext } from '../context/LoreContext';

import {
  FileText,
  Users,
  Clock,
  Settings,
  Plus,
  Search,
  Sparkles,
  Shield,
  MapPin,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ResponsiveShellProps {
  settings: WorldSettings;
  books: Book[];
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  timeline: TimelineEvent[];
  docs: MarkdownDoc[];
  selectedBookId: string;
  activeDocId: string;
  openDocIds: string[];
  onSelectDoc: (id: string) => void;
  onCloseDocTab: (id: string) => void;
  onNewDoc: () => void;
  onUpdateDoc: (doc: MarkdownDoc) => void;
  onSelectBookId: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEntity: (type: 'character' | 'location' | 'faction' | 'event') => void;
  onRefreshData: () => void;
  onOpenAIAssistant: () => void;
}

export const ResponsiveShell: React.FC<ResponsiveShellProps> = ({
  settings,
  books,
  characters,
  locations,
  factions,
  timeline,
  docs,
  selectedBookId,
  activeDocId,
  openDocIds,
  onSelectDoc,
  onCloseDocTab,
  onNewDoc,
  onUpdateDoc,
  onSelectBookId,
  onOpenEntityDetail,
  onCreateEntity,
  onRefreshData,
  onOpenAIAssistant
}) => {
  const {
    mobileTab,
    setMobileTab,
    mobileDbSubTab,
    setMobileDbSubTab,
    isMatrixViewOpen,
    setIsMatrixViewOpen
  } = useLoreContext();

  const dbSubTab = mobileDbSubTab;
  const setDbSubTab = setMobileDbSubTab;

  const [dbSearchTerm, setDbSearchTerm] = useState('');
  const [pcRightDbTab, setPcRightDbTab] = useState<'characters' | 'factions' | 'locations'>('characters');
  const [pcRightSearchTerm, setPcRightSearchTerm] = useState('');

  // Filtered lists for mobile Database view
  const mobileFilteredCharacters = characters.filter((c) => {
    const matchesBook = selectedBookId === 'all' || c.bookIds.includes(selectedBookId);
    const matchesSearch =
      c.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      c.traits.some((t) => t.toLowerCase().includes(dbSearchTerm.toLowerCase()));
    return matchesBook && matchesSearch;
  });

  const mobileFilteredFactions = factions.filter((f) => {
    return (
      f.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      f.allegiance.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      f.motto.toLowerCase().includes(dbSearchTerm.toLowerCase())
    );
  });

  const mobileFilteredLocations = locations.filter((l) => {
    const matchesBook = selectedBookId === 'all' || l.bookIds.includes(selectedBookId);
    const matchesSearch =
      l.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(dbSearchTerm.toLowerCase());
    return matchesBook && matchesSearch;
  });

  // Filtered lists for PC Right Panel Database Card View
  const pcFilteredCharacters = characters.filter((c) => {
    const matchesBook = selectedBookId === 'all' || c.bookIds.includes(selectedBookId);
    const matchesSearch =
      c.name.toLowerCase().includes(pcRightSearchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(pcRightSearchTerm.toLowerCase());
    return matchesBook && matchesSearch;
  });

  const pcFilteredFactions = factions.filter((f) => {
    return (
      f.name.toLowerCase().includes(pcRightSearchTerm.toLowerCase()) ||
      f.allegiance.toLowerCase().includes(pcRightSearchTerm.toLowerCase())
    );
  });

  const pcFilteredLocations = locations.filter((l) => {
    const matchesBook = selectedBookId === 'all' || l.bookIds.includes(selectedBookId);
    const matchesSearch =
      l.name.toLowerCase().includes(pcRightSearchTerm.toLowerCase()) ||
      l.region.toLowerCase().includes(pcRightSearchTerm.toLowerCase());
    return matchesBook && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-slate-950 text-slate-100">
      {/* ========================================================= */}
      {/* 1. MOBILE & TABLET LAYOUT (< lg screen width)             */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden lg:hidden pb-14">
        {/* TAB 1: EDITOR (100% screen width & height) */}
        {mobileTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full">
            <CenterCanvas
              docs={docs}
              activeDocId={activeDocId}
              openDocIds={openDocIds}
              characters={characters}
              locations={locations}
              factions={factions}
              onSelectDoc={onSelectDoc}
              onCloseDocTab={onCloseDocTab}
              onNewDoc={onNewDoc}
              onUpdateDoc={onUpdateDoc}
              onOpenEntityDetail={onOpenEntityDetail}
            />
          </div>
        )}

        {/* TAB 2: DATABASES (100% screen width with sub-menus for Characters / Factions / Locations) */}
        {mobileTab === 'databases' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full bg-slate-950 p-3 space-y-3 overflow-y-auto">
            {/* Sub-menu Tabs Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs flex-1">
                <button
                  onClick={() => setDbSubTab('characters')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'characters'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Characters</span>
                </button>

                <button
                  onClick={() => setDbSubTab('factions')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'factions'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Factions</span>
                </button>

                <button
                  onClick={() => setDbSubTab('locations')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'locations'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Locations</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (dbSubTab === 'characters') onCreateEntity('character');
                  else if (dbSubTab === 'factions') onCreateEntity('faction');
                  else if (dbSubTab === 'locations') onCreateEntity('location');
                }}
                className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 shadow"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Database Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder={`Search ${dbSubTab}...`}
                value={dbSearchTerm}
                onChange={(e) => setDbSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Sub-menu Content Grid */}
            <div className="space-y-2">
              {/* CHARACTERS SUB-VIEW */}
              {dbSubTab === 'characters' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mobileFilteredCharacters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onOpenEntityDetail('character', c.id)}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-start gap-3 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
                    >
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0 text-sm">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-100 truncate">{c.name}</h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              c.role === 'Protagonist'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {c.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.title}</p>
                        {c.magicAffinity && (
                          <p className="text-[10px] text-amber-400 truncate mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{c.magicAffinity}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FACTIONS SUB-VIEW */}
              {dbSubTab === 'factions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mobileFilteredFactions.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onOpenEntityDetail('faction', f.id)}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-center gap-3 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                        {f.emblem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-100 truncate">{f.name}</h4>
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {f.allegiance}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic truncate mt-0.5">"{f.motto}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LOCATIONS SUB-VIEW */}
              {dbSubTab === 'locations' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mobileFilteredLocations.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => onOpenEntityDetail('location', l.id)}
                      className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-start gap-3 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
                    >
                      {l.imageUrl ? (
                        <img
                          src={l.imageUrl}
                          alt={l.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-100 truncate">{l.name}</h4>
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {l.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{l.region}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE (100% screen width & height) */}
        {mobileTab === 'timeline' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full">
            <RightSidebar
              timelineEvents={timeline}
              characters={characters}
              locations={locations}
              books={books}
              selectedBookId={selectedBookId}
              onSelectBookId={onSelectBookId}
              onSelectDoc={onSelectDoc}
              onOpenEntityDetail={onOpenEntityDetail}
              onCreateEvent={() => onCreateEntity('event')}
              isOpen={true}
            />
          </div>
        )}

        {/* TAB 4: SETTINGS (100% screen width & height) */}
        {mobileTab === 'settings' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full">
            <SettingsView
              settings={settings}
              books={books}
              selectedBookId={selectedBookId}
              onSelectBookId={onSelectBookId}
              onRefreshData={onRefreshData}
              onOpenAIAssistant={onOpenAIAssistant}
            />
          </div>
        )}

        {/* CLEAN MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 left-0 right-0 h-14 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around z-40 px-2 shadow-2xl">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'editor' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Editor</span>
          </button>

          <button
            onClick={() => setMobileTab('databases')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'databases' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Databases</span>
          </button>

          <button
            onClick={() => setMobileTab('timeline')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'timeline' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('settings')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'settings' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Settings</span>
          </button>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* 2. PC / DESKTOP MULTI-PANE LAYOUT (lg:flex)              */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-1 min-h-0 relative overflow-hidden bg-slate-950">
        {/* FAR LEFT NAVIGATION COLUMN: permanent series bible outline & lore document browser */}
        <div className="w-64 xl:w-72 border-r border-slate-800 bg-slate-900/90 flex flex-col shrink-0 min-h-0">
          <LeftSidebar
            characters={characters}
            locations={locations}
            factions={factions}
            docs={docs}
            books={books}
            selectedBookId={selectedBookId}
            activeDocId={activeDocId}
            onSelectDoc={onSelectDoc}
            onOpenEntityDetail={onOpenEntityDetail}
            onCreateEntity={onCreateEntity}
            isOpen={true}
          />
        </div>

        {/* CENTER TEXT EDITOR CANVAS */}
        <div className="flex-1 min-w-0 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
          <CenterCanvas
            docs={docs}
            activeDocId={activeDocId}
            openDocIds={openDocIds}
            characters={characters}
            locations={locations}
            factions={factions}
            onSelectDoc={onSelectDoc}
            onCloseDocTab={onCloseDocTab}
            onNewDoc={onNewDoc}
            onUpdateDoc={onUpdateDoc}
            onOpenEntityDetail={onOpenEntityDetail}
          />
        </div>

        {/* RIGHT SPLIT CONTEXTUAL PANEL */}
        <div className="w-80 xl:w-96 border-l border-slate-800 bg-slate-900/80 flex flex-col shrink-0 min-h-0">
          {/* TOP HALF: Chronological Timeline Panel */}
          <div className="h-1/2 min-h-0 border-b border-slate-800 flex flex-col overflow-hidden">
            <RightSidebar
              timelineEvents={timeline}
              characters={characters}
              locations={locations}
              books={books}
              selectedBookId={selectedBookId}
              onSelectBookId={onSelectBookId}
              onSelectDoc={onSelectDoc}
              onOpenEntityDetail={onOpenEntityDetail}
              onCreateEvent={() => onCreateEntity('event')}
              isOpen={true}
            />
          </div>

          {/* BOTTOM HALF: Quick Database Card Views */}
          <div className="h-1/2 min-h-0 flex flex-col bg-slate-900 p-2.5 space-y-2 overflow-hidden">
            {/* Header & Sub-tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Quick Database Cards
              </span>

              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
                <button
                  onClick={() => setPcRightDbTab('characters')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    pcRightDbTab === 'characters'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  People
                </button>
                <button
                  onClick={() => setPcRightDbTab('factions')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    pcRightDbTab === 'factions'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Factions
                </button>
                <button
                  onClick={() => setPcRightDbTab('locations')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    pcRightDbTab === 'locations'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Places
                </button>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
              <input
                type="text"
                placeholder={`Quick search ${pcRightDbTab}...`}
                value={pcRightSearchTerm}
                onChange={(e) => setPcRightSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-[11px] pl-7 pr-2 py-1 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Scrollable Entity Cards List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {pcRightDbTab === 'characters' && (
                <>
                  {pcFilteredCharacters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onOpenEntityDetail('character', c.id)}
                      className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all group"
                    >
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-100 truncate group-hover:text-amber-400">
                          {c.name}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate">{c.title}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </div>
                  ))}
                </>
              )}

              {pcRightDbTab === 'factions' && (
                <>
                  {pcFilteredFactions.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onOpenEntityDetail('faction', f.id)}
                      className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all group"
                    >
                      <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-xs shrink-0">
                        {f.emblem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-100 truncate group-hover:text-amber-400">
                          {f.name}
                        </h5>
                        <p className="text-[10px] text-amber-400 truncate">{f.allegiance}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </div>
                  ))}
                </>
              )}

              {pcRightDbTab === 'locations' && (
                <>
                  {pcFilteredLocations.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => onOpenEntityDetail('location', l.id)}
                      className="p-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all group"
                    >
                      <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-amber-400 text-xs shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-100 truncate group-hover:text-amber-400">
                          {l.name}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate">{l.region}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PC-Only Master Matrix View Canvas */}
      {isMatrixViewOpen && (
        <MasterMatrixView
          books={books}
          characters={characters}
          factions={factions}
          locations={locations}
          timelineEvents={timeline}
          onClose={() => setIsMatrixViewOpen(false)}
          onSelectDoc={onSelectDoc}
        />
      )}
    </div>
  );
};
