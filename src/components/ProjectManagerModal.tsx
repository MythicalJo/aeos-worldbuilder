import React, { useState, useRef } from 'react';
import { Book, Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { ConfirmationModal } from './ConfirmationModal';
import {
  BookOpen,
  Plus,
  Trash2,
  X,
  Feather,
  FolderPlus,
  Folder,
  Link as LinkIcon,
  Unlink,
  Check,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProject: Project | null;
  books: Book[];
  selectedBookId: string;
  onSelectProject: (projectId: string) => void;
  onSelectBook: (bookId: string) => void;
  onCreateProject: (title: string, description: string, authorName: string) => void;
  onCreateBook: (projectId: string, title: string, description: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteBook: (bookId: string) => void;
  onToggleLinkProjects: (projectAId: string, projectBId: string) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProject,
  books,
  selectedBookId,
  onSelectProject,
  onSelectBook,
  onCreateProject,
  onCreateBook,
  onDeleteProject,
  onDeleteBook,
  onToggleLinkProjects
}) => {
  const { theme, getAccentClasses } = useTheme();
  const accentClasses = getAccentClasses();
  const modalRef = useRef<HTMLDivElement>(null);

  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(activeProject?.id || projects[0]?.id || null);

  // Forms state
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [authorName, setAuthorName] = useState('');

  const [isCreatingBook, setIsCreatingBook] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');

  // Confirmation Modal State
  const [confirmDeleteState, setConfirmDeleteState] = useState<{
    type: 'project' | 'book';
    id: string;
    title: string;
  } | null>(null);

  useOutsideClick(modalRef, onClose, isOpen && !confirmDeleteState);

  if (!isOpen) return null;

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    onCreateProject(projTitle.trim(), projDesc.trim() || 'Story World Project', authorName.trim() || 'Author');
    setProjTitle('');
    setProjDesc('');
    setAuthorName('');
    setIsCreatingProject(false);
  };

  const handleBookSubmit = (e: React.FormEvent, projectId: string) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;
    onCreateBook(projectId, bookTitle.trim(), bookDesc.trim() || 'Novel Volume');
    setBookTitle('');
    setBookDesc('');
    setIsCreatingBook(null);
  };

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const modalBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] text-[#0f172a] border-[#e2e8f0]'
    : 'bg-[#09090b] text-[#e4e4e7] border-[#27272a]';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1]'
    : 'bg-[#0c0c0e] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090]'
    : isLight
    ? 'bg-[#f8fafc] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full max-w-2xl ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b ${headerBg} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${accentClasses.bg} flex items-center justify-center text-white shadow`}>
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Projects & Books Manager</h3>
              <p className="text-xs opacity-70">
                Projects hold world data; Books hold chapters. Link projects to share Worldbuilders!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px] opacity-60">
              Story Projects ({projects.length})
            </span>

            <button
              onClick={() => setIsCreatingProject(true)}
              className={`flex items-center gap-1 ${accentClasses.bg} text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New Project</span>
            </button>
          </div>

          {/* New Project Form */}
          {isCreatingProject && (
            <form onSubmit={handleProjectSubmit} className={`p-4 ${cardBg} border rounded-xl space-y-3`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${accentClasses.text} flex items-center gap-1.5`}>
                <FolderPlus className="w-4 h-4" />
                Create New Story World Project
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Aethelgard Realm"
                    required
                    autoFocus
                    className={`w-full ${cardBg} border p-2 rounded-lg text-xs font-bold focus:outline-none focus:border-indigo-500`}
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. J.R. Vance"
                    className={`w-full ${cardBg} border p-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Project World Description</label>
                <input
                  type="text"
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="e.g. High fantasy realm container"
                  className={`w-full ${cardBg} border p-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-3 py-1.5 opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 ${accentClasses.bg} text-white font-bold rounded-lg shadow`}
                >
                  Create Project
                </button>
              </div>
            </form>
          )}

          {/* Projects & Associated Books List */}
          <div className="space-y-3">
            {projects.map((proj) => {
              const isActiveProj = activeProject?.id === proj.id;
              const isExpanded = expandedProjectId === proj.id;
              const projBooks = books.filter((b) => b.projectId === proj.id);

              return (
                <div
                  key={proj.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isActiveProj ? `${cardBg} border-indigo-500 shadow-md ring-1 ring-indigo-500/40` : `${cardBg} opacity-90 hover:opacity-100`
                  }`}
                >
                  {/* Project Container Bar */}
                  <div className="p-3.5 flex items-center justify-between gap-3 border-b border-current/10">
                    <div
                      onClick={() => {
                        onSelectProject(proj.id);
                        setExpandedProjectId(isExpanded ? null : proj.id);
                      }}
                      className="flex-1 min-w-0 cursor-pointer flex items-center gap-3"
                    >
                      <Folder className={`w-5 h-5 shrink-0 ${isActiveProj ? accentClasses.text : 'opacity-60'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm truncate">{proj.title}</h4>
                          {isActiveProj && (
                            <span className={`text-[9px] uppercase font-bold ${accentClasses.bg} text-white px-2 py-0.2 rounded-full`}>
                              Active Project
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-70 truncate mt-0.5">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Project Link Status Badge */}
                      {proj.linkedProjectIds && proj.linkedProjectIds.length > 0 && (
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          <span>Shared Worldbuilder</span>
                        </span>
                      )}

                      <button
                        onClick={() => {
                          onSelectProject(proj.id);
                          onClose();
                        }}
                        className={`px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow`}
                      >
                        Open
                      </button>

                      {projects.length > 1 && (
                        <button
                          onClick={() => setConfirmDeleteState({ type: 'project', id: proj.id, title: proj.title })}
                          className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:text-rose-500 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                        className="p-1 rounded opacity-60 hover:opacity-100"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Books & Interlinking Options */}
                  {isExpanded && (
                    <div className="p-3 bg-black/5 space-y-2 border-t">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
                        <span>Books in {proj.title} ({projBooks.length})</span>
                        <button
                          onClick={() => setIsCreatingBook(proj.id)}
                          className="text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Book to Project
                        </button>
                      </div>

                      {/* Create Book Inline Form */}
                      {isCreatingBook === proj.id && (
                        <form onSubmit={(e) => handleBookSubmit(e, proj.id)} className={`p-3 ${cardBg} border rounded-xl space-y-2`}>
                          <input
                            type="text"
                            placeholder="Book Title (e.g. Volume I: The Fall)"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            required
                            autoFocus
                            className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs font-bold focus:outline-none`}
                          />
                          <input
                            type="text"
                            placeholder="Subtitle / Description"
                            value={bookDesc}
                            onChange={(e) => setBookDesc(e.target.value)}
                            className={`w-full ${cardBg} border p-1.5 rounded-lg text-xs focus:outline-none`}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setIsCreatingBook(null)}
                              className="px-2.5 py-1 text-xs opacity-70"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-xs shadow"
                            >
                              Save Book
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Books List inside Project */}
                      {projBooks.map((b) => {
                        const isSelectedBook = selectedBookId === b.id;

                        return (
                          <div
                            key={b.id}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                              isSelectedBook ? `${cardBg} border-indigo-500 font-bold shadow-sm` : `${cardBg} opacity-80 hover:opacity-100`
                            }`}
                          >
                            <div
                              onClick={() => {
                                onSelectProject(proj.id);
                                onSelectBook(b.id);
                                onClose();
                              }}
                              className="flex-1 min-w-0 cursor-pointer flex items-center gap-2"
                            >
                              <BookOpen className={`w-3.5 h-3.5 ${isSelectedBook ? accentClasses.text : 'opacity-60'}`} />
                              <span className="truncate">{b.title}</span>
                              {isSelectedBook && (
                                <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-mono">Active</span>
                              )}
                            </div>

                            <button
                              onClick={() => setConfirmDeleteState({ type: 'book', id: b.id, title: b.title })}
                              className="p-1 rounded opacity-50 hover:opacity-100 hover:text-rose-500 transition-opacity"
                              title="Delete Book"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Interlink Worldbuilder Section */}
                      <div className="pt-2 border-t mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                          Shared Worldbuilder Interlinking
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {projects
                            .filter((other) => other.id !== proj.id)
                            .map((other) => {
                              const isLinked = proj.linkedProjectIds?.includes(other.id);

                              return (
                                <button
                                  key={other.id}
                                  onClick={() => onToggleLinkProjects(proj.id, other.id)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                                    isLinked
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                      : `${cardBg} opacity-70 hover:opacity-100`
                                  }`}
                                >
                                  {isLinked ? <Unlink className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                                  <span>{isLinked ? `Unlink ${other.title}` : `Link with ${other.title}`}</span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* In-App Deletion Confirmation Modal */}
      {confirmDeleteState && (
        <ConfirmationModal
          isOpen={confirmDeleteState !== null}
          onClose={() => setConfirmDeleteState(null)}
          title={`Delete ${confirmDeleteState.type === 'project' ? 'Project' : 'Book'}?`}
          message={`Are you sure you want to permanently delete "${confirmDeleteState.title}"? This will remove its associated data.`}
          confirmText="Permanently Delete"
          onConfirm={() => {
            if (confirmDeleteState.type === 'project') onDeleteProject(confirmDeleteState.id);
            else onDeleteBook(confirmDeleteState.id);
            setConfirmDeleteState(null);
          }}
        />
      )}
    </div>
  );
};
