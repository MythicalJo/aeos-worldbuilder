import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import {
  X,
  Plus,
  Gem,
  Shield,
  Zap,
  Book,
  Compass,
  Feather,
  Flame,
  Globe,
  Heart,
  Key,
  Lock,
  Moon,
  Package,
  Scroll,
  Sparkles,
  Swords,
  Wand2,
  Crown,
  Cpu,
  Coins,
  Eye,
  Anchor,
  Skull,
  Layers
} from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, iconName: string, description: string) => void;
}

export const PRELOADED_ICONS = [
  { name: 'Gem', icon: Gem },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Book', icon: Book },
  { name: 'Compass', icon: Compass },
  { name: 'Feather', icon: Feather },
  { name: 'Flame', icon: Flame },
  { name: 'Globe', icon: Globe },
  { name: 'Heart', icon: Heart },
  { name: 'Key', icon: Key },
  { name: 'Lock', icon: Lock },
  { name: 'Moon', icon: Moon },
  { name: 'Package', icon: Package },
  { name: 'Scroll', icon: Scroll },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Swords', icon: Swords },
  { name: 'Wand2', icon: Wand2 },
  { name: 'Crown', icon: Crown },
  { name: 'Cpu', icon: Cpu },
  { name: 'Coins', icon: Coins },
  { name: 'Eye', icon: Eye },
  { name: 'Anchor', icon: Anchor },
  { name: 'Skull', icon: Skull },
  { name: 'Layers', icon: Layers }
];

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreateCategory
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Gem');
  const [description, setDescription] = useState('');

  useOutsideClick(modalRef, onClose, isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    onCreateCategory(categoryName.trim(), selectedIcon, description.trim());
    setCategoryName('');
    setDescription('');
    setSelectedIcon('Gem');
    onClose();
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full max-w-lg ${modalBg} border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className={`p-3.5 border-b ${headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            <Plus className="w-4 h-4 text-indigo-500" />
            <span>Create Custom Worldbuilder Category</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          <div>
            <label className="font-bold block mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Relics, Creatures, Organizations, Vehicles..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className={`w-full ${cardBg} border p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500`}
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Select Preloaded Icon *</label>
            <div className={`p-3 ${cardBg} border rounded-xl grid grid-cols-6 gap-2 max-h-48 overflow-y-auto`}>
              {PRELOADED_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedIcon === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : `${cardBg} opacity-80 hover:opacity-100 hover:border-indigo-500/50`
                    }`}
                    title={item.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Description / Purpose</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this category contains..."
              className={`w-full ${cardBg} border p-2.5 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-indigo-500`}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 opacity-70 hover:opacity-100 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow transition-all"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
