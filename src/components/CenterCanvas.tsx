import React, { useState, useEffect, useRef } from 'react';
import { MarkdownDoc, Character, Location, Faction } from '../types';
import { marked } from 'marked';
import { parseWikiLinksToHTML } from '../lib/wikiParser';
import { useLoreContext } from '../context/LoreContext';
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
  ListOrdered,
  Quote,
  Code,
  Link,
  Download,
  CheckCircle2,
  Sparkles,
  FileText,
  Tag,
  Hash
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
  onNewDoc,
  onUpdateDoc,
  onOpenEntityDetail
}) => {
  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [content, setContent] = useState<string>(activeDoc?.content || '');
  const [title, setTitle] = useState<string>(activeDoc?.title || '');
  const [category, setCategory] = useState<MarkdownDoc['category']>(activeDoc?.category || 'Lore');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(activeDoc?.tags || []);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showEntityDropdown, setShowEntityDropdown] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal state when activeDoc changes
  useEffect(() => {
    if (activeDoc) {
      setContent(activeDoc.content);
      setTitle(activeDoc.title);
      setCategory(activeDoc.category);
      setTags(activeDoc.tags);
    }
  }, [activeDocId]);

  // Debounced auto-save
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
    }, 600);

    return () => clearTimeout(timer);
  }, [content, title, category, tags]);

  // Handle formatting tools
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
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length + (selectedText ? 0 : 4)
      );
    }, 50);
  };

  const handleInsertEntityLink = (name: string, type: string) => {
    const linkSyntax = `[[${type.charAt(0).toUpperCase() + type.slice(1)}: ${name}]]`;
    insertTextAtCursor(linkSyntax);
    setShowEntityDropdown(false);
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

  // Process markdown HTML with custom entity wiki links rendering
  const renderFormattedMarkdown = (rawMarkdown: string) => {
    return parseWikiLinksToHTML(rawMarkdown, characters, locations, factions);
  };

  // Intercept clicks on wiki links inside preview
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

  if (!activeDoc) {
    return (
      <main className="flex-1 bg-[#0c0c0e] flex items-center justify-center p-6 text-[#71717a]">
        <div className="text-center space-y-3">
          <FileText className="w-12 h-12 text-[#27272a] mx-auto" />
          <h3 className="text-base font-semibold text-[#e4e4e7]">No Document Selected</h3>
          <p className="text-xs text-[#71717a]">
            Select a note from the left database sidebar or create a new lore document.
          </p>
          <button
            onClick={onNewDoc}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded transition-colors"
          >
            Create New Note
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#0c0c0e] flex flex-col h-full min-w-0 overflow-hidden text-[#e4e4e7]">
      {/* Document Tabs Bar */}
      <div className="h-10 bg-[#09090b] border-b border-[#27272a] flex items-center px-2 gap-1 overflow-x-auto shrink-0 no-scrollbar">
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
                  ? 'bg-[#0c0c0e] border-[#27272a] text-indigo-400 font-medium shadow-sm'
                  : 'bg-[#09090b] border-transparent text-[#71717a] hover:bg-[#18181b] hover:text-[#e4e4e7]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="truncate max-w-[120px] sm:max-w-[180px]">{docItem.title}</span>
              {openDocIds.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseDocTab(id);
                  }}
                  className="p-0.5 rounded hover:bg-[#27272a] text-[#71717a] hover:text-white transition-colors"
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
          className="p-1 rounded text-[#71717a] hover:text-indigo-400 hover:bg-[#18181b] transition-colors shrink-0 ml-1"
          title="New Note Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Header & Control Bar */}
      <div className="bg-[#09090b]/80 border-b border-[#27272a] p-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Title Input & Category */}
        <div className="flex flex-1 items-center gap-2 min-w-[240px]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent font-semibold text-sm md:text-base text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1 py-0.5 flex-1"
            placeholder="Document Title..."
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MarkdownDoc['category'])}
            className="bg-[#18181b] border border-[#27272a] text-xs text-[#e4e4e7] rounded px-2 py-1 focus:outline-none"
          >
            <option value="Lore">Lore</option>
            <option value="Magic System">Magic System</option>
            <option value="Character Profile">Character Profile</option>
            <option value="Location Atlas">Location Atlas</option>
            <option value="Chapter Draft">Chapter Draft</option>
            <option value="Rules & Notes">Rules & Notes</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              viewMode === 'edit'
                ? 'bg-[#09090b] text-indigo-400 font-medium border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Edit Mode Only"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Write</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              viewMode === 'split'
                ? 'bg-[#09090b] text-indigo-400 font-medium border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Split Edit & Preview Mode"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-[#09090b] text-indigo-400 font-medium border border-[#27272a]'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
            }`}
            title="Reading Preview Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Visible in Edit & Split modes) */}
      {viewMode !== 'preview' && (
        <div className="bg-[#09090b]/40 border-b border-[#27272a] px-3 py-1 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertTextAtCursor('**', '**')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('*', '*')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[#27272a] mx-1" />

            <button
              onClick={() => insertTextAtCursor('# ')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('## ')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[#27272a] mx-1" />

            <button
              onClick={() => insertTextAtCursor('- ')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('1. ')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('> ')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertTextAtCursor('`', '`')}
              className="p-1 rounded hover:bg-[#18181b] text-[#a1a1aa] hover:text-white"
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-[#27272a] mx-1" />

            {/* Quick Entity Wiki Link Inserter */}
            <div className="relative">
              <button
                onClick={() => setShowEntityDropdown(!showEntityDropdown)}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#18181b] hover:bg-[#27272a] text-indigo-400 border border-[#27272a] rounded text-xs transition-colors"
                title="Insert Link to Character or Location"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Link Entity</span>
              </button>

              {showEntityDropdown && (
                <div className="absolute left-0 mt-1 w-64 bg-[#09090b] border border-[#27272a] rounded shadow-2xl p-2 z-50 text-xs space-y-2 max-h-72 overflow-y-auto">
                  <div className="text-[10px] uppercase font-bold text-[#71717a] border-b border-[#27272a] pb-1">
                    Insert Entity Wiki Link
                  </div>

                  <div>
                    <div className="font-bold text-indigo-400 text-[10px] mb-1">Characters</div>
                    {characters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleInsertEntityLink(c.name, 'character')}
                        className="w-full text-left py-1 px-2 hover:bg-[#18181b] rounded text-[#e4e4e7] truncate"
                      >
                        [[Character: {c.name}]]
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="font-bold text-sky-400 text-[10px] mb-1">Locations</div>
                    {locations.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleInsertEntityLink(l.name, 'location')}
                        className="w-full text-left py-1 px-2 hover:bg-[#18181b] rounded text-[#e4e4e7] truncate"
                      >
                        [[Location: {l.name}]]
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1 text-[#71717a] hover:text-white px-2 py-0.5 rounded hover:bg-[#18181b] transition-colors"
            title="Export as Markdown File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </button>
        </div>
      )}

      {/* Main Workspace Area (Edit / Preview / Split) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* EDIT PANE */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={`flex-1 flex flex-col h-full bg-[#0c0c0e] p-3 ${
              viewMode === 'split' ? 'border-r border-[#27272a]' : ''
            }`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your lore note, chapter outline, or magic rules in Markdown..."
              className="w-full h-full bg-transparent text-[#e4e4e7] font-mono text-xs md:text-sm leading-relaxed resize-none focus:outline-none p-1 selection:bg-indigo-600/30 selection:text-indigo-200"
            />
          </div>
        )}

        {/* PREVIEW PANE */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            onClick={handlePreviewClick}
            className="flex-1 h-full overflow-y-auto bg-[#0c0c0e] p-5 prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-indigo-400 prose-p:text-[#e4e4e7] prose-p:leading-relaxed prose-a:text-indigo-400 prose-blockquote:border-l-indigo-600 prose-blockquote:bg-[#18181b]/50 prose-blockquote:p-3 prose-blockquote:rounded-r"
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
      <div className="h-6 bg-[#09090b] border-t border-[#27272a] px-3 flex items-center justify-between text-[10px] text-[#71717a] shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2
              className={`w-3 h-3 ${isSaving ? 'text-indigo-400 animate-spin' : 'text-green-500'}`}
            />
            <span>{isSaving ? 'Saving...' : 'Saved locally'}</span>
          </span>
          <span>•</span>
          <span>
            {activeDoc.wordCount || 0} words ({content.length} chars)
          </span>
        </div>

        {/* Tags Bar */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-xs">
          <Tag className="w-3 h-3 text-[#71717a]" />
          {tags.map((t) => (
            <span
              key={t}
              className="bg-[#18181b] text-[#e4e4e7] border border-[#27272a] px-1.5 py-0.2 rounded text-[10px] flex items-center gap-1"
            >
              #{t}
              <button
                onClick={() => handleRemoveTag(t)}
                className="hover:text-rose-400"
              >
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
            className="bg-transparent text-[10px] text-[#e4e4e7] focus:outline-none w-14 placeholder-[#71717a]"
          />
        </div>
      </div>
    </main>
  );
};
