'use client';

import { useReducer } from 'react';
import type { CanvasState, CanvasAction, CanvasElement, ElementType, ElementStyle } from '@/types/canvas';

const DEFAULT_STYLES: Record<ElementType, { size: { width: number; height: number }; style: ElementStyle; text?: string }> = {
  rectangle: {
    size: { width: 200, height: 150 },
    style: {
      backgroundColor: '#3b82f6',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 8,
      opacity: 1,
    },
  },
  circle: {
    size: { width: 150, height: 150 },
    style: {
      backgroundColor: '#8b5cf6',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 9999,
      opacity: 1,
    },
  },
  text: {
    size: { width: 200, height: 40 },
    style: {
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 0,
      opacity: 1,
      fontSize: 16,
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      textAlign: 'left',
    },
    text: 'Text',
  },
  triangle: {
    size: { width: 150, height: 130 },
    style: {
      backgroundColor: '#f59e0b',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 0,
      opacity: 1,
    },
  },
  line: {
    size: { width: 200, height: 2 },
    style: {
      backgroundColor: '#6b7280',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 1,
      opacity: 1,
      strokeWidth: 2,
    },
  },
};

const initialState: CanvasState = {
  elements: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
  zoom: 1,
  canvasSize: { width: 800, height: 600 },
};

function pushHistory(state: CanvasState, newElements: CanvasElement[]): Pick<CanvasState, 'elements' | 'history' | 'historyIndex'> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(newElements);
  return {
    elements: newElements,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const defaults = DEFAULT_STYLES[action.payload.elementType];
      const newElement: CanvasElement = {
        id: crypto.randomUUID(),
        type: action.payload.elementType,
        position: {
          x: (state.canvasSize.width - defaults.size.width) / 2,
          y: (state.canvasSize.height - defaults.size.height) / 2,
        },
        size: { ...defaults.size },
        rotation: 0,
        style: { ...defaults.style },
        text: defaults.text,
        locked: false,
      };
      const newElements = [...state.elements, newElement];
      return {
        ...state,
        ...pushHistory(state, newElements),
        selectedId: newElement.id,
      };
    }

    case 'SELECT_ELEMENT':
      return { ...state, selectedId: action.payload.id };

    case 'MOVE_ELEMENT': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, position: action.payload.position } : el
      );
      return { ...state, ...pushHistory(state, newElements) };
    }

    case 'RESIZE_ELEMENT': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id
          ? {
              ...el,
              size: action.payload.size,
              ...(action.payload.position ? { position: action.payload.position } : {}),
            }
          : el
      );
      return { ...state, ...pushHistory(state, newElements) };
    }

    case 'ROTATE_ELEMENT': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, rotation: action.payload.rotation } : el
      );
      return { ...state, ...pushHistory(state, newElements) };
    }

    case 'UPDATE_STYLE': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id
          ? { ...el, style: { ...el.style, ...action.payload.style } }
          : el
      );
      return { ...state, ...pushHistory(state, newElements) };
    }

    case 'UPDATE_TEXT': {
      const newElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, text: action.payload.text } : el
      );
      return { ...state, ...pushHistory(state, newElements) };
    }

    case 'DELETE_ELEMENT': {
      const newElements = state.elements.filter((el) => el.id !== action.payload.id);
      return {
        ...state,
        ...pushHistory(state, newElements),
        selectedId: state.selectedId === action.payload.id ? null : state.selectedId,
      };
    }

    case 'DUPLICATE_ELEMENT': {
      const original = state.elements.find((el) => el.id === action.payload.id);
      if (!original) return state;
      const duplicate: CanvasElement = {
        ...original,
        id: crypto.randomUUID(),
        position: { x: original.position.x + 20, y: original.position.y + 20 },
      };
      const newElements = [...state.elements, duplicate];
      return {
        ...state,
        ...pushHistory(state, newElements),
        selectedId: duplicate.id,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        elements: state.history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        elements: state.history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      };
    }

    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.25, Math.min(3, action.payload.zoom)) };

    default:
      return state;
  }
}

export function useCanvasState() {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const selectedElement = state.elements.find((el) => el.id === state.selectedId) ?? null;
  return { state, dispatch, selectedElement };
}
