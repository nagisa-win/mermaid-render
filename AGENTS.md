# AGENTS.md

## Project Overview

Mermaid Render is a web-based Mermaid diagram editor with real-time preview and image export capabilities.

## Technology Stack

- **Framework**: Preact (React-compatible, lightweight)
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **Diagram Rendering**: Mermaid 11
- **Code Editor**: Monaco Editor
- **Image Export**: html-to-image

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

## Commands

```bash
npm run dev          # Dev server on port 3000
npm run build        # tsc && vite build (type-check is part of build)
npm run lint         # ESLint (flat config, eslint.config.js)
npm run type-check   # tsc --noEmit
npm run format       # Prettier (src/**/*.{ts,tsx,css})
```

Run `lint` then `type-check` after changes. CI enforces both on push to master.

## Stack quirk: Preact, not React

- UI framework is **Preact**, not React. Imports come from `preact/hooks`, not `react`.
- JSX import source is `preact` (set via `jsxImportSource` in tsconfig). Do not add React imports.
- `@monaco-editor/react` works with Preact via the Preact compat layer provided by `@preact/preset-vite`.

## Path aliases

Configured in both `tsconfig.json` and `vite.config.ts` — must stay in sync:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`

## No tests

No test framework is set up. Do not assume jest, vitest, or any runner exists.

## Code style

- 4-space indentation, single quotes, trailing commas (es5), no semicolins — see `.prettierrc`
- ESLint unused-vars rule allows `_`-prefixed parameters
- CSS only (no CSS modules, no styled-components)
- **Add comments**: function-level doc comments and key-path inline comments are expected. Do not strip existing comments when refactoring.
- **Commit messages**: keep to 1-3 lines, concise, focus on what and why. No long explanatory bodies.

## Architecture

- **Entry**: `src/main.tsx` → renders `App` into `#app`
- **Rendering flow**: Editor input → debounce 300ms → `useMermaid` renders SVG → Preview displays it
- **Export flow**: `useExport` hook captures `#diagram-container` via `html-to-image`, then downloads (PNG/JPG) or copies to clipboard (PNG)
- **Theming**: Solarized palette via CSS custom properties + `data-theme` attribute on `<html>`. `useTheme` hook manages dark/light toggle. Mermaid and Monaco editor each have their own Solarized theme definitions.
- **State**: Preact hooks only. LocalStorage for code (`mermaid-code`) and theme (`mermaid-theme`).

## Build details

- Vite base path is `/mermaid-render/` (GitHub Pages deployment)
- Build target: ES2015, minified with Terser (drops console/debugger)
- Manual chunks: `vendor` (preact), `mermaid`, `editor` (monaco)
- Requires Node.js >= 20

## Deployment

Push to `master` triggers GitHub Actions: lint → type-check → build → deploy to GitHub Pages.
