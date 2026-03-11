# Canvas Editor Design Document

> **Summary**: Detailed design for the interactive canvas-based UI design tool with drag & drop, selection, property editing, and export
>
> **Project**: 1st Blood
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-03-06
> **Status**: Draft
> **Planning Doc**: [canvas-editor.plan.md](../../01-plan/features/canvas-editor.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- Build a functional canvas editor where users can place, move, resize, and style UI elements
- Keep the architecture simple (Starter level) while supporting future extensibility
- Use HTML/CSS divs for elements (not Canvas API) for simplicity and accessibility
- Smooth 60fps interactions for drag & drop

### 1.2 Design Principles

- **Component isolation**: Each panel (toolbar, canvas, properties) is an independent component
- **Single state source**: All canvas state lives in one reducer for predictable updates
- **Minimal dependencies**: Only add libraries when truly needed (avoid premature optimization)

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Editor Page (layout)                     │
├──────────┬──────────────────────────────┬───────────────────┤
│          │                              │                   │
│ Toolbar  │         Canvas              │  Properties       │
│ (Left)   │         (Center)            │  Panel (Right)    │
│          │                              │                   │
│ ┌──────┐ │  ┌────────────────────────┐  │ ┌─────────────┐  │
│ │Add   │ │  │                        │  │ │ Position    │  │
│ │Rect  │ │  │  ┌──────┐  ┌───┐      │  │ │ x: ___     │  │
│ │Add   │ │  │  │ Rect │  │ O │      │  │ │ y: ___     │  │
│ │Circle│ │  │  └──────┘  └───┘      │  │ │ Size       │  │
│ │Add   │ │  │       ┌──────────┐    │  │ │ w: ___     │  │
│ │Text  │ │  │       │  Hello   │    │  │ │ h: ___     │  │
│ │      │ │  │       └──────────┘    │  │ │ Color      │  │
│ └──────┘ │  │                        │  │ │ [■] #fff   │  │
│          │  └────────────────────────┘  │ │ Opacity    │  │
│          │                              │ │ [====] 100 │  │
│          │                              │ └─────────────┘  │
├──────────┴──────────────────────────────┴───────────────────┤
│                    Keyboard Shortcuts                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
User Action (click/drag/input)
    ↓
Event Handler (component)
    ↓
Dispatch Action (useCanvasReducer)
    ↓
State Update (elements[], selectedId, history)
    ↓
Re-render (Canvas elements + Properties panel)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Canvas | useCanvasState hook | Element data and dispatch |
| CanvasElement | Canvas (parent) | Renders individual element |
| SelectionBox | Canvas, selectedId | Shows resize handles |
| Toolbar | dispatch function | Creates new elements |
| PropertiesPanel | selectedElement, dispatch | Edits element properties |

---

## 3. Data Model

### 3.1 Core Types

```typescript
// src/types/canvas.ts

type ElementType = 'rectangle' | 'circle' | 'text';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;        // degrees
  style: ElementStyle;
  text?: string;            // only for text elements
  locked: boolean;
}

interface ElementStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  opacity: number;          // 0-1
  fontSize?: number;        // only for text
  fontFamily?: string;      // only for text
  color?: string;           // text color, only for text
  textAlign?: 'left' | 'center' | 'right';
}

interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  history: CanvasElement[][];   // for undo/redo
  historyIndex: number;
  zoom: number;                 // 1 = 100%
  canvasSize: Size;
}
```

### 3.2 Action Types

```typescript
// src/types/canvas.ts

type CanvasAction =
  | { type: 'ADD_ELEMENT'; payload: { elementType: ElementType } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; size: Size; position?: Position } }
  | { type: 'UPDATE_STYLE'; payload: { id: string; style: Partial<ElementStyle> } }
  | { type: 'UPDATE_TEXT'; payload: { id: string; text: string } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; payload: { zoom: number } };
```

---

## 4. Component Specifications

### 4.1 Component List

| Component | File | Layer | Responsibility |
|-----------|------|-------|----------------|
| EditorPage | `src/app/editor/page.tsx` | Presentation | Page layout, state provider |
| Canvas | `src/components/canvas/Canvas.tsx` | Presentation | Canvas container, click/drag handling |
| CanvasElement | `src/components/canvas/CanvasElement.tsx` | Presentation | Render single element as div |
| SelectionBox | `src/components/canvas/SelectionBox.tsx` | Presentation | Resize handles around selected element |
| Toolbar | `src/components/toolbar/Toolbar.tsx` | Presentation | Element creation buttons |
| PropertiesPanel | `src/components/properties/PropertiesPanel.tsx` | Presentation | Edit selected element properties |
| useCanvasState | `src/hooks/useCanvasState.ts` | Application | State reducer + history management |
| canvas types | `src/types/canvas.ts` | Domain | TypeScript type definitions |
| exportCanvas | `src/lib/export.ts` | Infrastructure | PNG export utility |

### 4.2 Component Details

#### Canvas.tsx
```
Props: { state: CanvasState, dispatch: Dispatch<CanvasAction> }

Behavior:
- Renders white artboard (800x600 default) centered in dark area
- Maps state.elements to CanvasElement components
- Handles click on empty area → deselect (SELECT_ELEMENT null)
- Handles mousedown/mousemove/mouseup for drag operations
- Scales content by state.zoom
- Handles wheel event for zoom in/out
```

#### CanvasElement.tsx
```
Props: { element: CanvasElement, isSelected: boolean, onSelect, onDragStart }

Behavior:
- Renders as absolutely-positioned div within canvas
- Applies position, size, rotation, and style from element data
- For type='circle': uses border-radius: 50%
- For type='text': renders editable text content
- onClick → onSelect(element.id)
- onMouseDown → begins drag operation
```

#### SelectionBox.tsx
```
Props: { element: CanvasElement, onResize: (size, position) => void }

Behavior:
- Renders 8 resize handles (4 corners + 4 edges) around selected element
- Blue dashed border around element
- Handles corner drag → resize element proportionally
- Handles edge drag → resize in one dimension
```

#### Toolbar.tsx
```
Props: { dispatch: Dispatch<CanvasAction> }

Behavior:
- Button: "Rectangle" → dispatch ADD_ELEMENT rectangle
- Button: "Circle" → dispatch ADD_ELEMENT circle
- Button: "Text" → dispatch ADD_ELEMENT text
- Each button has icon + label
```

#### PropertiesPanel.tsx
```
Props: { selectedElement: CanvasElement | null, dispatch: Dispatch<CanvasAction> }

Behavior:
- If no selection: show "Select an element to edit"
- If selected, show editable fields:
  - Position: x, y (number inputs)
  - Size: width, height (number inputs)
  - Rotation: degrees (number input + slider)
  - Background color (color picker input)
  - Border: color, width, radius
  - Opacity (slider 0-100)
  - For text: fontSize, fontFamily, color, textAlign
- Each input change → dispatch UPDATE_STYLE or MOVE_ELEMENT
```

#### useCanvasState.ts
```
Returns: { state: CanvasState, dispatch: Dispatch<CanvasAction> }

Behavior:
- useReducer with canvasReducer
- Initial state: empty elements, no selection, zoom 1
- ADD_ELEMENT: generates uuid, places at center of canvas
- MOVE_ELEMENT: updates position, pushes to history
- RESIZE_ELEMENT: updates size (and position for top/left handles)
- DELETE_ELEMENT: removes element, clears selection if deleted
- UNDO: historyIndex - 1, restore elements from history
- REDO: historyIndex + 1, restore elements from history
- History: snapshot elements array before each mutation
```

---

## 5. Interaction Design

### 5.1 Drag & Drop Flow

```
mousedown on element
    → set dragging = true, record offset (mouse - element position)
    → select element

mousemove (while dragging)
    → calculate new position = mouse - offset
    → dispatch MOVE_ELEMENT (throttled to animation frame)

mouseup
    → set dragging = false
    → push to history
```

### 5.2 Resize Flow

```
mousedown on resize handle
    → set resizing = true, record handle position and initial size
    → record which handle (nw/ne/sw/se/n/s/e/w)

mousemove (while resizing)
    → calculate delta from initial handle position
    → adjust size and position based on which handle
    → dispatch RESIZE_ELEMENT

mouseup
    → set resizing = false
    → push to history
```

### 5.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected element |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selected element |
| `Escape` | Deselect |

---

## 6. Styling Specifications

### 6.1 Color Palette

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Editor background | `#0a0a0a` | `bg-gray-950` |
| Side panels | `#1f2937` | `bg-gray-800` |
| Panel borders | `#374151` | `border-gray-700` |
| Canvas artboard | `#ffffff` | `bg-white` |
| Selection border | `#3b82f6` | `border-blue-500` |
| Resize handles | `#3b82f6` | `bg-blue-500` |
| Button hover | `#374151` | `hover:bg-gray-700` |
| Text primary | `#ffffff` | `text-white` |
| Text secondary | `#9ca3af` | `text-gray-400` |

### 6.2 Panel Dimensions

| Panel | Width | Behavior |
|-------|-------|----------|
| Toolbar (left) | 240px (`w-60`) | Fixed |
| Canvas (center) | Flexible (`flex-1`) | Fills remaining space |
| Properties (right) | 256px (`w-64`) | Fixed |

---

## 7. Default Element Values

| Element Type | Default Size | Default Style |
|-------------|-------------|---------------|
| Rectangle | 200x150 | bg: #3b82f6, border: none, radius: 8px |
| Circle | 150x150 | bg: #8b5cf6, border: none, radius: 50% |
| Text | 200x40 | bg: transparent, text: "Text", fontSize: 16, color: #000 |

---

## 8. Implementation Order

1. [ ] **Types** — Define `CanvasElement`, `CanvasState`, `CanvasAction` in `src/types/canvas.ts`
2. [ ] **State hook** — Implement `useCanvasState` with reducer and history in `src/hooks/useCanvasState.ts`
3. [ ] **Canvas container** — Build `Canvas.tsx` with artboard and click-to-deselect
4. [ ] **CanvasElement** — Render elements as positioned divs with styles
5. [ ] **Toolbar** — Add element creation buttons (rectangle, circle, text)
6. [ ] **Selection** — Click to select, show blue border on selected element
7. [ ] **Drag & Drop** — Mouse event handlers for moving elements
8. [ ] **SelectionBox** — Resize handles on selected elements
9. [ ] **PropertiesPanel** — Property inputs that update selected element
10. [ ] **Keyboard shortcuts** — Delete, Undo/Redo, Escape
11. [ ] **Export** — PNG export using html2canvas

---

## 9. Conventions Applied

| Item | Convention |
|------|-----------|
| Component naming | PascalCase (`Canvas.tsx`, `CanvasElement.tsx`) |
| File organization | Grouped by feature (`canvas/`, `toolbar/`, `properties/`) |
| State management | `useReducer` in custom hook, actions dispatched from components |
| Error handling | Console.warn for non-critical (e.g., invalid resize), no throws in UI |
| ID generation | `crypto.randomUUID()` for element IDs |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-06 | Initial draft | User |
