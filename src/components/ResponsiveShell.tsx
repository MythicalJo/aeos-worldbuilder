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
import { useTheme } from '../context/ThemeContext';

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
  onDeleteDoc?: (id: string) => void;
  onNewDoc: () => void;
  onUpdateDoc: (doc: MarkdownDoc) => void;
  onSelectBookId: (id: string) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
  onCreateEntity: (type: 'character' | 'location' | 'faction' | 'event') => void;
  onUpdateTimelineEvent?: (updated: TimelineEvent) => void;
  onDeleteTimelineEvent?: (id: string) => void;
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
  onDeleteDoc,
  onNewDoc,
  onUpdateDoc,
  onSelectBookId,
  onOpenEntityDetail,
  onCreateEntity,
  onUpdateTimelineEvent,
  onDeleteTimelineEvent,
  onRefreshData
}) => {
  const { theme } = useTheme();
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

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const containerBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422]'
    : isLight
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#0c0c0e] text-[#e4e4e7]';

  const navBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1]'
    : 'bg-[#09090b] border-[#27272a]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <div className={`flex-1 flex flex-col min-h-0 relative overflow-hidden ${containerBg} select-none`}>
      {/* MOBILE & TABLET LAYOUT */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden lg:hidden pb-14">
        {/* TAB 1: WRITER CANVAS */}
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
              onDeleteDoc={onDeleteDoc}
              onNewDoc={onNewDoc}
              onUpdateDoc={onUpdateDoc}
              onOpenEntityDetail={onOpenEntityDetail}
            />
          </div>
        )}

        {/* TAB 2: WORLDBUILDER */}
        {mobileTab === 'databases' && (
          <div className={`flex-1 flex flex-col min-h-0 h-full w-full ${containerBg} p-3 space-y-3 overflow-y-auto`}>
            <div className="flex items-center justify-between gap-2 border-b pb-2">
              <div className={`flex items-center gap-1 ${navBg} p-1 rounded-lg border text-xs flex-1`}>
                <button
                  onClick={() => setDbSubTab('characters')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'characters' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>People</span>
                </button>

                <button
                  onClick={() => setDbSubTab('locations')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'locations' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Places</span>
                </button>

                <button
                  onClick={() => setDbSubTab('factions')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                    dbSubTab === 'factions' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
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

            <div className="space-y-2">
              {dbSubTab === 'characters' && (
                <>
                  {mobileFilteredCharacters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onOpenEntityDetail('character', c.id)}
                      className={`p-3 ${navBg} border rounded-xl flex items-center gap-3 cursor-pointer transition-all`}
                    >
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg ${navBg} border flex items-center justify-center font-bold ${accentColor} text-sm`}>
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{c.name}</h4>
                        <p className="text-xs opacity-70 truncate">{c.title}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
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
                      className={`p-3 ${navBg} border rounded-xl flex items-center gap-3 cursor-pointer transition-all`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${navBg} border flex items-center justify-center text-sky-500`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{l.name}</h4>
                        <p className="text-xs opacity-70 truncate">{l.region}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
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
                      className={`p-3 ${navBg} border rounded-xl flex items-center gap-3 cursor-pointer transition-all`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${navBg} border flex items-center justify-center text-xl`}>
                        {f.emblem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{f.name}</h4>
                        <p className={`text-xs ${accentColor} truncate`}>{f.allegiance}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE */}
        {mobileTab === 'timeline' && (
          <div className={`flex-1 flex flex-col min-h-0 h-full w-full ${containerBg}`}>
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
              onUpdateEvent={onUpdateTimelineEvent}
              onDeleteEvent={onDeleteTimelineEvent}
              isOpen={true}
            />
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {mobileTab === 'settings' && (
          <div className={`flex-1 flex flex-col min-h-0 h-full w-full ${containerBg} p-4 overflow-y-auto`}>
            <SettingsView settings={settings} onRefreshData={onRefreshData} />
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <nav className={`fixed bottom-0 left-0 right-0 h-14 ${navBg} border-t flex items-center justify-around z-40 lg:hidden`}>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'editor' ? `${accentColor} font-bold scale-105` : 'opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Write</span>
          </button>

          <button
            onClick={() => setMobileTab('databases')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'databases' ? `${accentColor} font-bold scale-105` : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">World</span>
          </button>

          <button
            onClick={() => setMobileTab('timeline')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'timeline' ? `${accentColor} font-bold scale-105` : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('settings')}
            className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
              mobileTab === 'settings' ? `${accentColor} font-bold scale-105` : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Settings</span>
          </button>
        </nav>
      </div>

      {/* PC DESKTOP MULTI-PANE LAYOUT */}
      <div className={`hidden lg:flex flex-1 min-h-0 relative overflow-hidden ${containerBg}`}>
        {/* LEFT MANUSCRIPT & WORLDBUILDER DRAWER */}
        {leftSidebarOpen && (
          <div className={`w-64 xl:w-72 border-r ${navBg} flex flex-col shrink-0 min-h-0`}>
            <LeftSidebar
              characters={characters}
              locations={locations}
              factions={factions}
              docs={docs}
              books={books}
              selectedBookId={selectedBookId}
              activeDocId={activeDocId}
              onSelectDoc={onSelectDoc}
              onNewDoc={onNewDoc}
              onDeleteDoc={onDeleteDoc}
              onOpenEntityDetail={onOpenEntityDetail}
              onCreateEntity={onCreateEntity}
              isOpen={true}
            />
          </div>
        )}

        {/* CENTER PRIMARY WRITER CANVAS */}
        <div className={`flex-1 min-w-0 ${containerBg} flex flex-col min-h-0 overflow-hidden`}>
          <CenterCanvas
            docs={docs}
            activeDocId={activeDocId}
            openDocIds={openDocIds}
            characters={characters}
            locations={locations}
            factions={factions}
            onSelectDoc={onSelectDoc}
            onCloseDocTab={onCloseDocTab}
            onDeleteDoc={onDeleteDoc}
            onNewDoc={onNewDoc}
            onUpdateDoc={onUpdateDoc}
            onOpenEntityDetail={onOpenEntityDetail}
          />
        </div>

        {/* RIGHT COLLAPSIBLE WORLDBUILDER & TIMELINE REFERENCE DRAWER */}
        {rightSidebarOpen && (
          <div className={`w-80 xl:w-96 border-l ${navBg} flex flex-col shrink-0 min-h-0 animate-in slide-in-from-right duration-200`}>
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
              onUpdateEvent={onUpdateTimelineEvent}
              onDeleteEvent={onDeleteTimelineEvent}
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
