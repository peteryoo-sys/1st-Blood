# Canvas Editor Planning Document

> **Summary**: Interactive canvas-based UI design tool with drag & drop elements, property editing, and design export
>
> **Project**: 1st Blood
> **Version**: 0.1.0
> **Author**: User
> **Date**: 2026-03-06
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | Designers and developers need a lightweight, browser-based tool to quickly create UI layouts without heavy desktop software like Figma or Sketch. |
| **Solution** | A web-based canvas editor with drag & drop elements (shapes, text, images), a property inspector panel, and export functionality. |
| **Function/UX Effect** | Users can visually compose UI designs on an infinite canvas, manipulate elements with intuitive controls, and export their work as images or code. |
| **Core Value** | Democratize UI design by providing an accessible, free, browser-based design tool that anyone can use without installation. |

---

## 1. Overview

### 1.1 Purpose

Build an interactive canvas editor that allows users to create UI designs by placing and manipulating visual elements (rectangles, text, images, etc.) on a canvas, editing their properties, and exporting the result.

### 1.2 Background

- Existing tools (Figma, Canva) are powerful but complex or require accounts
- There's demand for a lightweight, instant-use design tool in the browser
- This is the core feature of the "1st Blood" app — everything else builds on this

### 1.3 Related Documents

- CLAUDE.md (project configuration)

---

## 2. Scope

### 2.1 In Scope

- [x] Canvas rendering area (white artboard on dark background)
- [ ] Element creation: rectangles, circles, text blocks
- [ ] Drag & drop to position elements on canvas
- [ ] Resize and rotate elements
- [ ] Selection with visual handles (bounding box)
- [ ] Left panel: element toolbar (add shapes, text)
- [ ] Right panel: property inspector (color, size, position, opacity)
- [ ] Undo/Redo support
- [ ] Export canvas as PNG image

### 2.2 Out of Scope

- User accounts / authentication (Starter level limitation)
- Cloud saving / real-time collaboration
- Layer management (future feature)
- Pen/drawing tool (future feature)
- Component/symbol system (future feature)
- Image upload from local device (future feature)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Canvas renders as a white artboard centered on screen | High | Pending |
| FR-02 | Users can add rectangle elements from the toolbar | High | Pending |
| FR-03 | Users can add circle elements from the toolbar | High | Pending |
| FR-04 | Users can add text elements from the toolbar | High | Pending |
| FR-05 | Elements can be dragged to reposition on canvas | High | Pending |
| FR-06 | Elements can be selected (click) showing handles | High | Pending |
| FR-07 | Selected elements show resize handles on corners | High | Pending |
| FR-08 | Right panel shows properties of selected element | High | Pending |
| FR-09 | Properties panel allows editing color, size, position | High | Pending |
| FR-10 | Undo/Redo with Ctrl+Z / Ctrl+Shift+Z | Medium | Pending |
| FR-11 | Export canvas as PNG | Medium | Pending |
| FR-12 | Delete selected element with Delete/Backspace key | High | Pending |
| FR-13 | Canvas supports zoom in/out (scroll wheel) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | Canvas renders at 60fps with up to 100 elements | Browser DevTools FPS counter |
| Responsiveness | Editor layout adapts to screen width >= 1024px | Manual testing at different widths |
| Accessibility | Keyboard navigation for tool selection | Manual keyboard testing |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] All High-priority functional requirements implemented
- [ ] Canvas renders elements correctly
- [ ] Drag & drop works smoothly
- [ ] Properties panel updates selected element in real-time
- [ ] No console errors during normal usage

### 4.2 Quality Criteria

- [ ] Zero lint errors
- [ ] Build succeeds (`next build`)
- [ ] Works in Chrome, Firefox, Safari

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Canvas performance with many elements | High | Medium | Use HTML/CSS positioning instead of `<canvas>` API for simplicity; optimize with React.memo |
| Complex drag & drop state management | Medium | High | Use a simple state reducer pattern; consider Zustand if complexity grows |
| Touch device compatibility | Medium | Low | Defer to future iteration; focus on desktop first |
| Browser compatibility for export | Low | Low | Use html2canvas library for PNG export |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ✅ |
| **Dynamic** | Feature-based modules, BaaS integration (bkend.ai) | Web apps with backend, SaaS MVPs | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Next.js 14 | Already initialized, App Router |
| State Management | Context / Zustand / Redux | React useState + useReducer | Simple enough for Starter; upgrade to Zustand if needed |
| Canvas Approach | HTML/CSS divs / Canvas API / SVG | HTML/CSS divs | Easier to style, select, and manipulate; no canvas API complexity |
| Styling | Tailwind / CSS Modules | Tailwind CSS | Already configured, fast iteration |
| Export | html2canvas / dom-to-image | html2canvas | Well-maintained, good browser support |

### 6.3 Clean Architecture Approach

```
Selected Level: Starter

Folder Structure:
src/
├── app/
│   ├── page.tsx              # Landing page
│   └── editor/
│       └── page.tsx          # Editor page
├── components/
│   ├── ui/                   # Base UI primitives
│   ├── canvas/               # Canvas-related components
│   │   ├── Canvas.tsx        # Main canvas container
│   │   ├── CanvasElement.tsx  # Individual element renderer
│   │   └── SelectionBox.tsx  # Selection handles
│   ├── toolbar/              # Left panel tools
│   │   └── Toolbar.tsx
│   └── properties/           # Right panel properties
│       └── PropertiesPanel.tsx
├── hooks/
│   └── useCanvasState.ts     # Canvas state management hook
├── types/
│   └── canvas.ts             # TypeScript types for elements
└── lib/
    └── export.ts             # Export utilities
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] `CONVENTIONS.md` exists at project root
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [x] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | In CLAUDE.md | PascalCase components, camelCase utils | High |
| **Folder structure** | In CLAUDE.md | canvas/, toolbar/, properties/ subdirs | High |
| **Import order** | Missing | React > Next > components > hooks > types > lib | Medium |
| **Error handling** | Missing | Console.warn for non-critical, throw for critical | Medium |

### 7.3 Environment Variables Needed

None required for Starter level (no backend, no API keys).

### 7.4 Pipeline Integration

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | ☐ | `docs/01-plan/schema.md` | `/phase-1-schema` |
| Phase 2 (Convention) | ☐ | `docs/01-plan/conventions.md` | `/phase-2-convention` |

---

## 8. Next Steps

1. [ ] Write design document (`canvas-editor.design.md`)
2. [ ] Define element type system (TypeScript interfaces)
3. [ ] Implement core canvas with drag & drop
4. [ ] Build toolbar and properties panel

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-06 | Initial draft | User |
