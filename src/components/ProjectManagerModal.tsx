import React, { useState, useRef } from 'react';
import { Book } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { BookOpen, Plus, Trash2, Check, X, Feather, FolderPlus } from 'lucide-react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  selectedBookId: string;
  onSelectBook: (id: string) => void;
  onCreateBook: (title: string, description: string) => void;
  onDeleteBook: (id: string) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  books,
  selectedBookId,
  onSelectBook,
  onCreateBook,
  onDeleteBook
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useOutsideClick(modalRef, onClose, isOpen);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateBook(newTitle.trim(), newDesc.trim() || 'Book Project');
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const modalBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] text-[#0f172a] border-[#e2e8f0]'
    : 'bg-[#09090b] text-[#e4e4e7] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f8fafc] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div
        ref={modalRef}
        className={`w-full max-w-xl ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
      >
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Book Projects & Manuscripts</h3>
              <p className="text-xs opacity-70">Manage, switch, or start a new book project</p>
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
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Projects List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-60">
              <span>All Story Books & Projects</span>
              <span>{books.length} Projects</span>
            </div>

            {books.map((b) => {
              const isActive = selectedBookId === b.id;
              const isConfirmingDelete = deleteConfirmId === b.id;

              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? `${cardBg} border-indigo-500 ring-1 ring-indigo-500/50 shadow-md`
                      : `${cardBg} opacity-90 hover:opacity-100`
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectBook(b.id);
                      onClose();
                    }}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500 font-bold' : 'opacity-60'}`}
                      />
                      <h4 className="font-bold text-sm truncate">{b.title}</h4>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                          Active Project
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-70 mt-1 truncate">
                      {b.description || `Volume ${b.volumeNumber}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectBook(b.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow"
                      >
                        Open
                      </button>
                    )}

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteBook(b.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 rounded opacity-70 hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      books.length > 1 && (
                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:text-rose-500 hover:bg-rose-950/20 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Create New Project Section */}
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className={`p-4 ${cardBg} border rounded-xl space-y-3`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4" />
                Create New Book Project
              </h4>

              <div>
                <label className="text-xs font-bold block mb-1">Project / Book Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Empire of Glass"
                  required
                  autoFocus
                  className="w-full bg-black/10 border border-current/20 p-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Description / Subtitle</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Epic High Fantasy Novel (Volume 1)"
                  className="w-full bg-black/10 border border-current/20 p-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow"
                >
                  Create Project
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 border border-dashed border-indigo-500/50 hover:border-indigo-500 rounded-xl text-indigo-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-500/5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Book Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
