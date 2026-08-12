import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MarkdownDoc, Character, Location, Faction } from '../types';
import { parseWikiLinksToHTML } from '../lib/wikiParser';
import { useLoreContext } from '../context/LoreContext';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import {
  Edit3,
  Eye,
  Columns,
  X,
  Plus,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
  Link as LinkIcon,
  Download,
  CheckCircle2,
  FileText,
  Tag,
  Type,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Trash2
} from 'lucide-react';

interface CenterCanvasProps {
  docs: MarkdownDoc[];
  activeDocId: string;
  openDocIds: string[];
  characters: Character[];
  locations: Location[];
  factions: Faction[];
  onSelectDoc: (id: string) => void;
  onCloseDocTab: (id: string) => void;
  onDeleteDoc?: (id: string) => void;
  onNewDoc: () => void;
  onUpdateDoc: (updatedDoc: MarkdownDoc) => void;
  onOpenEntityDetail: (type: 'character' | 'location' | 'faction', id: string) => void;
}

export const CenterCanvas: React.FC<CenterCanvasProps> = ({
  docs,
  activeDocId,
  openDocIds,
  characters,
  locations,
  factions,
  onSelectDoc,
  onCloseDocTab,
  onDeleteDoc,
  onNewDoc,
  onUpdateDoc,
  onOpenEntityDetail
}) => {
  const { theme } = useTheme();
  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [content, setContent] = useState<string>(activeDoc?.content || '');
  const [title, setTitle] = useState<string>(activeDoc?.title || '');
  const [category, setCategory] = useState<MarkdownDoc['category']>(activeDoc?.category || 'Lore');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(activeDoc?.tags || []);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showLinkDropdown, setShowLinkDropdown] = useState<boolean>(false);

  // Typography & Focus Mode
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Undo / Redo History Stack
  const historyRef = useRef<string[]>([activeDoc?.content || '']);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const linkDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(linkDropdownRef, () => setShowLinkDropdown(false), showLinkDropdown);

  const updateUndoRedoState = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const pushHistory = useCallback((newContent: string) => {
    if (historyRef.current[historyIndexRef.current] === newContent) return;
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(newContent);
    if (nextHistory.length > 50) nextHistory.shift();
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    updateUndoRedoState();
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevContent = historyRef.current[historyIndexRef.current];
      setContent(prevContent);
      updateUndoRedoState();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextContent = historyRef.current[historyIndexRef.current];
      setContent(nextContent);
      updateUndoRedoState();
    }
  }, []);

  // Sync internal state when activeDoc changes
  useEffect(() => {
    if (activeDoc) {
      setContent(activeDoc.content);
      setTitle(activeDoc.title);
      setCategory(activeDoc.category);
      setTags(activeDoc.tags);
      historyRef.current = [activeDoc.content];
      historyIndexRef.current = 0;
      updateUndoRedoState();
    }
  }, [activeDocId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else {
        e.preventDefault();
        handleUndo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
    }
  };

  // Auto-save & history snapshot
  useEffect(() => {
    if (!activeDoc) return;
    setIsSaving(true);
    const timer = setTimeout(() => {
      const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
      onUpdateDoc({
        ...activeDoc,
        title,
        category,
        content,
        tags,
        updatedAt: new Date().toISOString().split('T')[0],
        wordCount
      });
      setIsSaving(false);
      pushHistory(content);
    }, 600);

    return () => clearTimeout(timer);
  }, [content, title, category, tags]);

  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      prefix +
      (selectedText || 'text') +
      suffix +
      content.substring(end);

    setContent(newText);
    pushHistory(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length + (selectedText ? 0 : 4)
      );
    }, 50);
  };

  const handleInsertLink = (name: string) => {
    const linkSyntax = `[[${name}]]`;
    insertTextAtCursor(linkSyntax);
    setShowLinkDropdown(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const { navigateToCharacter, navigateToLocation, navigateToFaction } = useLoreContext();

  const renderFormattedMarkdown = (rawMarkdown: string) => {
    return parseWikiLinksToHTML(rawMarkdown, characters, locations, factions);
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const wikiBadge = target.closest('.wiki-link') as HTMLElement;
    if (wikiBadge) {
      const type = wikiBadge.getAttribute('data-type') as 'character' | 'location' | 'faction';
      const id = wikiBadge.getAttribute('data-id');
      const name = wikiBadge.getAttribute('data-name');

      if (id) {
        if (type === 'character') navigateToCharacter(id);
        else if (type === 'location') navigateToLocation(id);
        else if (type === 'faction') navigateToFaction(id);
        else onOpenEntityDetail(type || 'character', id);
        return;
      }

      if (name) {
        const foundChar = characters.find(
          (c) => c.name.toLowerCase() === name.toLowerCase() || c.name.toLowerCase().includes(name.toLowerCase())
        );
        if (foundChar) {
          navigateToCharacter(foundChar.id);
          return;
        }

        const foundLoc = locations.find((l) => l.name.toLowerCase() === name.toLowerCase());
        if (foundLoc) {
          navigateToLocation(foundLoc.id);
          return;
        }

        const foundFac = factions.find((f) => f.name.toLowerCase() === name.toLowerCase());
        if (foundFac) {
          navigateToFaction(foundFac.id);
          return;
        }
      }
    }
  };

  const fontStyleClass =
    fontFamily === 'serif'
      ? 'font-serif'
      : fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const containerBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422]'
    : isLight
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#0c0c0e] text-[#e4e4e7]';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#e2e8f0]'
    : 'bg-[#09090b] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090] text-[#433422]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1] text-[#0f172a]'
    : 'bg-[#18181b] border-[#27272a] text-[#e4e4e7]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  if (!activeDoc) {
    return (
      <main className={`flex-1 ${containerBg} flex items-center justify-center p-6 select-none`}>
        <div className="text-center space-y-3">
          <FileText className="w-12 h-12 opacity-40 mx-auto" />
          <h3 className="text-base font-semibold">No Chapter / Document Selected</h3>
          <p className="text-xs opacity-70">
            Select a manuscript chapter or reference note from the sidebar.
          </p>
          <button
            onClick={onNewDoc}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded transition-colors shadow"
          >
            Create New Chapter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 ${containerBg} flex flex-col h-full min-w-0 overflow-hidden`}>
      {/* Document Tabs Bar */}
      {!isFocusMode && (
        <div className={`h-10 ${headerBg} border-b flex items-center px-2 gap-1 overflow-x-auto shrink-0 no-scrollbar`}>
          {openDocIds.map((id) => {
            const docItem = docs.find((d) => d.id === id);
            if (!docItem) return null;
            const isActive = id === activeDocId;

            return (
              <div
                key={id}
                onClick={() => onSelectDoc(id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t border-t border-x text-xs cursor-pointer transition-all shrink-0 select-none ${
                  isActive
                    ? `${containerBg} border-current/20 ${accentColor} font-bold shadow-sm`
                    : 'opacity-70 hover:opacity-100 hover:bg-black/10'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${accentColor}`} />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">{docItem.title}</span>
                {openDocIds.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseDocTab(id);
                    }}
                    className="p-0.5 rounded hover:bg-black/10 transition-colors opacity-60 hover:opacity-100"
                    title="Close Tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={onNewDoc}
            className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors shrink-0 ml-1"
            title="New Document Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Control Bar */}
      {!isFocusMode && (
        <div className={`${headerBg} border-b p-2 flex flex-wrap items-center justify-between gap-2 shrink-0`}>
          {/* Title Input & Category */}
          <div className="flex flex-1 items-center gap-2 min-w-[240px]">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-sm md:text-base focus:outline-none border-b border-transparent focus:border-indigo-500 px-1 py-0.5 flex-1"
              placeholder="Chapter / Document Title..."
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MarkdownDoc['category'])}
              className={`${cardBg} text-xs rounded px-2 py-1 focus:outline-none cursor-pointer border`}
            >
              <option value="Chapter Draft">Chapter Draft</option>
              <option value="Lore">Lore & World</option>
              <option value="Character Profile">Character Profile</option>
              <option value="Location Atlas">Location Atlas</option>
              <option value="Magic System">Magic System</option>
              <option value="Rules & Notes">Rules & Notes</option>
            </select>
          </div>

          {/* View Mode & Delete Chapter Controls */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${cardBg} p-0.5 rounded border text-xs`}>
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'edit'
                    ? `${containerBg} ${accentColor} font-bold shadow-sm`
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Editor Write Mode"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>

              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'split'
                    ? `${containerBg} ${accentColor} font-bold shadow-sm`
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Split Write & Preview"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>

              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'preview'
                    ? `${containerBg} ${accentColor} font-bold shadow-sm`
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Reading Preview Mode"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read</span>
              </button>
            </div>

            {onDeleteDoc && (
              <button
                onClick={() => onDeleteDoc(activeDocId)}
                className={`p-1.5 rounded border ${cardBg} opacity-70 hover:opacity-100 hover:text-rose-500 transition-colors`}
                title="Delete Chapter Draft"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Formatting, Undo/Redo & Typography Toolbar */}
      {!isFocusMode && viewMode !== 'preview' && (
        <div className={`${headerBg} border-b px-3 py-1 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs`}>
          <div className="flex items-center gap-1 flex-wrap">
            {/* Undo / Redo */}
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-1 rounded transition-opacity ${
                canUndo ? 'hover:bg-black/10 opacity-90' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-1 rounded transition-opacity ${
                canRedo ? 'hover:bg-black/10 opacity-90' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 opacity-30 bg-current mx-1" />

            {/* Font Family Selector */}
            <div className={`flex items-center gap-1 ${cardBg} border rounded px-2 py-0.5 text-xs`}>
              <Type className={`w-3.5 h-3.5 ${accentColor} shrink-0`} />
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="bg-transparent text-xs py-0.5 focus:outline-none cursor-pointer font-medium"
              >
                <option value="serif">Serif (Georgia)</option>
                <option value="sans">Sans-Serif (Inter)</option>
                <option value="mono">Monospace (Courier)</option>
              </select>
            </div>

            {/* Font Size Selector */}
            <div className={`flex items-center gap-1 ${cardBg} border rounded px-2 py-0.5 text-xs`}>
              <span className="opacity-70 text-[11px] font-bold">Size:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-transparent text-xs py-0.5 focus:outline-none cursor-pointer font-mono font-bold"
              >
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
                <option value={22}>22px</option>
                <option value={24}>24px</option>
              </select>
            </div>

            <div className="w-px h-4 opacity-30 bg-current mx-1 hidden sm:block" />

            {/* Formatting Controls */}
            <button
              onClick={() => insertTextAtCursor('**', '**')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('*', '*')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('# ')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('## ')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('- ')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('> ')}
              className="p-1 rounded hover:bg-black/10 opacity-80 hover:opacity-100"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 opacity-30 bg-current mx-1" />

            {/* Link Inserter */}
            <div className="relative" ref={linkDropdownRef}>
              <button
                onClick={() => setShowLinkDropdown(!showLinkDropdown)}
                className={`flex items-center gap-1 px-2.5 py-0.5 ${cardBg} border ${accentColor} font-semibold rounded text-xs transition-colors`}
                title="Insert Reference Link to Character or Place"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Insert Link</span>
              </button>

              {showLinkDropdown && (
                <div className={`absolute left-0 mt-1 w-64 ${headerBg} border rounded shadow-2xl p-2 z-50 text-xs space-y-2 max-h-72 overflow-y-auto`}>
                  <div className="text-[10px] uppercase font-bold opacity-60 border-b pb-1">
                    Insert Reference Link
                  </div>

                  <div>
                    <div className={`font-bold ${accentColor} text-[10px] mb-1`}>People / Characters</div>
                    {characters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleInsertLink(c.name)}
                        className="w-full text-left py-1 px-2 hover:bg-black/10 rounded truncate"
                      >
                        [[{c.name}]]
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="font-bold text-sky-500 text-[10px] mb-1">Places / Locations</div>
                    {locations.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleInsertLink(l.name)}
                        className="w-full text-left py-1 px-2 hover:bg-black/10 rounded truncate"
                      >
                        [[{l.name}]]
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="flex items-center gap-1 opacity-80 hover:opacity-100 px-2 py-0.5 rounded hover:bg-black/10 transition-colors"
              title="Distraction-Free Focus Writing Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Focus</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1 opacity-70 hover:opacity-100 px-2 py-0.5 rounded hover:bg-black/10 transition-colors"
              title="Export as Markdown File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .md</span>
            </button>
          </div>
        </div>
      )}

      {/* Focus Mode Exit Bar */}
      {isFocusMode && (
        <div className={`${headerBg} border-b px-4 py-1.5 flex items-center justify-between text-xs shrink-0`}>
          <span className={`${accentColor} font-bold flex items-center gap-1.5`}>
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Focus Mode Active — Writing {title}</span>
          </span>
          <button
            onClick={() => setIsFocusMode(false)}
            className={`flex items-center gap-1 px-2.5 py-0.5 ${cardBg} border rounded transition-colors font-medium`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Focus</span>
          </button>
        </div>
      )}

      {/* Main Workspace Writing Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* EDIT PANE */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col p-4 md:p-8 ${
              viewMode === 'split' ? 'w-1/2 border-r border-current/15' : 'w-full max-w-4xl mx-auto'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Begin writing your manuscript chapter..."
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full h-full bg-transparent ${fontStyleClass} leading-relaxed resize-none focus:outline-none p-2 border-none`}
            />
          </div>
        )}

        {/* PREVIEW PANE */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            onClick={handlePreviewClick}
            style={{ fontSize: `${fontSize}px` }}
            className={`h-full overflow-y-auto p-4 md:p-8 ${
              viewMode === 'split' ? 'w-1/2' : 'w-full max-w-4xl mx-auto'
            } ${fontStyleClass} prose ${
              isSepia ? 'prose-amber text-[#433422]' : isLight ? 'prose-slate text-[#0f172a]' : 'prose-invert text-[#e4e4e7]'
            } prose-headings:font-bold prose-p:leading-relaxed`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: renderFormattedMarkdown(content || '_No content written yet._')
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      {!isFocusMode && (
        <div className={`h-6 ${headerBg} border-t px-3 flex items-center justify-between text-[10px] opacity-80 shrink-0`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2
                className={`w-3 h-3 ${isSaving ? `${accentColor} animate-spin` : 'text-emerald-500'}`}
              />
              <span>{isSaving ? 'Saving...' : 'Saved locally'}</span>
            </span>
            <span>•</span>
            <span className="font-bold">
              {activeDoc.wordCount || 0} words ({content.length} chars)
            </span>
          </div>

          {/* Tags Bar */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-xs">
            <Tag className="w-3 h-3 opacity-60" />
            {tags.map((t) => (
              <span
                key={t}
                className={`${cardBg} border px-1.5 py-0.2 rounded text-[10px] flex items-center gap-1`}
              >
                #{t}
                <button onClick={() => handleRemoveTag(t)} className="hover:text-rose-500">
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              placeholder="+ tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-transparent text-[10px] focus:outline-none w-14 opacity-70"
            />
          </div>
        </div>
      )}
    </main>
  );
};
