'use client';

import { useCallback, useRef } from 'react';
import type { CanvasState, CanvasAction, Position, Size } from '@/types/canvas';
import CanvasElement from './CanvasElement';
import SelectionBox from './SelectionBox';

interface CanvasProps {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
}

export default function Canvas({ state, dispatch }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleDragStart = useCallback(
    (id: string, e: React.MouseEvent) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element || element.locked) return;

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      dragRef.current = {
        id,
        offsetX: e.clientX - canvasRect.left - element.position.x * state.zoom,
        offsetY: e.clientY - canvasRect.top - element.position.y * state.zoom,
      };

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current || !canvasRef.current) return;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          if (!dragRef.current || !canvasRef.current) return;
          const rect = canvasRef.current.getBoundingClientRect();
          const newX = (moveEvent.clientX - rect.left - dragRef.current.offsetX) / state.zoom;
          const newY = (moveEvent.clientY - rect.top - dragRef.current.offsetY) / state.zoom;
          dispatch({
            type: 'MOVE_ELEMENT',
            payload: { id: dragRef.current.id, position: { x: Math.round(newX), y: Math.round(newY) } },
          });
          rafRef.current = null;
        });
      };

      const onMouseUp = () => {
        dragRef.current = null;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [state.elements, state.zoom, dispatch]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } });
      }
    },
    [dispatch]
  );

  const handleResize = useCallback(
    (id: string, size: Size, position?: Position) => {
      dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size, position } });
    },
    [dispatch]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        dispatch({ type: 'SET_ZOOM', payload: { zoom: state.zoom + delta } });
      }
    },
    [state.zoom, dispatch]
  );

  const selectedElement = state.elements.find((el) => el.id === state.selectedId);

  return (
    <main
      className="flex-1 flex items-center justify-center bg-gray-950 overflow-hidden relative"
      onWheel={handleWheel}
    >
      <div className="absolute bottom-4 right-4 text-gray-500 text-sm select-none">
        {Math.round(state.zoom * 100)}%
      </div>
      <div
        ref={canvasRef}
        style={{
          width: state.canvasSize.width,
          height: state.canvasSize.height,
          transform: `scale(${state.zoom})`,
          transformOrigin: 'center center',
        }}
        className="bg-white rounded-lg shadow-2xl relative"
        onMouseDown={handleCanvasClick}
      >
        {state.elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === state.selectedId}
            onSelect={(id) => dispatch({ type: 'SELECT_ELEMENT', payload: { id } })}
            onDragStart={handleDragStart}
          />
        ))}
        {selectedElement && (
          <SelectionBox element={selectedElement} onResize={handleResize} />
        )}
      </div>
    </main>
  );
}
