import React, { useState } from 'react';
import { WorldSettings } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { exportFullDatabase, importFullDatabase, resetToDefaults } from '../lib/storage';

interface SettingsViewProps {
  settings: WorldSettings;
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onRefreshData
}) => {
  const { theme } = useTheme();
  const [worldTitle, setWorldTitle] = useState(settings.worldTitle || 'My Fantasy World');
  const [authorName, setAuthorName] = useState(settings.authorName || 'Author');
  const [magicSystem, setMagicSystem] = useState(settings.primaryMagicSystem || 'Elemental Magic');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

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
    const dump = exportFullDatabase();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.seriesTitle.toLowerCase().replace(/\s+/g, '_')}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dump = JSON.parse(event.target?.result as string);
        const ok = importFullDatabase(dump);
        if (ok) {
          setImportError(null);
          onRefreshData();
          alert('Worldbuilder project backup imported successfully!');
        } else {
          setImportError('Invalid JSON format for backup.');
        }
      } catch (err) {
        setImportError('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset project data to template defaults?')) {
      resetToDefaults();
      onRefreshData();
    }
  };

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const containerBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422]'
    : isLight
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#0c0c0e] text-[#e4e4e7]';

  const cardBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1]'
    : 'bg-[#09090b] border-[#27272a]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <div className={`flex-1 ${containerBg} overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full select-none`}>
      {/* Settings Header */}
      <div className="border-b pb-4 opacity-80">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <Settings className={`w-5 h-5 ${accentColor}`} />
          <span>Project Settings & Worldbuilder Metadata</span>
        </h2>
        <p className="text-xs opacity-70 mt-1">
          Configure book project metadata, backup/restore Worldbuilder data, or verify offline PWA installation.
        </p>
      </div>

      {/* Story & Author Metadata Form */}
      <form onSubmit={handleSaveSettings} className={`${cardBg} border rounded-xl p-4 space-y-4 shadow-lg`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-1.5`}>
          <Globe className={`w-4 h-4 ${accentColor}`} />
          Story & Setting Metadata
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Realm / Setting Name</label>
            <input
              type="text"
              value={worldTitle}
              onChange={(e) => setWorldTitle(e.target.value)}
              className="w-full bg-black/10 border border-current/20 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Author Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-black/10 border border-current/20 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-xs block mb-1">Primary Magic or Tech System</label>
          <input
            type="text"
            value={magicSystem}
            onChange={(e) => setMagicSystem(e.target.value)}
            className="w-full bg-black/10 border border-current/20 p-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Glyph Magic"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-emerald-500 text-xs flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow transition-all"
          >
            Save Metadata
          </button>
        </div>
      </form>

      {/* Backup & Restore Data */}
      <div className={`${cardBg} border rounded-xl p-4 space-y-4 shadow-lg text-xs`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-1.5`}>
          <Download className={`w-4 h-4 ${accentColor}`} />
          Backup, Export & Restore Worldbuilder Data
        </h3>
        <p className="opacity-70">
          Export your entire project (Manuscript Chapters, Characters, Locations, Factions, Timeline) as a single JSON backup.
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export Worldbuilder (.json)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-black/10 hover:bg-black/20 border border-current/20 rounded-lg font-bold cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-sky-500" />
            <span>Import Backup (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg border border-rose-800/50 font-bold ml-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* PWA & Mobile Installation */}
      <div className={`${cardBg} border rounded-xl p-4 space-y-3 shadow-lg text-xs`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${accentColor} flex items-center gap-1.5`}>
          <Smartphone className={`w-4 h-4 ${accentColor}`} />
          Progressive Web App (PWA) Offline Support
        </h3>
        <p className="opacity-70 leading-relaxed">
          This writing app is built as a PWA and works completely offline once installed. Your data persists locally in IndexedDB.
        </p>

        <div className="flex items-center justify-between bg-black/10 p-3 rounded-lg border border-current/20 mt-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
            <span className="font-bold">
              {isInstalled ? 'Installed as Native PWA' : 'Ready for PWA Installation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
