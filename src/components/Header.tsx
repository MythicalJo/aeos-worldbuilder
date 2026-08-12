import React, { useState, useEffect } from 'react';
import { Book, WorldSettings } from '../types';
import { canInstallPWA, promptPWAInstall, isAppStandalone } from '../lib/pwa';
import { exportFullDatabase, importFullDatabase, resetToDefaults, DatabaseDump } from '../lib/storage';
import {
  BookOpen,
  Search,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Wifi,
  WifiOff,
  PanelLeft,
  PanelRight,
  Plus,
  Sliders,
  Feather
} from 'lucide-react';

interface HeaderProps {
  settings: WorldSettings;
  books: Book[];
  selectedBookId: string;
  onSelectBookId: (id: string) => void;
  onOpenSearch: () => void;
  onOpenAIAssistant: () => void;
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  onRefreshData: () => void;
  onNewDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  books,
  selectedBookId,
  onSelectBookId,
  onOpenSearch,
  onOpenAIAssistant,
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check PWA install status
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
    a.download = `${settings.seriesTitle.toLowerCase().replace(/\s+/g, '_')}_world_bible.json`;
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
          alert('Worldbuilding database imported successfully!');
        } else {
          alert('Failed to parse database dump.');
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    setShowSettingsMenu(false);
  };

  const handleReset = () => {
    if (confirm('Reset entire worldbuilding bible to default template data? Custom changes will be overwritten.')) {
      resetToDefaults();
      onRefreshData();
      setShowSettingsMenu(false);
    }
  };

  return (
    <header className="h-12 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-3 md:px-4 z-30 shrink-0 select-none">
      {/* Left section: Sidebar toggle, Logo & Title */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleLeftSidebar}
          title="Toggle Entity Database (Left Sidebar)"
          className={`p-1.5 rounded text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors ${
            leftSidebarOpen ? 'bg-[#18181b] text-indigo-400' : ''
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shrink-0 shadow-sm">
            <Feather className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center">
            <h1 className="text-xs md:text-sm font-semibold tracking-tight text-white flex items-center">
              <span>{settings.seriesTitle}</span>
              <span className="hidden sm:inline text-[#71717a] font-normal ml-2 text-xs">
                • Worldbuilding Bible
              </span>
            </h1>
          </div>
        </div>

        {/* Book Filter Dropdown */}
        <div className="hidden sm:flex items-center gap-1 ml-2 bg-[#18181b] border border-[#27272a] rounded px-2 py-0.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={selectedBookId}
            onChange={(e) => onSelectBookId(e.target.value)}
            className="bg-transparent text-[#e4e4e7] text-xs py-0.5 px-1 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#09090b] text-[#e4e4e7]">
              All Books
            </option>
            <option value="Trilogy Book 1" className="bg-[#09090b] text-[#e4e4e7]">
              Trilogy Book 1
            </option>
            <option value="Standalone A" className="bg-[#09090b] text-[#e4e4e7]">
              Standalone A
            </option>
            <option value="Trilogy Book 2" className="bg-[#09090b] text-[#e4e4e7]">
              Trilogy Book 2
            </option>
            <option value="Trilogy Book 3" className="bg-[#09090b] text-[#e4e4e7]">
              Trilogy Book 3
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
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white px-2.5 py-1 rounded border border-[#27272a] text-xs transition-colors"
          title="Search Entities, Notes & Events (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline font-medium">Quick search...</span>
          <kbd className="hidden lg:inline text-[10px] bg-[#09090b] text-[#71717a] px-1 py-0.5 rounded border border-[#27272a]">
            ⌘K
          </kbd>
        </button>

        {/* New Doc Shortcut */}
        <button
          onClick={onNewDoc}
          className="hidden sm:flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] px-2.5 py-1 rounded text-xs font-medium border border-[#27272a] transition-colors"
          title="Create New Note"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">New Note</span>
        </button>

        {/* AI Lore Assistant */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded text-xs font-medium transition-all"
          title="AI Worldbuilding Lore Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="hidden sm:inline">AI Lore</span>
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
            title="Install App on Desktop / Mobile"
          >
            Install App
          </button>
        )}

        {/* Database Settings Menu */}
        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-1.5 rounded text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors"
            title="Database Import / Export / Backup"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#09090b] border border-[#27272a] rounded shadow-2xl p-1.5 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#71717a] border-b border-[#27272a]">
                Database Backup
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#e4e4e7] hover:bg-[#18181b] hover:text-indigo-400 text-left"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Bible (.json)</span>
              </button>

              <label className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[#e4e4e7] hover:bg-[#18181b] hover:text-indigo-400 text-left cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Import Bible (.json)</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>

              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-400 hover:bg-rose-950/40 text-left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar toggle */}
        <button
          onClick={onToggleRightSidebar}
          title="Toggle Chronological Timeline (Right Sidebar)"
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
