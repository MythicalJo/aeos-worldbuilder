import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResponsiveShell } from './components/ResponsiveShell';
import { QuickSearchModal } from './components/QuickSearchModal';
import { EntityDetailModal } from './components/EntityDetailModal';
import { CreateEntityModal } from './components/CreateEntityModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';

import {
  Character,
  Location,
  Faction,
  TimelineEvent,
  MarkdownDoc,
  WorldSettings,
  Book
} from './types';

import {
  loadSettings,
  saveSettings,
  loadBooks,
  saveBooks,
  loadFactions,
  saveFactions,
  loadCharacters,
  saveCharacters,
  loadLocations,
  saveLocations,
  loadTimeline,
  saveTimeline,
  loadDocs,
  saveDocs,
  loadActiveDocId,
  saveActiveDocId,
  idbLoadAllData
} from './lib/storage';

import { initPWA } from './lib/pwa';
import { LoreProvider } from './context/LoreContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  // Initialize PWA Service Worker registration
  useEffect(() => {
    initPWA();
  }, []);

  // Main Persistent State
  const [settings, setSettings] = useState<WorldSettings>(loadSettings);
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [factions, setFactions] = useState<Faction[]>(loadFactions);
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [locations, setLocations] = useState<Location[]>(loadLocations);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(loadTimeline);
  const [docs, setDocs] = useState<MarkdownDoc[]>(loadDocs);

  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [activeDocId, setActiveDocId] = useState<string>(loadActiveDocId);
  const [openDocIds, setOpenDocIds] = useState<string[]>(['doc-1', 'doc-2', 'doc-3']);

  // Load from IndexedDB on startup
  useEffect(() => {
    idbLoadAllData()
      .then((data) => {
        if (data) {
          if (data.settings) setSettings(data.settings);
          if (data.books) setBooks(data.books);
          if (data.factions) setFactions(data.factions);
          if (data.characters) setCharacters(data.characters);
          if (data.locations) setLocations(data.locations);
          if (data.timeline) setTimeline(data.timeline);
          if (data.docs) setDocs(data.docs);
          if (data.activeDocId) setActiveDocId(data.activeDocId);
        }
      })
      .catch((err) => {
        console.error('IndexedDB load error:', err);
      });
  }, []);

  // Sidebar Toggles
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [projectManagerOpen, setProjectManagerOpen] = useState<boolean>(false);

  // Entity Detail Modal state
  const [inspectType, setInspectType] = useState<'character' | 'location' | 'faction' | null>(null);
  const [inspectId, setInspectId] = useState<string | null>(null);

  // Create Entity Modal state
  const [createMode, setCreateMode] = useState<'character' | 'location' | 'faction' | 'event' | null>(null);

  // Settings update handler
  const handleUpdateSettings = (newSettings: WorldSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Project / Book Management Handlers
  const handleCreateBook = (title: string, description: string) => {
    const newBookId = `book-${Date.now()}`;
    const newBook: Book = {
      id: newBookId,
      title,
      subtitle: description,
      order: books.length + 1,
      status: 'Drafting',
      summary: description,
      yearRange: 'Current Era',
      volumeNumber: books.length + 1,
      wordCountGoal: 80000,
      currentWordCount: 0,
      description
    };

    const nextBooks = [...books, newBook];
    setBooks(nextBooks);
    saveBooks(nextBooks);
    setSelectedBookId(newBookId);
  };

  const handleDeleteBook = (idToDelete: string) => {
    const nextBooks = books.filter((b) => b.id !== idToDelete);
    setBooks(nextBooks);
    saveBooks(nextBooks);
    if (selectedBookId === idToDelete) {
      setSelectedBookId('all');
    }
  };

  // Refresh data
  const handleRefreshData = () => {
    idbLoadAllData()
      .then((data) => {
        if (data) {
          setSettings(data.settings);
          setBooks(data.books);
          setFactions(data.factions);
          setCharacters(data.characters);
          setLocations(data.locations);
          setTimeline(data.timeline);
          setDocs(data.docs);
          setActiveDocId(data.activeDocId);
        }
      })
      .catch(() => {
        setSettings(loadSettings());
        setBooks(loadBooks());
        setFactions(loadFactions());
        setCharacters(loadCharacters());
        setLocations(loadLocations());
        setTimeline(loadTimeline());
        setDocs(loadDocs());
        setActiveDocId(loadActiveDocId());
      });
  };

  const handleUpdateDoc = (updatedDoc: MarkdownDoc) => {
    const nextDocs = docs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
    setDocs(nextDocs);
    saveDocs(nextDocs);
  };

  const handleSelectDoc = (id: string) => {
    setActiveDocId(id);
    saveActiveDocId(id);
    if (!openDocIds.includes(id)) {
      setOpenDocIds([...openDocIds, id]);
    }
  };

  const handleCloseDocTab = (idToClose: string) => {
    const nextOpen = openDocIds.filter((id) => id !== idToClose);
    setOpenDocIds(nextOpen);
    if (activeDocId === idToClose && nextOpen.length > 0) {
      setActiveDocId(nextOpen[nextOpen.length - 1]);
      saveActiveDocId(nextOpen[nextOpen.length - 1]);
    }
  };

  const handleNewDoc = () => {
    const newDocId = `doc-${Date.now()}`;
    const newDocItem: MarkdownDoc = {
      id: newDocId,
      title: 'New Chapter Draft',
      category: 'Chapter Draft',
      content: `# New Chapter\n\nBegin writing chapter prose or manuscript notes...\n`,
      linkedEntityIds: [],
      tags: ['chapter'],
      updatedAt: new Date().toISOString().split('T')[0],
      wordCount: 8
    };

    const nextDocs = [newDocItem, ...docs];
    setDocs(nextDocs);
    saveDocs(nextDocs);

    setActiveDocId(newDocId);
    saveActiveDocId(newDocId);
    setOpenDocIds([...openDocIds, newDocId]);
  };

  // Entity creation handlers
  const handleCreateCharacter = (c: Character) => {
    const nextChars = [c, ...characters];
    setCharacters(nextChars);
    saveCharacters(nextChars);
  };

  const handleCreateLocation = (l: Location) => {
    const nextLocs = [l, ...locations];
    setLocations(nextLocs);
    saveLocations(nextLocs);
  };

  const handleCreateFaction = (f: Faction) => {
    const nextFacs = [f, ...factions];
    setFactions(nextFacs);
    saveFactions(nextFacs);
  };

  const handleCreateTimelineEvent = (e: TimelineEvent) => {
    const nextTime = [e, ...timeline];
    setTimeline(nextTime);
    saveTimeline(nextTime);
  };

  const handleUpdateTimelineEvent = (updatedEvt: TimelineEvent) => {
    const nextTime = timeline.map((e) => (e.id === updatedEvt.id ? updatedEvt : e));
    setTimeline(nextTime);
    saveTimeline(nextTime);
  };

  const handleDeleteTimelineEvent = (idToDelete: string) => {
    const nextTime = timeline.filter((e) => e.id !== idToDelete);
    setTimeline(nextTime);
    saveTimeline(nextTime);
  };

  // Entity updates / deletes
  const handleUpdateCharacter = (updated: Character) => {
    const nextChars = characters.map((c) => (c.id === updated.id ? updated : c));
    setCharacters(nextChars);
    saveCharacters(nextChars);
  };

  const handleUpdateLocation = (updated: Location) => {
    const nextLocs = locations.map((l) => (l.id === updated.id ? updated : l));
    setLocations(nextLocs);
    saveLocations(nextLocs);
  };

  const handleUpdateFaction = (updated: Faction) => {
    const nextFacs = factions.map((f) => (f.id === updated.id ? updated : f));
    setFactions(nextFacs);
    saveFactions(nextFacs);
  };

  const handleDeleteEntity = (type: 'character' | 'location' | 'faction', id: string) => {
    if (type === 'character') {
      const nextChars = characters.filter((c) => c.id !== id);
      setCharacters(nextChars);
      saveCharacters(nextChars);
    } else if (type === 'location') {
      const nextLocs = locations.filter((l) => l.id !== id);
      setLocations(nextLocs);
      saveLocations(nextLocs);
    } else if (type === 'faction') {
      const nextFacs = factions.filter((f) => f.id !== id);
      setFactions(nextFacs);
      saveFactions(nextFacs);
    }
  };

  return (
    <ThemeProvider>
      <LoreProvider>
        <div className="flex flex-col h-screen w-screen font-sans overflow-hidden select-none">
          {/* App Header */}
          <Header
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            books={books}
            selectedBookId={selectedBookId}
            onSelectBookId={setSelectedBookId}
            onOpenProjectManager={() => setProjectManagerOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
            leftSidebarOpen={leftSidebarOpen}
            onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
            rightSidebarOpen={rightSidebarOpen}
            onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
            onRefreshData={handleRefreshData}
            onNewDoc={handleNewDoc}
          />

          {/* Main Responsive Shell Layout */}
          <ResponsiveShell
            settings={settings}
            books={books}
            characters={characters}
            locations={locations}
            factions={factions}
            timeline={timeline}
            docs={docs}
            selectedBookId={selectedBookId}
            activeDocId={activeDocId}
            openDocIds={openDocIds}
            leftSidebarOpen={leftSidebarOpen}
            rightSidebarOpen={rightSidebarOpen}
            onSelectDoc={handleSelectDoc}
            onCloseDocTab={handleCloseDocTab}
            onNewDoc={handleNewDoc}
            onUpdateDoc={handleUpdateDoc}
            onSelectBookId={setSelectedBookId}
            onOpenEntityDetail={(type, id) => {
              setInspectType(type);
              setInspectId(id);
            }}
            onCreateEntity={(type) => setCreateMode(type)}
            onUpdateTimelineEvent={handleUpdateTimelineEvent}
            onDeleteTimelineEvent={handleDeleteTimelineEvent}
            onRefreshData={handleRefreshData}
          />

          {/* Project Manager Modal */}
          <ProjectManagerModal
            isOpen={projectManagerOpen}
            onClose={() => setProjectManagerOpen(false)}
            books={books}
            selectedBookId={selectedBookId}
            onSelectBook={setSelectedBookId}
            onCreateBook={handleCreateBook}
            onDeleteBook={handleDeleteBook}
          />

          {/* Global Quick Search Modal */}
          <QuickSearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            characters={characters}
            locations={locations}
            factions={factions}
            timeline={timeline}
            docs={docs}
            onSelectDoc={handleSelectDoc}
            onOpenEntityDetail={(type, id) => {
              setInspectType(type);
              setInspectId(id);
            }}
          />

          {/* Entity Inspector & Detail Modal */}
          <EntityDetailModal
            type={inspectType}
            entityId={inspectId}
            isOpen={inspectType !== null}
            onClose={() => {
              setInspectType(null);
              setInspectId(null);
            }}
            characters={characters}
            locations={locations}
            factions={factions}
            books={books}
            docs={docs}
            onUpdateCharacter={handleUpdateCharacter}
            onUpdateLocation={handleUpdateLocation}
            onUpdateFaction={handleUpdateFaction}
            onDeleteEntity={handleDeleteEntity}
            onSelectDoc={handleSelectDoc}
          />

          {/* Entity Creation Modal */}
          <CreateEntityModal
            mode={createMode}
            isOpen={createMode !== null}
            onClose={() => setCreateMode(null)}
            books={books}
            factions={factions}
            locations={locations}
            characters={characters}
            onCreateCharacter={handleCreateCharacter}
            onCreateLocation={handleCreateLocation}
            onCreateFaction={handleCreateFaction}
            onCreateTimelineEvent={handleCreateTimelineEvent}
          />
        </div>
      </LoreProvider>
    </ThemeProvider>
  );
}
