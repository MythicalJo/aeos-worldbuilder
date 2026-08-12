import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose, isOpen);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className={`w-full max-w-md ${modalBg} border rounded-2xl shadow-2xl p-5 space-y-4`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isDanger ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : `${cardBg} border`} flex items-center justify-center shrink-0`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{title}</h3>
              <p className="text-xs opacity-70 mt-0.5">{message}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${cardBg} border opacity-80 hover:opacity-100 transition-all`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all shadow ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
