'use client';

import type { CanvasElement as CanvasElementType } from '@/types/canvas';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
}

export default function CanvasElement({ element, isSelected, onSelect, onDragStart }: CanvasElementProps) {
  const { position, size, rotation, style, type, text } = element;

  const divStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    borderStyle: style.borderWidth > 0 ? 'solid' : 'none',
    borderRadius: type === 'circle' ? '50%' : style.borderRadius,
    opacity: style.opacity,
    cursor: 'move',
    userSelect: 'none',
    outline: isSelected ? '2px solid #3b82f6' : 'none',
    outlineOffset: 2,
    boxSizing: 'border-box',
  };

  if (type === 'triangle') {
    divStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    divStyle.borderWidth = 0;
    divStyle.borderStyle = 'none';
  }

  if (type === 'line') {
    divStyle.height = style.strokeWidth ?? 2;
    divStyle.borderRadius = (style.strokeWidth ?? 2) / 2;
    divStyle.borderWidth = 0;
    divStyle.borderStyle = 'none';
  }

  if (type === 'text') {
    Object.assign(divStyle, {
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      color: style.color,
      textAlign: style.textAlign,
      display: 'flex',
      alignItems: 'center',
      padding: '4px 8px',
      overflow: 'hidden',
    });
  }

  return (
    <div
      style={divStyle}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(element.id);
        onDragStart(element.id, e);
      }}
    >
      {type === 'text' && <span>{text}</span>}
    </div>
  );
}
