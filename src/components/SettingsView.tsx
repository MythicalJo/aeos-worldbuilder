import React, { useState } from 'react';
import { WorldSettings, Book } from '../types';
import {
  Settings,
  BookOpen,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Feather,
  Wand2
} from 'lucide-react';
import { exportWorldBible, importWorldBible, resetToDefaultWorld } from '../lib/storage';

interface SettingsViewProps {
  settings: WorldSettings;
  books: Book[];
  selectedBookId: string;
  onSelectBookId: (id: string) => void;
  onRefreshData: () => void;
  onOpenAIAssistant: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  books,
  selectedBookId,
  onSelectBookId,
  onRefreshData,
  onOpenAIAssistant
}) => {
  const [worldTitle, setWorldTitle] = useState(settings.worldTitle || 'Eldoria Fantasy Series');
  const [authorName, setAuthorName] = useState(settings.authorName || 'Arch-Scribe');
  const [magicSystem, setMagicSystem] = useState(settings.primaryMagicSystem || 'Aether Weaving & Glyph Casting');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Install PWA deferred prompt check
  const [deferredPrompt, setDeferredPrompt] = useState<any>(() => (window as any).deferredPWAInstallPrompt || null);
  const [isInstalled, setIsInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorldSettings = {
      ...settings,
      worldTitle,
      authorName,
      primaryMagicSystem: magicSystem
    };
    localStorage.setItem('lorecraft_settings', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefreshData();
  };

  const handleExportJson = () => {
    exportWorldBible();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonText = event.target?.result as string;
        const ok = importWorldBible(jsonText);
        if (ok) {
          setImportError(null);
          onRefreshData();
          alert('World Bible imported successfully!');
        } else {
          setImportError('Invalid JSON format for World Bible backup.');
        }
      } catch (err) {
        setImportError('Failed to parse World Bible file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all worldbuilding data to initial default demo state?')) {
      resetToDefaultWorld();
      onRefreshData();
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      (window as any).deferredPWAInstallPrompt = null;
      setDeferredPrompt(null);
    } else {
      alert('To install on iOS / Desktop: Tap "Share" or Chrome Menu and choose "Add to Home Screen".');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Settings Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-amber-300 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Series Settings & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure series metadata, manage book filters, backup/restore your World Bible, or install offline PWA.
          </p>
        </div>
        <button
          onClick={onOpenAIAssistant}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI World Assistant</span>
        </button>
      </div>

      {/* Worldbuilding Metadata Form */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-amber-400" />
          Series & World Metadata
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">World / Realm Name</label>
            <input
              type="text"
              value={worldTitle}
              onChange={(e) => setWorldTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Author / Lead Scribe</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-300 text-xs block mb-1">Primary Magic or Technology System</label>
          <input
            type="text"
            value={magicSystem}
            onChange={(e) => setMagicSystem(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            placeholder="e.g. Elemental Runes & Star Casting"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow transition-all"
          >
            Save World Metadata
          </button>
        </div>
      </form>

      {/* Book Scope Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Active Book Scope Filter
        </h3>
        <p className="text-slate-400">
          Filter entities and timeline events by a specific manuscript or view the entire multi-book series.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => onSelectBookId('all')}
            className={`p-2 rounded-lg border text-left transition-all ${
              selectedBookId === 'all'
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="text-xs">All Manuscripts</div>
            <div className="text-[10px] text-slate-400 font-normal mt-0.5">Full Series Scope</div>
          </button>

          {books.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBookId(b.id)}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedBookId === b.id
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs truncate">{b.title}</div>
              <div className="text-[10px] text-slate-400 font-normal mt-0.5">Book {b.volumeNumber}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Restore Data */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Download className="w-4 h-4 text-amber-400" />
          Backup, Export & Restore
        </h3>
        <p className="text-slate-400">
          Export your entire World Bible (Characters, Locations, Factions, Timeline, and Markdown Notes) as a single JSON file.
        </p>

        {importError && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-800/50 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Bible (.json)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 font-medium cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Import Bible (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg border border-rose-800/50 font-medium ml-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* PWA & Mobile Installation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-amber-400" />
          Progressive Web App (PWA) Offline Support
        </h3>
        <p className="text-slate-400 leading-relaxed">
          LoreCraft is built as a PWA and works completely offline once installed. Your data persists locally on your device.
        </p>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="font-semibold text-slate-200">
              {isInstalled ? 'Installed as Native PWA' : 'Ready for Mobile Installation'}
            </span>
          </div>

          {!isInstalled && (
            <button
              onClick={handleInstallPWA}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
