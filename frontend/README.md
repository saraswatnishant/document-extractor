# Document Extractor frontend

Minimal React + TypeScript application built with Vite. No backend integration
or extraction workflow is implemented yet.

## Requirements

- Node.js 22.12+ (22.x) or 24.x; initially verified with Node.js 24.11.1.
- npm; commit `package-lock.json` and use `npm ci` for reproducible installs.

## Local development

From this directory:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. The development server is not a production
server. Docker integration is a separate increment.

## Validation

```bash
npm test
npm run lint
npm run build
```

- `npm test`: runs unit/component tests once using Vitest.
- `npm run test:watch`: reruns tests as files change.
- `npm run lint`: runs the scaffold's Oxlint checks.
- `npm run build`: checks TypeScript and creates production assets in `dist/`.
- `npm run preview`: serves the production build locally for inspection only.

## Files and request flow

1. `index.html` supplies the root element and loads `src/main.tsx`.
2. `src/main.tsx` mounts `App` inside React Strict Mode and imports global CSS.
3. `src/App.tsx` renders the introductory screen.
4. `vite.config.ts` configures React compilation and Vitest.
5. `src/test/setup.ts` adds DOM assertions and cleans up after every test.
6. `src/App.test.tsx` renders the component and checks its accessible content.

Vitest executes tests; jsdom supplies an in-memory DOM; React Testing Library
renders components and queries them through user-visible semantics.
These tests do not replace real-browser or end-to-end testing.
