# New Elements (Triangle & Line) Design Document

> **Summary**: Add triangle and line element types to the canvas editor
>
> **Project**: 1st Blood
> **Version**: 0.2.0
> **Author**: User
> **Date**: 2026-03-06
> **Status**: Draft
> **Planning Doc**: [new-elements.plan.md](../../01-plan/features/new-elements.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- Add triangle and line as new element types with minimal code changes
- Reuse existing element infrastructure (drag, resize, rotate, select, properties)
- Keep rendering CSS-only (no SVG or Canvas API)

### 1.2 Design Principles

- **Additive changes only**: Extend existing types and components, don't restructure
- **Consistency**: New elements behave identically to existing ones for shared features
- **Minimal surface area**: Only 5 files modified, 0 new files

---

## 2. Data Model Changes

### 2.1 Type Changes

```typescript
// src/types/canvas.ts — MODIFY

// Before:
export type ElementType = 'rectangle' | 'circle' | 'text';

// After:
export type ElementType = 'rectangle' | 'circle' | 'text' | 'triangle' | 'line';

// Add to ElementStyle:
export interface ElementStyle {
  // ... existing fields ...
  strokeWidth?: number;  // NEW: line thickness (default 2), only for 'line' type
}
```

### 2.2 No Action Type Changes

All existing actions (ADD_ELEMENT, UPDATE_STYLE, MOVE_ELEMENT, RESIZE_ELEMENT, ROTATE_ELEMENT, etc.) already work generically. No new action types needed.

---

## 3. Default Styles

### 3.1 Triangle Defaults

```typescript
// src/hooks/useCanvasState.ts — ADD to DEFAULT_STYLES

triangle: {
  size: { width: 150, height: 130 },
  style: {
    backgroundColor: '#f59e0b',   // amber-500
    borderColor: '#000000',
    borderWidth: 0,
    borderRadius: 0,
    opacity: 1,
  },
},
```

### 3.2 Line Defaults

```typescript
// src/hooks/useCanvasState.ts — ADD to DEFAULT_STYLES

line: {
  size: { width: 200, height: 2 },
  style: {
    backgroundColor: '#6b7280',   // gray-500
    borderColor: '#000000',
    borderWidth: 0,
    borderRadius: 0,
    opacity: 1,
    strokeWidth: 2,
  },
},
```

---

## 4. Rendering Specification

### 4.1 Triangle Rendering (CanvasElement.tsx)

```
Approach: CSS clip-path polygon

clip-path: polygon(50% 0%, 0% 100%, 100% 100%)

This creates an equilateral-looking triangle that:
- Points upward by default
- Fills with backgroundColor
- Scales with element width/height
- Can be rotated to point any direction
- borderWidth/borderColor NOT applied (clip-path clips borders)
```

**Implementation:**
```typescript
if (type === 'triangle') {
  divStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
  // Remove border properties since clip-path clips them
  divStyle.borderWidth = 0;
  divStyle.borderStyle = 'none';
}
```

### 4.2 Line Rendering (CanvasElement.tsx)

```
Approach: Thin div with strokeWidth as height

The line is a div where:
- height = strokeWidth (default 2px, min 1px)
- backgroundColor = line color
- User rotates to change direction
- borderRadius = strokeWidth/2 for rounded ends
```

**Implementation:**
```typescript
if (type === 'line') {
  divStyle.height = style.strokeWidth ?? 2;
  divStyle.borderRadius = (style.strokeWidth ?? 2) / 2;
  // Override border to none for clean line look
  divStyle.borderWidth = 0;
  divStyle.borderStyle = 'none';
}
```

**Hit area concern:** A 2px line is hard to click. Solution: wrap in a container div with `padding: 4px 0` and transparent background for a larger clickable area, but render the visible line inside.

**Alternative simpler approach:** Set a minimum element height via CSS `min-height` on the outer div, use the inner colored area for the visible line. Since the user can still click the bounding box area, this works without extra wrapper.

**Selected approach:** Use the simpler method — the element div has the full `size.height` for click area, but render the visible line stroke centered vertically:

```typescript
if (type === 'line') {
  // Container has full size for click area
  divStyle.backgroundColor = 'transparent';
  // Render a pseudo-element or inner div for the visible stroke
}
```

**Final decision:** Actually, keep it simplest — use the div height directly as the line. The minimum resize constraint (20px in SelectionBox) ensures it's always clickable. Override the resize min-height for lines to allow thinner sizes would be a future enhancement.

**Simplest approach (selected):**
- Line div height = `size.height` (which starts at 2, controlled by strokeWidth default)
- Set min size to 1px height for lines in the resize handler
- Background color IS the line color
- This is the most consistent with how other elements work

---

## 5. Toolbar Changes

### 5.1 New Buttons

```typescript
// src/components/toolbar/Toolbar.tsx — ADD to tools array

{ type: 'triangle', label: 'Triangle', icon: '△' },
{ type: 'line',     label: 'Line',     icon: '─' },
```

Position: After the existing 3 buttons (rectangle, circle, text).

---

## 6. Properties Panel Changes

### 6.1 Line-specific: strokeWidth control

```typescript
// src/components/properties/PropertiesPanel.tsx — ADD after Opacity section

{type === 'line' && (
  <Section title="Stroke">
    <NumberInput
      label="Width"
      value={style.strokeWidth ?? 2}
      onChange={(strokeWidth) =>
        dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { strokeWidth } } })
      }
      min={1}
      max={50}
    />
  </Section>
)}
```

When strokeWidth changes, also update the element's `size.height` to match:
```typescript
onChange={(strokeWidth) => {
  dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { strokeWidth } } });
  dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size: { ...size, height: strokeWidth } } });
}}
```

### 6.2 Triangle-specific: No special controls

Triangle uses the same controls as rectangle (fill color, opacity, rotation, position, size). No additional controls needed.

### 6.3 Hide irrelevant controls

- **Triangle**: Hide `borderRadius` (clip-path ignores it), hide `borderWidth`/`borderColor` (clipped away)
- **Line**: Hide `borderRadius`, `borderWidth`, `borderColor` (line is just a filled div)

---

## 7. Implementation Order

1. [ ] **Types** — Add `'triangle' | 'line'` to `ElementType`, add `strokeWidth` to `ElementStyle`
2. [ ] **Defaults** — Add triangle and line to `DEFAULT_STYLES` in useCanvasState
3. [ ] **Rendering** — Add triangle clip-path and line styling in CanvasElement
4. [ ] **Toolbar** — Add Triangle and Line buttons
5. [ ] **Properties** — Add strokeWidth control for line, hide irrelevant controls for triangle/line

---

## 8. Conventions Applied

| Item | Convention |
|------|-----------|
| No new files | Additive edits to 5 existing files only |
| Type extension | Union type extended, not replaced |
| Style defaults | Follow existing pattern in DEFAULT_STYLES |
| Rendering | CSS-only, consistent with existing div approach |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-06 | Initial draft | User |
