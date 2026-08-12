import React, { useState, useEffect } from 'react';
import { Book, WorldSettings } from '../types';
import { canInstallPWA, promptPWAInstall, isAppStandalone } from '../lib/pwa';
import { exportFullDatabase, importFullDatabase, resetToDefaults, DatabaseDump } from '../lib/storage';
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
  Check
} from 'lucide-react';

interface HeaderProps {
  settings: WorldSettings;
  onUpdateSettings: (settings: WorldSettings) => void;
  books: Book[];
  selectedBookId: string;
  onSelectBookId: (id: string) => void;
  onOpenSearch: () => void;
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  onRefreshData: () => void;
  onNewDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  books,
  selectedBookId,
  onSelectBookId,
  onOpenSearch,
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightSidebarOpen,
  onToggleRightSidebar,
  onRefreshData,
  onNewDoc
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pwaInstallable, setPwaInstallable] = useState<boolean>(canInstallPWA());
  const [installed, setInstalled] = useState<boolean>(isAppStandalone());
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  // Editable Project Title state
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>(settings.seriesTitle || 'My Novel Project');

  useEffect(() => {
    setProjectTitle(settings.seriesTitle);
  }, [settings.seriesTitle]);

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
    if (projectTitle.trim() && projectTitle !== settings.seriesTitle) {
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
    a.download = `${settings.seriesTitle.toLowerCase().replace(/\s+/g, '_')}_backup.json`;
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
          alert('Project data imported successfully!');
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

  const handleReset = () => {
    if (confirm('Reset project data to template defaults?')) {
      resetToDefaults();
      onRefreshData();
      setShowSettingsMenu(false);
    }
  };

  return (
    <header className="h-12 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-3 md:px-4 z-30 shrink-0 select-none">
      {/* Left section: Sidebar toggle, Logo & Editable Project Title */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleLeftSidebar}
          title="Toggle Navigation / Chapter Drawer (Left Sidebar)"
          className={`p-1.5 rounded text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors ${
            leftSidebarOpen ? 'bg-[#18181b] text-indigo-400' : ''
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shrink-0 shadow-sm">
            <Feather className="w-3.5 h-3.5 text-white" />
          </div>

          {/* Unambiguous Editable Project Title */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#71717a] tracking-wider hidden sm:inline">
              Project:
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
                  className="bg-[#18181b] text-white text-xs md:text-sm font-semibold px-2 py-0.5 rounded border border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-400 hover:bg-[#18181b] rounded"
                  title="Save Title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-1.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#18181b] transition-colors"
                title="Click to Rename Project Title"
              >
                <h1 className="text-xs md:text-sm font-bold tracking-tight text-white truncate max-w-[160px] sm:max-w-[240px]">
                  {settings.seriesTitle || 'Untitled Book Project'}
                </h1>
                <Edit2 className="w-3 h-3 text-[#71717a] group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>

        {/* Book Selector */}
        <div className="hidden md:flex items-center gap-1 ml-2 bg-[#18181b] border border-[#27272a] rounded px-2 py-0.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={selectedBookId}
            onChange={(e) => onSelectBookId(e.target.value)}
            className="bg-transparent text-[#e4e4e7] text-xs py-0.5 px-1 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#09090b] text-[#e4e4e7]">
              All Story Books
            </option>
            {books.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#09090b] text-[#e4e4e7]">
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle & Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white px-2.5 py-1 rounded border border-[#27272a] text-xs transition-colors"
          title="Search Notes & Story Bible (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline font-medium">Quick search...</span>
          <kbd className="hidden lg:inline text-[10px] bg-[#09090b] text-[#71717a] px-1 py-0.5 rounded border border-[#27272a]">
            ⌘K
          </kbd>
        </button>

        {/* New Chapter / Document Button */}
        <button
          onClick={onNewDoc}
          className="hidden sm:flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] px-2.5 py-1 rounded text-xs font-medium border border-[#27272a] transition-colors"
          title="Create New Chapter / Document"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">New Chapter</span>
        </button>

        {/* PWA Ready Badge & Install Button */}
        <div className="flex items-center bg-[#18181b] rounded px-2 py-1 gap-1.5 text-xs border border-[#27272a] shrink-0">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="hidden md:inline text-[11px] text-[#a1a1aa] font-medium">
            {installed ? 'PWA Ready' : isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {!installed && pwaInstallable && (
          <button
            onClick={handlePWAInstall}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors shadow-sm"
            title="Install Writing App"
          >
            Install App
          </button>
        )}

        {/* Database / Backup Menu */}
        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-1.5 rounded text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
            title="Import / Export Data Backup"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#09090b] border border-[#27272a] rounded shadow-2xl p-1.5 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#71717a] border-b border-[#27272a]">
                Data Backup
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#e4e4e7] hover:bg-[#18181b] hover:text-indigo-400 text-left"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Project (.json)</span>
              </button>

              <label className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#e4e4e7] hover:bg-[#18181b] hover:text-indigo-400 text-left cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Import Project (.json)</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>

              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-400 hover:bg-rose-950/40 text-left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Seed Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Story Bible Side Drawer Toggle */}
        <button
          onClick={onToggleRightSidebar}
          title="Toggle Story Bible Reference Drawer (Right Sidebar)"
          className={`p-1.5 rounded text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors ${
            rightSidebarOpen ? 'bg-[#18181b] text-indigo-400' : ''
          }`}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
