'use client';

import type { CanvasAction, ElementType } from '@/types/canvas';

interface ToolbarProps {
  dispatch: React.Dispatch<CanvasAction>;
}

const tools: { type: ElementType; label: string; icon: string }[] = [
  { type: 'rectangle', label: 'Rectangle', icon: '▭' },
  { type: 'circle', label: 'Circle', icon: '○' },
  { type: 'triangle', label: 'Triangle', icon: '△' },
  { type: 'line', label: 'Line', icon: '─' },
  { type: 'text', label: 'Text', icon: 'T' },
];

export default function Toolbar({ dispatch }: ToolbarProps) {
  return (
    <aside className="w-60 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Elements
      </h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() =>
              dispatch({ type: 'ADD_ELEMENT', payload: { elementType: tool.type } })
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
          >
            <span className="text-xl w-6 text-center">{tool.icon}</span>
            <span className="text-sm">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Shortcuts
        </h2>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Delete — Remove element</p>
          <p>Ctrl+Z — Undo</p>
          <p>Ctrl+Shift+Z — Redo</p>
          <p>Ctrl+D — Duplicate</p>
          <p>Esc — Deselect</p>
          <p>Ctrl+Scroll — Zoom</p>
        </div>
      </div>
    </aside>
  );
}
