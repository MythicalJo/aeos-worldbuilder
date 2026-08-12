import React, { useState } from 'react';
import { Sparkles, X, Send, Copy, Plus, Check, Wand2 } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocTitle?: string;
  onAppendContentToActiveDoc: (content: string) => void;
  onCreateDocFromAI: (title: string, content: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  activeDocTitle,
  onAppendContentToActiveDoc,
  onCreateDocFromAI
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [contextType, setContextType] = useState<'character' | 'location' | 'magic' | 'event' | 'plot'>('character');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const presets = [
    { label: "Brainstorm Protagonist Traits", prompt: "Generate 3 unique, flawed fantasy protagonist ideas with names, traits, and a secret.", type: "character" },
    { label: "Invent Ancient Location", prompt: "Describe a sacred, half-submerged ruined city with 3 key landmarks and a curse.", type: "location" },
    { label: "Draft Magic System Rules", prompt: "Create a unique elemental magic system based on sound, resonance, and physical cost.", type: "magic" },
    { label: "Create Major Timeline Event", prompt: "Write a dramatic world-changing battle or cataclysm event for Book I climax.", type: "event" }
  ];

  const handleGenerate = async (customPrompt?: string, customType?: string) => {
    const activePrompt = customPrompt || prompt;
    const activeType = customType || contextType;

    if (!activePrompt.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult('');

    try {
      const response = await fetch('/api/ai/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt, contextType: activeType })
      });

      const data = await response.json();
      if (response.ok && data.result) {
        setResult(data.result);
      } else {
        // Fallback local generator if API key is not configured or offline
        setErrorMsg(data.error || 'Server call returned error. Generating fallback fantasy prompt.');
        setResult(`## Generated Fantasy Lore Ideas

> *"The stars above Aethelgard do not merely shine; they record every oath sworn in blood."*

### Suggested Lore Concept
- **Entity Name:** High Archon Vaelen
- **Role:** Ancient Starlight Enforcer
- **Magic System Strand:** Celestial Resonance & Gravitational Weaving
- **Lore Snippet:** Bound to the Silver Tower during the Second Dawn, Archon Vaelen possesses the ability to turn starlight into physical hard-light blades.

### Plot Hooks
1. **The Fractured Prism:** The Archon's blade shattered during [[Event: First Cataclysm & Void Binding]], leaving three pieces hidden in [[Location: Silverpeak Mountains]].
2. **The Starlight Oath:** Anyone who speaks the Archon's true name under a full moon can request one favor—for the price of their memories.
`);
      }
    } catch (err) {
      console.error('AI Generation call error:', err);
      setErrorMsg('Network error. Generated offline fantasy lore draft.');
      setResult(`## Generated Offline Fantasy Lore

### Concept: The Gloomwood Covenant
A shadowy order of rangers operating from [[Location: Whispering Forest]].

- **Leader:** Commander Kaelen Shadow-runner
- **Motto:** *"We walk the darkness so the realm sees light."*
- **Key Artifact:** The Obsidian Compass, which points toward the nearest void corruption node.
`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppend = () => {
    if (!result) return;
    onAppendContentToActiveDoc(`\n\n---\n${result}`);
    onClose();
  };

  const handleCreateNew = () => {
    if (!result) return;
    const firstLine = result.split('\n')[0].replace(/^[#\s>*-]+/, '') || 'AI Generated Fantasy Lore';
    onCreateDocFromAI(firstLine.slice(0, 40), result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#09090b] border border-[#27272a] rounded shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#e4e4e7]">
        {/* Modal Header */}
        <div className="p-3 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h3 className="font-semibold text-xs md:text-sm text-white">
              AI Worldbuilding Lore Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#18181b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 overflow-y-auto space-y-3 text-xs">
          {/* Preset Buttons */}
          <div>
            <label className="font-bold text-[#71717a] text-[10px] uppercase mb-1.5 block">
              Quick Prompt Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.prompt);
                    setContextType(p.type as unknown as typeof contextType);
                    handleGenerate(p.prompt, p.type);
                  }}
                  className="p-2 bg-[#09090b] hover:bg-[#18181b] border border-[#27272a] hover:border-indigo-500 rounded text-left transition-all group"
                >
                  <div className="font-semibold text-[#e4e4e7] group-hover:text-indigo-400 flex items-center gap-1.5 text-xs">
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{p.label}</span>
                  </div>
                  <p className="text-[10px] text-[#71717a] truncate mt-0.5">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-2 bg-[#18181b] p-3 rounded border border-[#27272a]">
            <div className="flex items-center justify-between">
              <label className="font-medium text-[#e4e4e7] text-xs">Custom Brainstorm Request</label>
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value as unknown as typeof contextType)}
                className="bg-[#09090b] border border-[#27272a] text-[11px] text-[#e4e4e7] rounded px-2 py-0.5"
              >
                <option value="character">Character</option>
                <option value="location">Location</option>
                <option value="magic">Magic Rule</option>
                <option value="event">Timeline Event</option>
                <option value="plot">Plot Twist</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Brainstorm a secret society of rogue sun-mages operating beneath the capital..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="flex-1 bg-[#09090b] border border-[#27272a] text-xs p-2 rounded text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
              >
                {loading ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message notice if fallback used */}
          {errorMsg && (
            <div className="p-2 bg-indigo-950/40 border border-indigo-800/40 rounded text-[10px] text-indigo-300">
              ℹ️ {errorMsg}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-400 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Generated Lore Output
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-[#71717a] hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#0c0c0e] rounded border border-[#27272a] text-[#e4e4e7] font-mono text-xs leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-text">
                {result}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {activeDocTitle && (
                  <button
                    onClick={handleAppend}
                    className="px-2.5 py-1 bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] rounded text-xs font-medium border border-[#27272a] transition-colors"
                  >
                    Append to "{activeDocTitle.slice(0, 18)}..."
                  </button>
                )}

                <button
                  onClick={handleCreateNew}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Note From Lore</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
