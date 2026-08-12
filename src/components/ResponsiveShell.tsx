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
  Shield,
  MapPin,
  ChevronRight
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
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  onSelectDoc: (id: string) => void;
  onCloseDocTab: (id: string) => void;
  onNewDoc: () => void;
  onUpdateDoc: (doc: MarkdownDoc) => void;
  onSelectBookId: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEntity: (type: 'character' | 'location' | 'faction' | 'event') => void;
  onRefreshData: () => void;
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
  leftSidebarOpen,
  rightSidebarOpen,
  onSelectDoc,
  onCloseDocTab,
  onNewDoc,
  onUpdateDoc,
  onSelectBookId,
  onOpenEntityDetail,
  onCreateEntity,
  onRefreshData
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

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-[#0c0c0e] text-[#e4e4e7]">
      {/* ========================================================= */}
      {/* 1. MOBILE & TABLET LAYOUT (< lg screen width)             */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden lg:hidden pb-14">
        {/* TAB 1: WRITER CANVAS (100% screen width & height) */}
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

        {/* TAB 2: STORY BIBLE (Characters / Factions / Locations) */}
        {mobileTab === 'databases' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full bg-[#0c0c0e] p-3 space-y-3 overflow-y-auto">
            {/* Sub-menu Tabs Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#27272a] pb-2">
              <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-lg border border-[#27272a] text-xs flex-1">
                <button
                  onClick={() => setDbSubTab('characters')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'characters'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-[#71717a] hover:text-[#e4e4e7]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>People</span>
                </button>

                <button
                  onClick={() => setDbSubTab('locations')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'locations'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-[#71717a] hover:text-[#e4e4e7]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Places</span>
                </button>

                <button
                  onClick={() => setDbSubTab('factions')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'factions'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-[#71717a] hover:text-[#e4e4e7]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Factions</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (dbSubTab === 'characters') onCreateEntity('character');
                  else if (dbSubTab === 'factions') onCreateEntity('faction');
                  else if (dbSubTab === 'locations') onCreateEntity('location');
                }}
                className="p-2 bg-indigo-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 shadow"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* List items */}
            <div className="space-y-2">
              {dbSubTab === 'characters' && (
                <>
                  {mobileFilteredCharacters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onOpenEntityDetail('character', c.id)}
                      className="p-3 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-xl flex items-center gap-3 cursor-pointer transition-all"
                    >
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-[#27272a]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center font-bold text-indigo-400 text-sm">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{c.name}</h4>
                        <p className="text-xs text-[#a1a1aa] truncate">{c.title}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    </div>
                  ))}
                </>
              )}

              {dbSubTab === 'locations' && (
                <>
                  {mobileFilteredLocations.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => onOpenEntityDetail('location', l.id)}
                      className="p-3 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-xl flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-sky-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{l.name}</h4>
                        <p className="text-xs text-[#a1a1aa] truncate">{l.region}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    </div>
                  ))}
                </>
              )}

              {dbSubTab === 'factions' && (
                <>
                  {mobileFilteredFactions.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onOpenEntityDetail('faction', f.id)}
                      className="p-3 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] rounded-xl flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-xl">
                        {f.emblem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{f.name}</h4>
                        <p className="text-xs text-indigo-400 truncate">{f.allegiance}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE */}
        {mobileTab === 'timeline' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full bg-[#0c0c0e]">
            <RightSidebar
              timelineEvents={timeline}
              characters={characters}
              locations={locations}
              factions={factions}
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

        {/* TAB 4: SETTINGS */}
        {mobileTab === 'settings' && (
          <div className="flex-1 flex flex-col min-h-0 h-full w-full bg-[#0c0c0e] p-4 overflow-y-auto">
            <SettingsView settings={settings} onRefreshData={onRefreshData} />
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#09090b] border-t border-[#27272a] flex items-center justify-around z-40 lg:hidden">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'editor' ? 'text-indigo-400 font-bold scale-105' : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Write</span>
          </button>

          <button
            onClick={() => setMobileTab('databases')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'databases' ? 'text-indigo-400 font-bold scale-105' : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bible</span>
          </button>

          <button
            onClick={() => setMobileTab('timeline')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'timeline' ? 'text-indigo-400 font-bold scale-105' : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('settings')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'settings' ? 'text-indigo-400 font-bold scale-105' : 'text-[#71717a] hover:text-[#e4e4e7]'
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
      <div className="hidden lg:flex flex-1 min-h-0 relative overflow-hidden bg-[#0c0c0e]">
        {/* LEFT MANUSCRIPT & STORY BIBLE DRAWER */}
        {leftSidebarOpen && (
          <div className="w-64 xl:w-72 border-r border-[#27272a] bg-[#09090b] flex flex-col shrink-0 min-h-0">
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
        )}

        {/* CENTER PRIMARY WRITER CANVAS (DOMINATES SCREEN) */}
        <div className="flex-1 min-w-0 bg-[#0c0c0e] flex flex-col min-h-0 overflow-hidden">
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

        {/* RIGHT COLLAPSIBLE STORY BIBLE & TIMELINE REFERENCE DRAWER */}
        {rightSidebarOpen && (
          <div className="w-80 xl:w-96 border-l border-[#27272a] bg-[#09090b] flex flex-col shrink-0 min-h-0 animate-in slide-in-from-right duration-200">
            <RightSidebar
              timelineEvents={timeline}
              characters={characters}
              locations={locations}
              factions={factions}
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
      </div>

      {/* PC-Only Master Matrix View Canvas Overlay */}
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
