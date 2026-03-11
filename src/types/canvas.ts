export type ElementType = 'rectangle' | 'circle' | 'text' | 'triangle' | 'line';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  strokeWidth?: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;
  style: ElementStyle;
  text?: string;
  locked: boolean;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  history: CanvasElement[][];
  historyIndex: number;
  zoom: number;
  canvasSize: Size;
}

export type CanvasAction =
  | { type: 'ADD_ELEMENT'; payload: { elementType: ElementType } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; size: Size; position?: Position } }
  | { type: 'UPDATE_STYLE'; payload: { id: string; style: Partial<ElementStyle> } }
  | { type: 'UPDATE_TEXT'; payload: { id: string; text: string } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'DUPLICATE_ELEMENT'; payload: { id: string } }
  | { type: 'ROTATE_ELEMENT'; payload: { id: string; rotation: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; payload: { zoom: number } };
