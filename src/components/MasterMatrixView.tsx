import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Book, Character, Faction, Location, TimelineEvent } from '../types';
import { useLoreContext } from '../context/LoreContext';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
  const { navigateToCharacter, navigateToLocation, navigateToFaction } = useLoreContext();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<'all' | 'books' | 'characters' | 'factions' | 'events'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start canvas pan if not clicking a card button directly
    const target = e.target as HTMLElement;
    if (target.closest('.matrix-card-action')) return;

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

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * -0.0015;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + zoomFactor, 0.3), 2.5));
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

    // Row 1: Books
    books.forEach((b, idx) => {
      list.push({
        id: b.id,
        type: 'book',
        title: b.title,
        subtitle: b.description || `Book ${b.volumeNumber}`,
        x: 120 + idx * 340,
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
        x: 160 + idx * 320,
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

  // Relationship Connections
  const connections = useMemo(() => {
    const lines: Array<{ fromId: string; toId: string; type: string; key: string }> = [];

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

  const isSepia = theme === 'sepia';
  const isLight = theme === 'light';

  const canvasBg = isSepia
    ? 'bg-[#fbf0d9] text-[#433422]'
    : isLight
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#09090b] text-[#e4e4e7]';

  const headerBg = isSepia
    ? 'bg-[#f4e4bc] border-[#dcc090]'
    : isLight
    ? 'bg-[#f1f5f9] border-[#cbd5e1]'
    : 'bg-[#0c0c0e] border-[#27272a]';

  const cardBg = isSepia
    ? 'bg-[#ebd4a2] border-[#dcc090]'
    : isLight
    ? 'bg-[#ffffff] border-[#cbd5e1]'
    : 'bg-[#18181b] border-[#27272a]';

  const accentColor = isSepia ? 'text-[#964b00]' : isLight ? 'text-indigo-600' : 'text-indigo-400';

  return (
    <div className={`fixed inset-0 z-50 ${canvasBg} flex flex-col select-none overflow-hidden animate-in fade-in duration-200`}>
      {/* Matrix Canvas Header Control Bar */}
      <header className={`h-14 ${headerBg} border-b px-4 flex items-center justify-between shrink-0 z-30 shadow-xl`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${cardBg} border flex items-center justify-center ${accentColor}`}>
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm flex items-center gap-2">
              <span>Worldbuilder Matrix</span>
              <span className={`text-[10px] ${cardBg} border px-2 py-0.5 rounded font-mono uppercase font-bold`}>
                Interactive Canvas
              </span>
            </h2>
            <p className="text-[11px] opacity-70">
              Drag canvas to pan • Scroll to zoom • Click nodes to inspect relationships
            </p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center gap-2">
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60" />
            <input
              type="text"
              placeholder="Search Matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${cardBg} border text-xs pl-8 pr-2 py-1 rounded focus:outline-none focus:border-indigo-500`}
            />
          </div>

          <div className={`flex items-center ${cardBg} p-0.5 rounded border text-xs`}>
            {(['all', 'books', 'characters', 'factions', 'events'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                  activeFilter === filter
                    ? `${canvasBg} ${accentColor} font-bold border`
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className={`flex items-center ${cardBg} p-0.5 rounded border text-xs`}>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
              className="p-1 opacity-70 hover:opacity-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className={`px-1.5 font-mono text-[10px] ${accentColor} font-bold`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.3))}
              className="p-1 opacity-70 hover:opacity-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 opacity-70 hover:opacity-100 rounded"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${cardBg} border transition-colors ml-2 hover:text-rose-500`}
            title="Close Matrix View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigable Interactive Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`flex-1 relative overflow-hidden ${canvasBg} cursor-grab active:cursor-grabbing select-none`}
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(125, 125, 125, 0.15) 1px, transparent 1px)',
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
              <linearGradient id="matrixLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
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
                  stroke={isHighlighted ? '#6366f1' : 'url(#matrixLineGrad)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeDasharray={conn.type.includes('book') ? '4 4' : undefined}
                />
              );
            })}
          </svg>

          {/* Matrix Cards Grid */}
          <div className="relative z-10 w-[3800px] h-[3800px] p-10">
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
                  className={`matrix-card-action absolute w-64 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `${cardBg} border-indigo-500 ring-2 ring-indigo-500/50 scale-105 z-30 font-bold`
                      : `${cardBg} opacity-90 hover:opacity-100 hover:scale-[1.02]`
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${cardBg}`}>
                      {node.type}
                    </span>

                    {node.type === 'character' && (
                      <span className={`text-[9px] font-bold ${accentColor} ${cardBg} px-1 py-0.2 rounded border`}>
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
                        className="w-9 h-9 rounded-lg object-cover border shrink-0"
                      />
                    ) : node.type === 'faction' ? (
                      <div className={`w-8 h-8 rounded-lg ${cardBg} border flex items-center justify-center text-sm shrink-0`}>
                        {node.icon}
                      </div>
                    ) : node.type === 'book' ? (
                      <div className={`w-8 h-8 rounded-lg ${cardBg} border flex items-center justify-center ${accentColor} shrink-0`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg ${cardBg} border flex items-center justify-center text-sky-500 shrink-0`}>
                        <Clock className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">
                        {node.title}
                      </h4>
                      <p className="text-[10px] opacity-70 truncate mt-0.5">{node.subtitle}</p>
                    </div>
                  </div>

                  {node.type === 'character' && node.data.magicAffinity && (
                    <div className={`mt-2 text-[10px] ${accentColor} ${cardBg} border px-1.5 py-0.5 rounded truncate flex items-center gap-1 font-semibold`}>
                      <Sparkles className="w-3 h-3 shrink-0" />
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
