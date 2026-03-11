# New Elements (Triangle & Line) Planning Document

> **Summary**: Add triangle and line element types to the canvas editor
>
> **Project**: 1st Blood
> **Version**: 0.2.0
> **Author**: User
> **Date**: 2026-03-06
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | The canvas editor only supports 3 element types (rectangle, circle, text), limiting design expressiveness. Users need geometric shapes like triangles and connecting lines. |
| **Solution** | Add `triangle` and `line` as new element types using CSS (clip-path for triangle, rotated thin div for line), integrating with the existing drag/resize/property system. |
| **Function/UX Effect** | Users gain 2 new tools in the toolbar, triangle renders via CSS clip-path, line renders as a thin styled div. Both support all existing interactions (drag, resize, rotate, color, opacity). |
| **Core Value** | Expands the design tool's vocabulary from basic shapes to a more complete set, making it viable for wireframing and layout prototyping. |

---

## 1. Overview

### 1.1 Purpose

Add triangle and line element types to expand the canvas editor's shape palette. These integrate with the existing element system (drag, resize, rotate, select, properties panel).

### 1.2 Background

- The canvas-editor feature (archived) shipped with 3 element types: rectangle, circle, text
- Users need more shapes to create meaningful UI designs
- Triangle and line are the most requested primitives after the initial set

---

## 2. Scope

### 2.1 In Scope

- [ ] Add `triangle` to `ElementType` union
- [ ] Add `line` to `ElementType` union
- [ ] Triangle rendering using CSS `clip-path: polygon()`
- [ ] Line rendering using a thin div with configurable thickness
- [ ] Add `strokeWidth` to `ElementStyle` (for line thickness)
- [ ] Toolbar buttons for triangle and line
- [ ] Properties panel support for both new types
- [ ] Default styles for both new types
- [ ] Both types work with existing: drag, resize, rotate, select, undo/redo, duplicate, delete, export

### 2.2 Out of Scope

- Arrow heads on lines (future feature)
- Curved lines / bezier paths (future feature)
- Star, polygon, or other complex shapes (future feature)
- SVG-based rendering (staying with CSS/HTML approach)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Add "Triangle" button to toolbar | High | Pending |
| FR-02 | Add "Line" button to toolbar | High | Pending |
| FR-03 | Triangle renders as equilateral triangle via clip-path | High | Pending |
| FR-04 | Line renders as a horizontal thin div (default 2px height) | High | Pending |
| FR-05 | Triangle supports fill color (backgroundColor) | High | Pending |
| FR-06 | Line supports stroke color and thickness | High | Pending |
| FR-07 | Both types support drag & drop repositioning | High | Pending |
| FR-08 | Both types support resize via handles | High | Pending |
| FR-09 | Both types support rotation | High | Pending |
| FR-10 | Both types appear in properties panel when selected | High | Pending |
| FR-11 | Both types export correctly in PNG | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | No FPS drop with 50+ triangle/line elements | Browser DevTools |
| Consistency | New elements follow same interaction patterns as existing | Manual testing |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] All 11 functional requirements implemented
- [ ] Build passes (`next build`)
- [ ] Triangle and line render correctly in editor
- [ ] Properties panel shows appropriate controls for each type

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| clip-path triangle doesn't export in PNG (html2canvas limitation) | Medium | Medium | Test early; fallback to border-hack triangle if needed |
| Line element too thin to select/drag | Medium | High | Use a minimum clickable area (padding or invisible hit zone) |

---

## 6. Architecture Considerations

### 6.1 Key Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Triangle rendering | CSS `clip-path: polygon(50% 0%, 0% 100%, 100% 100%)` | Pure CSS, no SVG needed, works with existing div-based system |
| Line rendering | Thin div with `height: strokeWidth` and `backgroundColor` | Consistent with existing HTML/CSS approach; rotation handles direction |
| New style property | `strokeWidth?: number` on `ElementStyle` | Only used by line; optional so existing elements unaffected |

### 6.2 Files to Modify

| File | Change |
|------|--------|
| `src/types/canvas.ts` | Add `'triangle' \| 'line'` to `ElementType`, add `strokeWidth` to `ElementStyle` |
| `src/hooks/useCanvasState.ts` | Add default styles for triangle and line in `DEFAULT_STYLES` |
| `src/components/canvas/CanvasElement.tsx` | Add rendering logic for triangle (clip-path) and line (thin div) |
| `src/components/toolbar/Toolbar.tsx` | Add Triangle and Line buttons |
| `src/components/properties/PropertiesPanel.tsx` | Add strokeWidth control for line type |

---

## 7. Next Steps

1. [ ] Write design document (`new-elements.design.md`)
2. [ ] Implement changes
3. [ ] Test triangle and line in editor

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-06 | Initial draft | User |
