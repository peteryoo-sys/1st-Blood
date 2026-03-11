'use client';

import { useEffect, useRef } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import Canvas from '@/components/canvas/Canvas';
import Toolbar from '@/components/toolbar/Toolbar';
import PropertiesPanel from '@/components/properties/PropertiesPanel';
import { exportCanvasAsPng } from '@/lib/export';

export default function EditorPage() {
  const { state, dispatch, selectedElement } = useCanvasState();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedId) {
          dispatch({ type: 'DELETE_ELEMENT', payload: { id: state.selectedId } });
        }
      }

      if (e.key === 'Escape') {
        dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (state.selectedId) {
          dispatch({ type: 'DUPLICATE_ELEMENT', payload: { id: state.selectedId } });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedId, dispatch]);

  const handleExport = async () => {
    const canvasEl = canvasContainerRef.current?.querySelector('.bg-white') as HTMLElement | null;
    if (canvasEl) {
      await exportCanvasAsPng(canvasEl);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between shrink-0">
        <span className="text-sm font-semibold text-gray-300">1st Blood</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {state.elements.length} element{state.elements.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleExport}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          >
            Export PNG
          </button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden" ref={canvasContainerRef}>
        <Toolbar dispatch={dispatch} />
        <Canvas state={state} dispatch={dispatch} />
        <PropertiesPanel selectedElement={selectedElement} dispatch={dispatch} />
      </div>
    </div>
  );
}
