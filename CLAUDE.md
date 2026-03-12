# Mermaid Render - Claude Code Context

This file provides context for Claude Code when working on this project.

## Project Overview

Mermaid Render is a web-based Mermaid diagram editor with real-time preview and image export capabilities.

## Technology Stack

- **Framework**: Preact (React-compatible, lightweight)
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **Diagram Rendering**: Mermaid 11
- **Code Editor**: Monaco Editor
- **Image Export**: html-to-image

## Code Style

- TypeScript with 4-space indentation
- ESLint + Prettier for formatting
- CSS for styling (no CSS modules or styled-components)

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component |
| `src/hooks/useMermaid.ts` | Mermaid rendering logic |
| `src/hooks/useExport.ts` | Image export functionality |
| `src/hooks/useDebounce.ts` | Input debouncing |
| `src/components/Editor/` | Monaco editor wrapper |
| `src/components/Preview/` | Diagram preview display |
| `src/components/Toolbar/` | Export buttons |

## Common Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

## Architecture Notes

### Rendering Flow

1. User types in Monaco Editor
2. Input is debounced (300ms)
3. Debounced code is passed to `useMermaid`
4. Mermaid renders SVG
5. SVG displayed in Preview component

### Export Flow

1. User clicks export button
2. `useExport` hook captures preview element
3. `html-to-image` converts DOM to image
4. Image is downloaded via anchor element

## State Management

- Uses Preact hooks (useState, useEffect, useCallback)
- LocalStorage for code persistence
- No external state management library

## Build Configuration

- Target: ES2015
- Minifier: Terser
- Code splitting: vendor, mermaid, editor chunks
- Console/debugger removal in production

## Deployment

- Automatic deployment to GitHub Pages on push to master
- CI/CD via GitHub Actions
- Node.js 20 environment
