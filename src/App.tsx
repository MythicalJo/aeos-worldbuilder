import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResponsiveShell } from './components/ResponsiveShell';
import { QuickSearchModal } from './components/QuickSearchModal';
import { EntityDetailModal } from './components/EntityDetailModal';
import { CreateEntityModal } from './components/CreateEntityModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { CreateCategoryModal } from './components/CreateCategoryModal';
import { ConfirmationModal } from './components/ConfirmationModal';

import {
  Character,
  Location,
  Faction,
  TimelineEvent,
  MarkdownDoc,
  WorldSettings,
  Book,
  Project,
  CustomCategory,
  CustomEntry
} from './types';

import {
  loadSettings,
  saveSettings,
  loadProjects,
  saveProjects,
  loadCustomCategories,
  saveCustomCategories,
  loadCustomEntries,
  saveCustomEntries,
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
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(() => loadSettings().activeProjectId || 'project-1');
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [factions, setFactions] = useState<Faction[]>(loadFactions);
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [locations, setLocations] = useState<Location[]>(loadLocations);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(loadCustomCategories);
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>(loadCustomEntries);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(loadTimeline);
  const [docs, setDocs] = useState<MarkdownDoc[]>(loadDocs);

  const [selectedBookId, setSelectedBookId] = useState<string>('book-1');
  const [activeDocId, setActiveDocId] = useState<string>(loadActiveDocId);
  const [openDocIds, setOpenDocIds] = useState<string[]>(['doc-1', 'doc-2']);

  // Load from IndexedDB on startup
  useEffect(() => {
    idbLoadAllData()
      .then((data) => {
        if (data) {
          if (data.settings) setSettings(data.settings);
          if (data.books && data.books.length > 0) setBooks(data.books);
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
  const [createCategoryOpen, setCreateCategoryOpen] = useState<boolean>(false);

  // Entity Detail Modal state
  const [inspectType, setInspectType] = useState<'character' | 'location' | 'faction' | 'misc' | 'custom' | null>(null);
  const [inspectId, setInspectId] = useState<string | null>(null);

  // Create Entity Modal state
  const [createMode, setCreateMode] = useState<'character' | 'location' | 'faction' | 'event' | null>(null);

  // Confirmation Modal State for Chapter Deletion
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<string | null>(null);

  // Active Project object
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  // List of project IDs that share Worldbuilder with active project (via explicit linking)
  const sharedProjectIds = React.useMemo(() => {
    if (!activeProject) return [activeProjectId];
    const linked = activeProject.linkedProjectIds || [];
    return Array.from(new Set([activeProject.id, ...linked]));
  }, [activeProject, activeProjectId]);

  // Scoped Entities for Active Project (including linked shared projects)
  const scopedCharacters = React.useMemo(() => {
    return characters.filter((c) => !c.projectId || sharedProjectIds.includes(c.projectId));
  }, [characters, sharedProjectIds]);

  const scopedLocations = React.useMemo(() => {
    return locations.filter((l) => !l.projectId || sharedProjectIds.includes(l.projectId));
  }, [locations, sharedProjectIds]);

  const scopedFactions = React.useMemo(() => {
    return factions.filter((f) => !f.projectId || sharedProjectIds.includes(f.projectId));
  }, [factions, sharedProjectIds]);

  const scopedCustomCategories = React.useMemo(() => {
    return customCategories.filter((c) => sharedProjectIds.includes(c.projectId));
  }, [customCategories, sharedProjectIds]);

  const scopedCustomEntries = React.useMemo(() => {
    return customEntries.filter((e) => sharedProjectIds.includes(e.projectId));
  }, [customEntries, sharedProjectIds]);

  const scopedBooks = React.useMemo(() => {
    return books.filter((b) => !b.projectId || b.projectId === activeProjectId);
  }, [books, activeProjectId]);

  // Settings update handler
  const handleUpdateSettings = (newSettings: WorldSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Project Selection Flow
  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    handleUpdateSettings({
      ...settings,
      activeProjectId: projectId
    });

    const projectBooks = books.filter((b) => b.projectId === projectId);
    if (projectBooks.length > 0) {
      setSelectedBookId(projectBooks[0].id);
    } else {
      // Create default book if project has none
      handleCreateBook(projectId, `${projects.find((p) => p.id === projectId)?.title || 'Story'} - Volume I`, 'Book 1 of series');
    }
  };

  // Select Book Flow
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    const matchedBook = books.find((b) => b.id === bookId);
    if (matchedBook && matchedBook.projectId) {
      setActiveProjectId(matchedBook.projectId);
    }

    // Scoped chapters
    const scopedDocs = docs.filter((d) => d.bookId === bookId);
    if (scopedDocs.length > 0) {
      setActiveDocId(scopedDocs[0].id);
      saveActiveDocId(scopedDocs[0].id);
      setOpenDocIds([scopedDocs[0].id]);
    } else {
      // Create Chapter 1 for this book
      const chapterId = `doc-ch1-${Date.now()}`;
      const newChapter: MarkdownDoc = {
        id: chapterId,
        projectId: matchedBook?.projectId || activeProjectId,
        bookId,
        title: 'Chapter 1: The Beginning',
        category: 'Chapter Draft',
        content: `# Chapter 1: The Beginning\n\nBegin writing prose for ${matchedBook ? matchedBook.title : 'this story'}...\n`,
        linkedEntityIds: [],
        tags: ['chapter'],
        updatedAt: new Date().toISOString().split('T')[0],
        wordCount: 10
      };
      const nextDocs = [newChapter, ...docs];
      setDocs(nextDocs);
      saveDocs(nextDocs);
      setActiveDocId(chapterId);
      saveActiveDocId(chapterId);
      setOpenDocIds([chapterId]);
    }
  };

  // Project Creation Flow
  const handleCreateProject = (title: string, description: string, authorName: string) => {
    const newProjId = `project-${Date.now()}`;
    const newProj: Project = {
      id: newProjId,
      title,
      description,
      authorName,
      linkedProjectIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const nextProjects = [...projects, newProj];
    setProjects(nextProjects);
    saveProjects(nextProjects);

    // Create Book 1 inside new Project
    handleCreateBook(newProjId, `${title} - Book 1`, 'First volume in series');
    setActiveProjectId(newProjId);
  };

  // Delete Project Flow
  const handleDeleteProject = (projIdToDelete: string) => {
    const nextProjects = projects.filter((p) => p.id !== projIdToDelete);
    setProjects(nextProjects);
    saveProjects(nextProjects);

    const nextBooks = books.filter((b) => b.projectId !== projIdToDelete);
    setBooks(nextBooks);
    saveBooks(nextBooks);

    if (activeProjectId === projIdToDelete && nextProjects.length > 0) {
      handleSelectProject(nextProjects[0].id);
    }
  };

  // Interlink Projects Flow
  const handleToggleLinkProjects = (projectAId: string, projectBId: string) => {
    const nextProjects = projects.map((p) => {
      if (p.id === projectAId) {
        const currentLinks = p.linkedProjectIds || [];
        const isLinked = currentLinks.includes(projectBId);
        const nextLinks = isLinked
          ? currentLinks.filter((id) => id !== projectBId)
          : [...currentLinks, projectBId];
        return { ...p, linkedProjectIds: nextLinks };
      }
      if (p.id === projectBId) {
        const currentLinks = p.linkedProjectIds || [];
        const isLinked = currentLinks.includes(projectAId);
        const nextLinks = isLinked
          ? currentLinks.filter((id) => id !== projectAId)
          : [...currentLinks, projectAId];
        return { ...p, linkedProjectIds: nextLinks };
      }
      return p;
    });

    setProjects(nextProjects);
    saveProjects(nextProjects);
  };

  // Book Creation Flow
  const handleCreateBook = (projectId: string, title: string, description: string) => {
    const newBookId = `book-${Date.now()}`;
    const newBook: Book = {
      id: newBookId,
      projectId,
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

    // Create Chapter 1 for this new book
    const newChapterId = `doc-ch1-${Date.now()}`;
    const newChapter: MarkdownDoc = {
      id: newChapterId,
      projectId,
      bookId: newBookId,
      title: 'Chapter 1: The Beginning',
      category: 'Chapter Draft',
      content: `# Chapter 1: The Beginning\n\nBegin writing chapter prose...\n`,
      linkedEntityIds: [],
      tags: ['chapter'],
      updatedAt: new Date().toISOString().split('T')[0],
      wordCount: 7
    };

    const nextDocs = [newChapter, ...docs];
    setDocs(nextDocs);
    saveDocs(nextDocs);

    setSelectedBookId(newBookId);
    setActiveDocId(newChapterId);
    saveActiveDocId(newChapterId);
    setOpenDocIds([newChapterId]);
  };

  const handleDeleteBook = (idToDelete: string) => {
    const nextBooks = books.filter((b) => b.id !== idToDelete);
    setBooks(nextBooks);
    saveBooks(nextBooks);
    if (selectedBookId === idToDelete) {
      const remainingScoped = nextBooks.filter((b) => b.projectId === activeProjectId);
      if (remainingScoped.length > 0) {
        handleSelectBook(remainingScoped[0].id);
      }
    }
  };

  // Universal Create Action Handler
  const handleCreateAction = (type: 'chapter' | 'character' | 'location' | 'faction' | 'misc' | 'category') => {
    if (type === 'chapter') {
      handleNewDoc();
    } else if (type === 'character' || type === 'location' || type === 'faction') {
      setCreateMode(type);
    } else if (type === 'misc') {
      // Create new misc entry
      const newEntryId = `entry-${Date.now()}`;
      const newEntry: CustomEntry = {
        id: newEntryId,
        projectId: activeProjectId,
        categoryId: 'misc',
        title: 'New Misc World Note',
        subtitle: 'General Worldbuilding',
        description: 'Detail general world lore, artifacts, magic rules, or custom story info.',
        tags: ['misc', 'lore'],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const nextEntries = [newEntry, ...customEntries];
      setCustomEntries(nextEntries);
      saveCustomEntries(nextEntries);
    } else if (type === 'category') {
      setCreateCategoryOpen(true);
    }
  };

  // Custom Category Creation
  const handleCreateCategory = (name: string, iconName: string, description: string) => {
    const newCatId = `cat-${Date.now()}`;
    const newCat: CustomCategory = {
      id: newCatId,
      projectId: activeProjectId,
      name,
      iconName,
      description
    };
    const nextCats = [...customCategories, newCat];
    setCustomCategories(nextCats);
    saveCustomCategories(nextCats);
  };

  const handleDeleteCustomCategory = (categoryId: string) => {
    const nextCats = customCategories.filter((c) => c.id !== categoryId);
    setCustomCategories(nextCats);
    saveCustomCategories(nextCats);
  };

  const handleDeleteCustomEntry = (entryId: string) => {
    const nextEntries = customEntries.filter((e) => e.id !== entryId);
    setCustomEntries(nextEntries);
    saveCustomEntries(nextEntries);
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
        setProjects(loadProjects());
        setBooks(loadBooks());
        setFactions(loadFactions());
        setCharacters(loadCharacters());
        setLocations(loadLocations());
        setCustomCategories(loadCustomCategories());
        setCustomEntries(loadCustomEntries());
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

  const handleConfirmDeleteDoc = () => {
    if (!confirmDeleteDocId) return;
    const idToDelete = confirmDeleteDocId;
    const nextDocs = docs.filter((d) => d.id !== idToDelete);
    const nextOpen = openDocIds.filter((id) => id !== idToDelete);

    setDocs(nextDocs);
    saveDocs(nextDocs);
    setOpenDocIds(nextOpen);

    if (activeDocId === idToDelete) {
      const nextActiveId = nextOpen.length > 0 ? nextOpen[nextOpen.length - 1] : nextDocs[0]?.id || '';
      setActiveDocId(nextActiveId);
      saveActiveDocId(nextActiveId);
    }
    setConfirmDeleteDocId(null);
  };

  const handleNewDoc = () => {
    const newDocId = `doc-${Date.now()}`;
    const newDocItem: MarkdownDoc = {
      id: newDocId,
      projectId: activeProjectId,
      bookId: selectedBookId,
      title: 'New Chapter Draft',
      category: 'Chapter Draft',
      content: `# New Chapter\n\nBegin writing chapter prose...\n`,
      linkedEntityIds: [],
      tags: ['chapter'],
      updatedAt: new Date().toISOString().split('T')[0],
      wordCount: 6
    };

    const nextDocs = [newDocItem, ...docs];
    setDocs(nextDocs);
    saveDocs(nextDocs);

    setActiveDocId(newDocId);
    saveActiveDocId(newDocId);
    setOpenDocIds([...openDocIds, newDocId]);
  };

  // Open Character Notes Functionality
  const handleOpenCharacterNote = (characterId: string) => {
    const char = characters.find((c) => c.id === characterId);
    if (!char) return;

    if (char.markdownNoteId) {
      const existingNote = docs.find((d) => d.id === char.markdownNoteId);
      if (existingNote) {
        handleSelectDoc(existingNote.id);
        setInspectType(null);
        setInspectId(null);
        return;
      }
    }

    // Create new note doc for character
    const noteId = `doc-char-${char.id}`;
    const newNote: MarkdownDoc = {
      id: noteId,
      projectId: activeProjectId,
      bookId: selectedBookId,
      title: `${char.name} - Character Profile`,
      category: 'Character Profile',
      content: `# ${char.name}\n**Role**: ${char.role}\n**Title**: ${char.title}\n\n## Biography & Notes\n${char.description}\n`,
      linkedEntityIds: [{ type: 'character', id: char.id, name: char.name }],
      tags: ['character', 'notes'],
      updatedAt: new Date().toISOString().split('T')[0],
      wordCount: 20
    };

    const nextDocs = [newNote, ...docs];
    setDocs(nextDocs);
    saveDocs(nextDocs);

    // Update character with markdownNoteId
    const updatedChar = { ...char, markdownNoteId: noteId };
    handleUpdateCharacter(updatedChar);

    handleSelectDoc(noteId);
    setInspectType(null);
    setInspectId(null);
  };

  // Entity creation handlers
  const handleCreateCharacter = (c: Character) => {
    const withProj = { ...c, projectId: activeProjectId };
    const nextChars = [withProj, ...characters];
    setCharacters(nextChars);
    saveCharacters(nextChars);
  };

  const handleCreateLocation = (l: Location) => {
    const withProj = { ...l, projectId: activeProjectId };
    const nextLocs = [withProj, ...locations];
    setLocations(nextLocs);
    saveLocations(nextLocs);
  };

  const handleCreateFaction = (f: Faction) => {
    const withProj = { ...f, projectId: activeProjectId };
    const nextFacs = [withProj, ...factions];
    setFactions(nextFacs);
    saveFactions(nextFacs);
  };

  const handleCreateTimelineEvent = (e: TimelineEvent) => {
    const withProj = { ...e, projectId: activeProjectId };
    const nextTime = [withProj, ...timeline];
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

  const handleDeleteEntity = (type: 'character' | 'location' | 'faction' | 'misc' | 'custom', id: string) => {
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
    } else if (type === 'misc' || type === 'custom') {
      handleDeleteCustomEntry(id);
    }
  };

  return (
    <ThemeProvider>
      <LoreProvider>
        <div className="flex flex-col h-screen w-screen font-sans overflow-hidden select-none">
          {/* App Header */}
          <Header
            settings={settings}
            projects={projects}
            activeProject={activeProject}
            books={scopedBooks}
            selectedBookId={selectedBookId}
            onUpdateSettings={handleUpdateSettings}
            onSelectBookId={handleSelectBook}
            onOpenProjectManager={() => setProjectManagerOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
            leftSidebarOpen={leftSidebarOpen}
            onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
            rightSidebarOpen={rightSidebarOpen}
            onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
            onRefreshData={handleRefreshData}
            onCreateAction={handleCreateAction}
          />

          {/* Main Responsive Shell Layout */}
          <ResponsiveShell
            settings={settings}
            books={scopedBooks}
            characters={scopedCharacters}
            locations={scopedLocations}
            factions={scopedFactions}
            customCategories={scopedCustomCategories}
            customEntries={scopedCustomEntries}
            timeline={timeline}
            docs={docs}
            selectedBookId={selectedBookId}
            activeDocId={activeDocId}
            openDocIds={openDocIds}
            leftSidebarOpen={leftSidebarOpen}
            rightSidebarOpen={rightSidebarOpen}
            onSelectDoc={handleSelectDoc}
            onCloseDocTab={handleCloseDocTab}
            onDeleteDoc={(id) => setConfirmDeleteDocId(id)}
            onNewDoc={handleNewDoc}
            onUpdateDoc={handleUpdateDoc}
            onSelectBookId={handleSelectBook}
            onOpenEntityDetail={(type, id) => {
              setInspectType(type);
              setInspectId(id);
            }}
            onCreateEntity={(type) => {
              if (type === 'category') setCreateCategoryOpen(true);
              else handleCreateAction(type);
            }}
            onDeleteCustomCategory={handleDeleteCustomCategory}
            onDeleteCustomEntry={handleDeleteCustomEntry}
            onUpdateTimelineEvent={handleUpdateTimelineEvent}
            onDeleteTimelineEvent={handleDeleteTimelineEvent}
            onRefreshData={handleRefreshData}
          />

          {/* Project Manager Modal */}
          <ProjectManagerModal
            isOpen={projectManagerOpen}
            onClose={() => setProjectManagerOpen(false)}
            projects={projects}
            activeProject={activeProject}
            books={books}
            selectedBookId={selectedBookId}
            onSelectProject={handleSelectProject}
            onSelectBook={handleSelectBook}
            onCreateProject={handleCreateProject}
            onCreateBook={(projId, title, desc) => handleCreateBook(projId, title, desc)}
            onDeleteProject={handleDeleteProject}
            onDeleteBook={handleDeleteBook}
            onToggleLinkProjects={handleToggleLinkProjects}
          />

          {/* Custom Category Creation Modal */}
          <CreateCategoryModal
            isOpen={createCategoryOpen}
            onClose={() => setCreateCategoryOpen(false)}
            onCreateCategory={handleCreateCategory}
          />

          {/* Global Quick Search Modal */}
          <QuickSearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            characters={scopedCharacters}
            locations={scopedLocations}
            factions={scopedFactions}
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
            type={inspectType === 'misc' || inspectType === 'custom' ? null : inspectType}
            entityId={inspectId}
            isOpen={inspectType !== null && inspectType !== 'misc' && inspectType !== 'custom'}
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
            onOpenCharacterNote={handleOpenCharacterNote}
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

          {/* In-App Confirmation Modal for Chapter Deletion */}
          {confirmDeleteDocId && (
            <ConfirmationModal
              isOpen={confirmDeleteDocId !== null}
              onClose={() => setConfirmDeleteDocId(null)}
              title="Delete Chapter Draft?"
              message="Are you sure you want to permanently delete this chapter draft? This action cannot be undone."
              confirmText="Delete Chapter"
              onConfirm={handleConfirmDeleteDoc}
            />
          )}
        </div>
      </LoreProvider>
    </ThemeProvider>
  );
}
