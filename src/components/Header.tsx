import React, { useState, useEffect, useRef } from 'react';
import { Book, WorldSettings, Project } from '../types';
import { canInstallPWA, promptPWAInstall, isAppStandalone } from '../lib/pwa';
import { exportFullDatabase, importFullDatabase, resetToDefaults, DatabaseDump } from '../lib/storage';
import { useTheme, AppTheme, ACCENT_COLORS } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { NorthStarIcon } from './NorthStarIcon';
import {
  BookOpen,
  Search,
  Download,
  Upload,
  RotateCcw,
  PanelLeft,
  PanelRight,
  Plus,
  Sliders,
  Feather,
  Edit2,
  Check,
  Sun,
  Moon,
  Coffee,
  FolderOpen,
  ChevronDown,
  User,
  MapPin,
  Shield,
  FileText,
  Gem,
  Palette
} from 'lucide-react';

interface HeaderProps {
  settings: WorldSettings;
  projects: Project[];
  activeProject: Project | null;
  books: Book[];
  selectedBookId: string;
  onUpdateSettings: (settings: WorldSettings) => void;
  onSelectBookId: (id: string) => void;
  onOpenProjectManager: () => void;
  onOpenSearch: () => void;
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  onRefreshData: () => void;
  onCreateAction: (type: 'chapter' | 'character' | 'location' | 'faction' | 'category') => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  projects,
  activeProject,
  books,
  selectedBookId,
  onUpdateSettings,
  onSelectBookId,
  onOpenProjectManager,
  onOpenSearch,
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightSidebarOpen,
  onToggleRightSidebar,
  onRefreshData,
  onCreateAction
}) => {
  const { theme, setTheme, accent, setAccent, getAccentClasses } = useTheme();
  const accentClasses = getAccentClasses();

  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pwaInstallable, setPwaInstallable] = useState<boolean>(canInstallPWA());
  const [installed, setInstalled] = useState<boolean>(isAppStandalone());
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);

  // Editable Project Title state
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>(activeProject?.title || settings.seriesTitle || 'My Story Project');

  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(settingsMenuRef, () => setShowSettingsMenu(false), showSettingsMenu);
  useOutsideClick(themeMenuRef, () => setShowThemeMenu(false), showThemeMenu);
  useOutsideClick(createMenuRef, () => setShowCreateMenu(false), showCreateMenu);

  useEffect(() => {
    setProjectTitle(activeProject?.title || settings.seriesTitle);
  }, [activeProject, settings.seriesTitle]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setPwaInstallable(canInstallPWA());
      setInstalled(isAppStandalone());
    }, 1500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (projectTitle.trim()) {
      onUpdateSettings({
        ...settings,
        seriesTitle: projectTitle.trim()
      });
    }
  };

  const handlePWAInstall = async () => {
    const installedSuccess = await promptPWAInstall();
    if (installedSuccess) {
      setInstalled(true);
      setPwaInstallable(false);
    }
  };

  const handleExportJSON = () => {
    const dump = exportFullDatabase();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeProject?.title || 'story').toLowerCase().replace(/\s+/g, '_')}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowSettingsMenu(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dump = JSON.parse(event.target?.result as string) as DatabaseDump;
        const success = importFullDatabase(dump);
        if (success) {
          onRefreshData();
          alert('Storybuilder backup data imported successfully!');
        } else {
          alert('Failed to parse file.');
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    setShowSettingsMenu(false);
  };

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090] text-[#433422]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a]'
    : 'bg-[#09090b] border-[#27272a] text-[#e4e4e7]';

  const btnBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090] text-[#433422] hover:bg-[#e4c990]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1] text-[#0f172a] hover:bg-[#e2e8f0]'
    : 'bg-[#18181b] border-[#27272a] text-[#e4e4e7] hover:bg-[#27272a]';

  const activeBookTitle =
    selectedBookId === 'all'
      ? 'All Story Books'
      : books.find((b) => b.id === selectedBookId)?.title || 'Select Book';

  return (
    <header className={`h-12 ${headerBg} border-b flex items-center justify-between px-3 md:px-4 z-30 shrink-0 select-none`}>
      {/* Left Section: Navigation Toggle, Logo & Active Project / Book */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleLeftSidebar}
          title="Toggle Drawer (Left Sidebar)"
          className={`p-1.5 rounded transition-colors ${
            leftSidebarOpen ? `${btnBg} font-bold ${accentClasses.text}` : 'opacity-70 hover:opacity-100'
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${accentClasses.bg} rounded flex items-center justify-center shrink-0 shadow-sm`}>
            <NorthStarIcon className="w-3.5 h-3.5 text-white" />
          </div>

          {/* Project Title with Baseline Typography Alignment */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-60 hidden sm:inline leading-none">
              Project
            </span>

            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                  }}
                  onBlur={handleSaveTitle}
                  autoFocus
                  className={`${btnBg} text-xs md:text-sm font-bold px-2 py-0.5 rounded border focus:outline-none`}
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-500 rounded"
                  title="Save Title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded hover:bg-black/10 transition-colors"
                title="Click to Rename Active Project Title"
              >
                <h1 className="text-xs md:text-sm font-bold tracking-tight truncate max-w-[150px] sm:max-w-[220px] leading-none">
                  {activeProject?.title || settings.seriesTitle || 'My Story Project'}
                </h1>
                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Book Selector Dropdown Button */}
        <button
          onClick={onOpenProjectManager}
          className={`hidden md:flex items-center gap-1.5 ${btnBg} px-2.5 py-1 rounded border text-xs transition-colors`}
          title="Open Projects & Books Manager"
        >
          <BookOpen className={`w-3.5 h-3.5 ${accentClasses.text} shrink-0`} />
          <span className="font-semibold truncate max-w-[130px]">{activeBookTitle}</span>
          <FolderOpen className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      </div>

      {/* Middle & Right Section: Universal Create Button, Search, Theme & Settings */}
      <div className="flex items-center gap-2">
        {/* UNIVERSAL CREATE ACTION BUTTON */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className={`flex items-center gap-1.5 ${accentClasses.bg} text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-md`}
            title="Create Chapter, Character, Location, Faction, or Custom Category"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
            <ChevronDown className="w-3 h-3 opacity-80 ml-0.5" />
          </button>

          {showCreateMenu && (
            <div className={`absolute right-0 mt-2 w-48 ${headerBg} border rounded-xl shadow-2xl p-1 z-50 text-xs space-y-1`}>
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold opacity-60 border-b">
                Create New Action
              </div>

              <button
                onClick={() => {
                  onCreateAction('chapter');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left font-bold"
              >
                <FileText className={`w-3.5 h-3.5 ${accentClasses.text}`} />
                <span>Chapter Draft</span>
              </button>

              <button
                onClick={() => {
                  onCreateAction('character');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left font-bold"
              >
                <User className={`w-3.5 h-3.5 ${accentClasses.text}`} />
                <span>Character Profile</span>
              </button>

              <button
                onClick={() => {
                  onCreateAction('location');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left font-bold"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Place / Location</span>
              </button>

              <button
                onClick={() => {
                  onCreateAction('faction');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left font-bold"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Faction / Guild</span>
              </button>

              <button
                onClick={() => {
                  onCreateAction('category');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left text-indigo-500 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Category</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className={`flex items-center gap-1.5 ${btnBg} px-2.5 py-1 rounded border text-xs transition-colors`}
          title="Quick Search (Ctrl+K)"
        >
          <Search className={`w-3.5 h-3.5 ${accentClasses.text}`} />
          <span className="hidden md:inline font-medium">Quick search...</span>
          <kbd className="hidden lg:inline text-[10px] opacity-60 bg-black/10 px-1 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Theme & Accent Customization Dropdown */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`p-1.5 rounded border ${btnBg} transition-colors flex items-center gap-1 text-xs`}
            title="Appearance Theme & Accent Customization"
          >
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'sepia' && <Coffee className="w-4 h-4 text-[#964b00]" />}
          </button>

          {showThemeMenu && (
            <div className={`absolute right-0 mt-2 w-48 ${headerBg} border rounded-xl shadow-2xl p-2 z-50 text-xs space-y-2`}>
              <div className="px-2 py-0.5 text-[10px] uppercase font-bold opacity-60 border-b">
                Appearance Theme
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left ${
                    theme === 'dark' ? 'bg-black/20 font-bold' : 'hover:bg-black/10'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left ${
                    theme === 'light' ? 'bg-black/20 font-bold' : 'hover:bg-black/10'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>

                <button
                  onClick={() => setTheme('sepia')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left ${
                    theme === 'sepia' ? 'bg-black/20 font-bold' : 'hover:bg-black/10'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Sepia</span>
                </button>
              </div>

              <div className="px-2 py-0.5 text-[10px] uppercase font-bold opacity-60 border-b flex items-center justify-between">
                <span>Accent Color</span>
                <Palette className="w-3 h-3" />
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1">
                {ACCENT_COLORS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAccent(item.id)}
                    className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                      accent === item.id ? 'ring-2 ring-indigo-500 scale-105 shadow' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: `${item.hex}20`, color: item.hex, borderColor: `${item.hex}40` }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.hex }} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PWA Ready Badge */}
        <div className={`flex items-center ${btnBg} rounded px-2 py-1 gap-1.5 text-xs border shrink-0`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="hidden md:inline text-[11px] font-medium opacity-70">
            {installed ? 'PWA Ready' : isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {!installed && pwaInstallable && (
          <button
            onClick={handlePWAInstall}
            className={`${accentClasses.bg} text-white text-xs px-3 py-1.5 rounded font-bold transition-colors shadow-sm`}
            title="Install Storybuilder App"
          >
            Install App
          </button>
        )}

        {/* Backup & Settings Menu */}
        <div className="relative" ref={settingsMenuRef}>
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className={`p-1.5 rounded border ${btnBg} transition-colors`}
            title="Import / Export Project Data Backup"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {showSettingsMenu && (
            <div className={`absolute right-0 mt-2 w-52 ${headerBg} border rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1`}>
              <div className="px-2 py-1 text-[10px] uppercase font-bold opacity-60 border-b">
                Project Data Backup
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left"
              >
                <Download className={`w-3.5 h-3.5 ${accentClasses.text}`} />
                <span>Export Project (.json)</span>
              </button>

              <label className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/10 text-left cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-sky-500" />
                <span>Import Project (.json)</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* Worldbuilder Reference Drawer Toggle */}
        <button
          onClick={onToggleRightSidebar}
          title="Toggle Worldbuilder Reference Drawer (Right Sidebar)"
          className={`p-1.5 rounded border transition-colors ${
            rightSidebarOpen ? `${btnBg} font-bold ${accentClasses.text}` : `${btnBg} opacity-70 hover:opacity-100`
          }`}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
