import React, { useState, useRef, useMemo } from 'react';
import { Book, Character, Faction, Location, TimelineEvent } from '../types';
import { useLoreContext } from '../context/LoreContext';
import {
  BookOpen,
  Users,
  Shield,
  Clock,
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Sparkles,
  Filter,
  Layers,
  Search,
  Move
} from 'lucide-react';

interface MasterMatrixViewProps {
  books: Book[];
  characters: Character[];
  factions: Faction[];
  locations: Location[];
  timelineEvents: TimelineEvent[];
  onClose: () => void;
  onSelectDoc?: (docId: string) => void;
}

export const MasterMatrixView: React.FC<MasterMatrixViewProps> = ({
  books,
  characters,
  factions,
  locations,
  timelineEvents,
  onClose,
  onSelectDoc
}) => {
  const { navigateToCharacter, navigateToLocation, navigateToFaction } = useLoreContext();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<'all' | 'books' | 'characters' | 'factions' | 'events'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Node Positions Calculation
  const nodes = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'book' | 'character' | 'faction' | 'event';
      title: string;
      subtitle?: string;
      icon?: string;
      x: number;
      y: number;
      data: any;
      rawObj: any;
    }> = [];

    // Row 1: Books (Top Level)
    books.forEach((b, idx) => {
      list.push({
        id: b.id,
        type: 'book',
        title: b.title,
        subtitle: b.subtitle,
        x: 100 + idx * 320,
        y: 80,
        data: b,
        rawObj: b
      });
    });

    // Row 2: Factions
    factions.forEach((f, idx) => {
      list.push({
        id: f.id,
        type: 'faction',
        title: f.name,
        subtitle: f.allegiance,
        icon: f.emblem,
        x: 150 + idx * 300,
        y: 280,
        data: f,
        rawObj: f
      });
    });

    // Row 3: Characters
    characters.forEach((c, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      list.push({
        id: c.id,
        type: 'character',
        title: c.name,
        subtitle: c.title,
        x: 80 + col * 320,
        y: 480 + row * 220,
        data: c,
        rawObj: c
      });
    });

    // Row 4: Timeline Events
    timelineEvents.forEach((evt, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      list.push({
        id: evt.id,
        type: 'event',
        title: evt.title,
        subtitle: evt.yearLabel,
        x: 60 + col * 280,
        y: 920 + row * 200,
        data: evt,
        rawObj: evt
      });
    });

    return list;
  }, [books, factions, characters, timelineEvents]);

  // Relationship SVG Connections
  const connections = useMemo(() => {
    const lines: Array<{ fromId: string; toId: string; type: string; key: string }> = [];

    // Connect Characters to Factions & Books
    characters.forEach((c) => {
      if (c.factionId) {
        lines.push({
          fromId: c.id,
          toId: c.factionId,
          type: 'character-faction',
          key: `${c.id}-${c.factionId}`
        });
      }
      c.bookIds.forEach((bId) => {
        lines.push({
          fromId: c.id,
          toId: bId,
          type: 'character-book',
          key: `${c.id}-${bId}`
        });
      });
    });

    // Connect Timeline Events to Characters & Books
    timelineEvents.forEach((evt) => {
      if (evt.bookId) {
        lines.push({
          fromId: evt.id,
          toId: evt.bookId,
          type: 'event-book',
          key: `${evt.id}-${evt.bookId}`
        });
      }
      evt.characterIds.forEach((cId) => {
        lines.push({
          fromId: evt.id,
          toId: cId,
          type: 'event-character',
          key: `${evt.id}-${cId}`
        });
      });
    });

    return lines;
  }, [characters, timelineEvents]);

  // Helper to resolve node center coordinates
  const getNodePos = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + 120, y: node.y + 60 };
  };

  const handleNodeClick = (node: (typeof nodes)[0]) => {
    setSelectedNodeId(node.id);
    if (node.type === 'character') {
      navigateToCharacter(node.id);
    } else if (node.type === 'faction') {
      navigateToFaction(node.id);
    }
  };

  // Filtered nodes
  const filteredNodes = nodes.filter((n) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'books' && n.type === 'book') ||
      (activeFilter === 'characters' && n.type === 'character') ||
      (activeFilter === 'factions' && n.type === 'faction') ||
      (activeFilter === 'events' && n.type === 'event');

    const matchesSearch =
      searchTerm === '' ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.subtitle && n.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Matrix Canvas Control Bar */}
      <header className="h-14 bg-[#0c0c0e]/95 border-b border-[#27272a] px-4 flex items-center justify-between shrink-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Master Matrix View</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono uppercase">
                PC Canvas
              </span>
            </h2>
            <p className="text-[11px] text-[#71717a]">
              Interactive visual relationship map across books, characters, factions & events.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#71717a]" />
            <input
              type="text"
              placeholder="Search Matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] text-xs pl-8 pr-2 py-1 rounded text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
            {(['all', 'books', 'characters', 'factions', 'events'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#09090b] text-amber-400 font-bold border border-[#27272a]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Canvas Zoom Controls */}
          <div className="flex items-center bg-[#18181b] p-0.5 rounded border border-[#27272a] text-xs">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
              className="p-1 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="px-1.5 font-mono text-[10px] text-amber-400 font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
              className="p-1 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded"
              title="Reset Zoom & Pan"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#71717a] hover:text-white border border-[#27272a] transition-colors ml-2"
            title="Close Matrix View (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Infinite Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="canvas-bg flex-1 relative overflow-hidden bg-[#09090b] cursor-grab active:cursor-grabbing select-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* SVG Relationship Connector Lines */}
          <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {connections.map((conn) => {
              const start = getNodePos(conn.fromId);
              const end = getNodePos(conn.toId);
              if (start.x === 0 || end.x === 0) return null;

              const isHighlighted =
                selectedNodeId === conn.fromId || selectedNodeId === conn.toId;

              return (
                <line
                  key={conn.key}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isHighlighted ? '#f59e0b' : 'url(#lineGrad)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeDasharray={conn.type.includes('book') ? '4 4' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Matrix Entity Cards Grid */}
          <div className="relative z-10 w-[3500px] h-[3500px] p-10">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`absolute w-64 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181b] border-amber-500 ring-2 ring-amber-500/50 scale-105 z-30'
                      : node.type === 'book'
                      ? 'bg-[#18181b]/90 border-amber-500/40 hover:border-amber-400'
                      : node.type === 'faction'
                      ? 'bg-[#18181b]/90 border-indigo-500/40 hover:border-indigo-400'
                      : node.type === 'character'
                      ? 'bg-[#0c0c0e]/95 border-[#27272a] hover:border-amber-500/50'
                      : 'bg-[#09090b]/95 border-sky-500/40 hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        node.type === 'book'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : node.type === 'faction'
                          ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                          : node.type === 'character'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-sky-950/80 text-sky-300 border-sky-800/60'
                      }`}
                    >
                      {node.type}
                    </span>

                    {node.type === 'character' && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-950/50 px-1 py-0.2 rounded">
                        {node.data.role}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5">
                    {node.type === 'character' && node.data.avatarUrl ? (
                      <img
                        src={node.data.avatarUrl}
                        alt={node.title}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    ) : node.type === 'faction' ? (
                      <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700 flex items-center justify-center text-sm shrink-0">
                        {node.icon}
                      </div>
                    ) : node.type === 'book' ? (
                      <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400 shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-700 flex items-center justify-center text-sky-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate hover:text-amber-400">
                        {node.title}
                      </h4>
                      <p className="text-[10px] text-[#a1a1aa] truncate mt-0.5">{node.subtitle}</p>
                    </div>
                  </div>

                  {node.type === 'character' && node.data.magicAffinity && (
                    <div className="mt-2 text-[10px] text-amber-400/90 bg-amber-950/30 border border-amber-800/30 px-1.5 py-0.5 rounded truncate flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{node.data.magicAffinity}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
