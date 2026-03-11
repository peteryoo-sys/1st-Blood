'use client';

import { useCallback } from 'react';
import type { CanvasElement, Size, Position } from '@/types/canvas';

interface SelectionBoxProps {
  element: CanvasElement;
  onResize: (id: string, size: Size, position?: Position) => void;
}

type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const HANDLE_SIZE = 8;

const handlePositions: Record<HandlePosition, React.CSSProperties> = {
  nw: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: 'nwse-resize' },
  n:  { top: -HANDLE_SIZE / 2, left: '50%', marginLeft: -HANDLE_SIZE / 2, cursor: 'ns-resize' },
  ne: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'nesw-resize' },
  e:  { top: '50%', marginTop: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'ew-resize' },
  se: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'nwse-resize' },
  s:  { bottom: -HANDLE_SIZE / 2, left: '50%', marginLeft: -HANDLE_SIZE / 2, cursor: 'ns-resize' },
  sw: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: 'nesw-resize' },
  w:  { top: '50%', marginTop: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: 'ew-resize' },
};

export default function SelectionBox({ element, onResize }: SelectionBoxProps) {
  const { position, size } = element;

  const handleMouseDown = useCallback(
    (handle: HandlePosition, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;
      const startPosX = position.x;
      const startPosY = position.y;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startPosX;
        let newY = startPosY;

        switch (handle) {
          case 'se':
            newWidth = Math.max(20, startWidth + dx);
            newHeight = Math.max(20, startHeight + dy);
            break;
          case 'sw':
            newWidth = Math.max(20, startWidth - dx);
            newHeight = Math.max(20, startHeight + dy);
            newX = startPosX + startWidth - newWidth;
            break;
          case 'ne':
            newWidth = Math.max(20, startWidth + dx);
            newHeight = Math.max(20, startHeight - dy);
            newY = startPosY + startHeight - newHeight;
            break;
          case 'nw':
            newWidth = Math.max(20, startWidth - dx);
            newHeight = Math.max(20, startHeight - dy);
            newX = startPosX + startWidth - newWidth;
            newY = startPosY + startHeight - newHeight;
            break;
          case 'n':
            newHeight = Math.max(20, startHeight - dy);
            newY = startPosY + startHeight - newHeight;
            break;
          case 's':
            newHeight = Math.max(20, startHeight + dy);
            break;
          case 'e':
            newWidth = Math.max(20, startWidth + dx);
            break;
          case 'w':
            newWidth = Math.max(20, startWidth - dx);
            newX = startPosX + startWidth - newWidth;
            break;
        }

        onResize(
          element.id,
          { width: newWidth, height: newHeight },
          { x: newX, y: newY }
        );
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [element.id, size, position, onResize]
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x - 3,
        top: position.y - 3,
        width: size.width + 6,
        height: size.height + 6,
        border: '1.5px dashed #3b82f6',
        pointerEvents: 'none',
      }}
    >
      {(Object.entries(handlePositions) as [HandlePosition, React.CSSProperties][]).map(
        ([pos, style]) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              backgroundColor: '#3b82f6',
              border: '1px solid white',
              borderRadius: 2,
              pointerEvents: 'auto',
              ...style,
            }}
            onMouseDown={(e) => handleMouseDown(pos, e)}
          />
        )
      )}
    </div>
  );
}
