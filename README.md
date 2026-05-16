# RainFocus UI Challenge

A single-page React application that matches the provided Figma design.

Built with **TypeScript + React 18 + Vite 5 + SSR**, **SCSS modules**, **Vitest** for unit testing, and tooling (ESLint + Prettier) wired up with **pnpm**.

The app pre-renders to fully static HTML at build time, so the contents of `dist/client/` can be served from any static file host.

---

## Viewing the pre-built site

The `dist/` folder is committed so the site can be inspected without installing or building anything.

### Option A - local static server (recommended)

Any static server works; pick one:

```bash
# Node (no install needed, uses npx)
npx serve dist/client

# Python
cd dist/client && python3 -m http.server 8000

# Or, if you've run `pnpm install` once:
pnpm serve
```

Then open <http://localhost:3000> (or whichever port your server uses).

### Option B - open the file directly

Open `dist/client/index.html` in a browser. The page is fully pre-rendered so it displays correctly without JavaScript. Some browsers (Chrome, Edge) block ES-module loading from `file://`, which means the page will **look right but won't be interactive** (clicking nav items, opening the mobile drawer). Use Option A for a fully interactive preview.

---

## Building from source

Requires Node 18+ and pnpm.

```bash
pnpm install      # install dependencies
pnpm build        # typecheck + client + server bundles + pre-render
pnpm serve        # serve dist/client at http://localhost:5173
```

Other scripts:

| Script              | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Vite dev server with SSR middleware + HMR               |
| `pnpm build`        | Typecheck, build client + server, then SSG              |
| `pnpm preview`      | Vite's static preview server                            |
| `pnpm serve`        | Lightweight Express server for `dist/client`            |
| `pnpm test`         | Run all unit tests with Vitest                          |
| `pnpm test:watch`   | Vitest in watch mode                                    |
| `pnpm typecheck`    | `tsc --noEmit`                                          |
| `pnpm lint`         | Run ESLint over `.ts` / `.tsx`                          |
| `pnpm format`       | Apply Prettier formatting                               |
| `pnpm format:check` | Verify formatting (CI-friendly)                         |

---

## How SSR works here

Vite SSR is wired up in the canonical three-piece pattern:

1. **`src/entry-client.tsx`** - hydrates the server-rendered HTML on the client.
2. **`src/entry-server.tsx`** - exports a `render()` function that returns the HTML string.
3. **`prerender.ts`** - after `vite build` produces the client and server bundles, this script loads the server bundle once, renders the app, and injects the HTML into the client `index.html`. The result is a fully static deliverable.

`server.ts` provides a development SSR server (Vite as middleware) so the exact same code path is used in `pnpm dev`. Node scripts are run through **`tsx`** (`node --import tsx/esm …`) so they can stay in TypeScript with no separate compile step.

---

## TypeScript

TypeScript is enabled in strict mode (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`). Every component exports a `Props` interface; shared domain types (`NavItem`, `EventInfo`, `WorkflowItem`, `BaseSettingItem`) live in `src/types.ts`.

A small `src/vite-env.d.ts` adds module shims for `*.module.scss` and `*.module.css` so `import styles from './X.module.scss'` is typed as a read-only `Record<string, string>`.

`pnpm typecheck` runs `tsc --noEmit` over the whole project (including node-side scripts). It runs automatically as the first step of `pnpm build`.

---

## Project structure

Every component is self-contained: a `.tsx` file (markup + behaviour), a `.module.scss` (scoped styles), and a `.test.tsx` (unit tests). The top-level `App.tsx` also has a dedicated `App.test.tsx` covering the page-wide accessibility behaviour (skip link, single h1, drawer dialog semantics, Escape-to-close, focus return). There are **57 passing tests across 11 test files**.

---

## Styling conventions

### Design tokens

All design values live in `src/styles/_variables.scss` as CSS custom properties, grouped by category:

* **Color** - brand, surfaces, text, borders, indicators
* **Spacing** - a numeric 2px-step scale (`--space-2` through `--space-32`, plus `--space-36`, `--space-48`, `--space-96`)
* **Radii / shadows** - `--radius-sm/md/lg/xl`, `--shadow-sm/md/avatar/drawer`
* **Typography** - `--font-size-{xs,sm,base,md,lg,xl,2xl}`, `--font-weight-{normal,medium,semibold,bold}`, `--line-height-{tight,snug,relaxed}`, `--letter-spacing-{tight,wide}`
* **Transitions** - `--transition-{fast,base,slow}`
* **Z-index** - `--z-mobile-bar`, `--z-avatar`, `--z-backdrop`, `--z-drawer`
* **Card tokens** - `--card-bg`, `--card-border`, `--card-radius`, `--card-shadow`, `--card-padding`, `--card-min-height` (see below)

Components consume these via `var(--…)`. Changing a token in `_variables.scss` propagates everywhere.

### CSS variables for repeatable patterns

The clearest pattern in this UI is the **interactive card surface** - `WorkflowCard` (default variant) and `PortalCard` share an identical look (background, border, radius, shadow, padding, lift-on-hover, focus-ring). That pattern is captured two ways:

1. **CSS custom properties** under the `--card-*` namespace store the individual values (`--card-radius`, `--card-shadow`, etc.).
2. **`@mixin card-interactive`** in `_mixins.scss` composes those tokens into the full pattern (declarations + `&:hover` + `&:focus-visible`) so components only need one line:

   ```scss
   .card {
     @include card-interactive;
     // …card-specific overrides…
   }
   ```

Other reusable mixins:

* **`@mixin focus-ring`** - the `outline: 2px solid var(--color-primary); outline-offset: 2px;` pattern reused for focus styles across multiple components.
* **`@mixin sr-only`** - visually hidden but exposed to assistive tech.
* **`@mixin tablet-down` / `@mixin mobile` / `@mixin mobile-sm`** - breakpoint helpers (≤1024, ≤640, ≤380).

### Alphabetical property order

Inside every rule block, **CSS properties are listed alphabetically**. Nested rules (`&:hover`, `&::placeholder`, `@media (…)`, etc.) come after the declarations. `@include` calls that emit declarations sit at the top of the block.

This convention makes diffs predictable and removes any "where should this go?" ambiguity when adding properties.

---

## Layout

* **Layout** is hand-rolled with CSS Grid + Flexbox. No Bootstrap, Tailwind, or any other styling framework. Only `sass` for the SCSS compiler.
* **Responsive behaviour**: the main layout uses a CSS Grid with `auto 1fr` on desktop. Below 640px the left rail becomes a fixed off-canvas drawer toggled by a hamburger button in a sticky top bar. Workflow / portal card grids collapse from 3 → 2 → 1 columns. Verified down to 320px wide.
* **Fonts**: Inter, loaded from Google Fonts with `preconnect`.

---

## Accessibility

A summary of what's wired up and why:

* **Skip link** (WCAG 2.4.1 Bypass Blocks). A "Skip to main content" link is the first focusable element on the page; it's visually hidden until focused and jumps to `<main id="main-content">`.
* **Single, correct heading outline**. The page has one `<h1>` (RainFocus Summit), `<h2>` for "Event setup guide", `<h3>` for "Attendee", `<h4>` for the base-settings cells. No skipped levels; no duplicated text across heading levels. The sidebar's event name is intentionally *not* a heading (it's workspace context), and the sidebar region is named via `aria-label="Event navigation"`.
* **Landmarks**: `<header>` (mobile top bar), `<main>` (content), `<aside aria-label="Event navigation">`, `<nav aria-label="Organization">` (brand rail), and `<nav aria-label="Sections">` (sidebar list).
* **Active page**: every nav item carries `aria-current="page"` when it's the active leaf (works for both parent and child rows).
* **Disclosure pattern** on sidebar parents that have children: `aria-expanded` reflects the active-path state, and `aria-controls` references the sub-list's id. Following the WAI-ARIA Authoring Practices Disclosure pattern.
* **Mobile drawer is a real dialog**:
  - The hamburger trigger has `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` referencing the drawer.
  - When opened, the drawer container gets `role="dialog"`, `aria-modal="true"`, and `aria-label="Event navigation"`.
  - Focus moves into the drawer on open and returns to the trigger on close.
  - **Escape** closes the drawer.
  - When closed, the drawer is hidden with `visibility: hidden` (delayed via transition so the slide-out animation completes), which **removes the drawer's contents from the tab order**. Tab keys can't reach off-canvas controls.
* **Touch targets**: the hamburger button is 44×44 on mobile (WCAG 2.5.5 / Apple HIG).
* **Reduced motion**: a global rule in `_reset.scss` collapses every animation/transition duration to ~0 when the user has `prefers-reduced-motion: reduce` set (WCAG 2.3.3).
* **Decorative SVGs** carry empty `alt=""` so screen readers skip them. Icons that convey meaning (e.g., the search magnifier) are rendered inside elements that already have a text label.
* **Form control labels**: the search input has a visually-hidden `<label>` linked by `htmlFor` / `useId`.
* **Focus styles**: `:focus-visible` shows a 2px primary-color outline with 2px offset on every interactive element. Programmatic- focus targets (skip-link landing, drawer container) use `outline: none` to avoid visual noise when the focus wasn't user-driven.
* **Avatars**: rendered with `role="img"` and an `aria-label`. When a `name` is passed the label becomes `"Faye Loring (FL)"`; otherwise the initials alone are used.
* **All visible text lives in a text element** (`<h1>`–`<h6>`, `<p>`,
  `<a>`, `<span>`, `<label>`). Notably:
  - The sidebar event name is a `<p>` (not a `<div>`).
  - Bare text inside `<button>` is wrapped in a `<span>` - Button's `children` are wrapped automatically, and Sidebar's child nav labels are wrapped explicitly. This keeps `role="text"`-style "broken copy" issues (VoiceOver iOS reading chunks separately) structurally impossible.
* **Decorative inline SVGs** carry `aria-hidden="true"` *and* `focusable="false"` on the `<svg>` element itself (per a11y-101's Accessible SVGs guidance), not just on a wrapper.

### Things I considered but didn't change

* **Duplicate "Attendees" parent/child labels**. The visible text in the design has an "Attendees" section that itself contains an "Attendees" page. Both buttons are correctly distinguishable via the disclosure semantics (the parent has `aria-expanded` and `aria-controls`; the child doesn't), but the bare accessible name is the same. Fixing this with visually-hidden suffixes would diverge from the design copy. **Flagging it as a content/UX question rather than silently rewording.**
* **Placeholder text contrast**. The search placeholder uses `--color-text-subtle` (#9CA3AF on white, ~2.85:1) - below the 4.5:1 WCAG AA target for normal text. Placeholder text is exempt under WCAG when it duplicates the field's accessible name (it does, via the sr-only `<label>`). The token is preserved to match the Figma; bumping it up across the app is a one-line change in `_variables.scss` if a stricter pass is desired.

---

## Assets

All icons and images were exported from the Figma file and committed to `public/assets/`:

| File                          | Source                              |
| ----------------------------- | ----------------------------------- |
| `icons/rf-logo.svg`           | "Nav Logo.svg" (brand mark)         |
| `icons/person-portal.svg`     | "Accordion / Person Portal.svg"     |
| `icons/add-circle.svg`        | Add circle outline                  |
| `icons/computer.svg`          | Computer / monitor icon             |
| `icons/logic-arrow.svg`       | Workflow arrow                      |
| `event-logo.png`              | Mountain-sun event mark (small)     |
| `event-logo-large.png`        | Mountain-sun event mark (high-res)  |

---

## Testing strategy

Each component has its own `*.test.tsx` covering the props / behaviour that actually matter:

* `BrandRail` - landmark role, link/button labels, custom event name.
* `Sidebar` - header text, top-level items, `aria-current` on active, sub-list visibility, `onSelect` callback, searchbox presence.
* `SearchInput` - role, placeholder, change handler, custom aria-label.
* `Button` - children rendering, default `type="button"`, click handler, forwarded props, `disabled` behaviour.
* `EventHeader` - heading, date/location text, edit-button callback.
* `SetupGuide` - heading, intro copy, all step labels, the three workflow cards + add card, the portal card.
* `BaseSettingsCard` - one cell per item, descriptions render, empty list.
* `WorkflowCard` - default and `add` variants, missing description, click handler, button semantics.
* `PortalCard` - title/description, click handler.
* `Avatar` - initials, casing, truncation, accessible label with name.

Tests run with Vitest's `jsdom` environment and Testing Library's `@testing-library/react` + `user-event`.

---

## Tech decisions

A walkthrough of the choices that shaped this project and the reasoning behind each. None of these are absolute. They're trade-offs that fit this brief specifically.

### Why pnpm (over npm or yarn)

* **Strict module resolution by default.** pnpm builds a non-flat `node_modules` so each package can only import what it explicitly declared as a dependency. npm and Yarn Classic both hoist everything to the top level, which means code can accidentally import a "phantom" transitive dependency that disappears the moment any other package in the tree updates. pnpm makes that class of bug structurally impossible.
* **Disk-efficient.** Packages are stored once in a content-addressable global store; project `node_modules` folders are just hardlinks. With multiple projects on the same machine the savings add up; cold installs of fresh clones are also noticeably faster.
* **Reproducible installs out of the box.** `pnpm-lock.yaml` plus the `packageManager` field in `package.json` (`pnpm@9.0.0`) means anyone with Corepack enabled gets the same pnpm version automatically - no global install needed.
* **Yarn comparison.** Yarn Berry (PnP) solves the strict-resolution problem differently but introduces its own ecosystem quirks (zip-fs loaders, editor SDKs). For a project of this size, pnpm's "boring, works like a normal node_modules but stricter" model is the lower- friction choice.

### Why React + Vite (over Next.js or Svelte)

**Next.js was a reasonable candidate, but:**

* It's optimised for **multi-page apps with data fetching, routing, image optimisation, server actions, middleware**. This brief is a single page with no routing and no backend. Most of Next's strengths would sit unused, but its weight (and the conceptual surface area of its conventions) would still ship.
* Vite gives us SSR via a small, well-documented API that we can drive ourselves (`entry-server.tsx` + a ~30-line `prerender.ts`) rather than learning a framework's data-fetching abstractions for a use case that doesn't need them.

**Svelte / SvelteKit would have produced a smaller bundle, but:**

* This kind of dashboard UI benefits from the broader React ecosystem (testing libraries, a11y tooling, design system components) when it grows.

**Vite specifically because:**

* Native ESM dev server - cold start is sub-second; HMR is instant.
* First-class TypeScript, SCSS, and CSS Modules support with no additional config.
* A **single config file** (`vite.config.ts`) powers dev, build, *and* Vitest. Lower cognitive load than separately maintaining webpack/jest/babel configs.
* The SSR build is a first-class output, not a plugin. `--ssr` produces a real server bundle we can `import()` from a prerender script.

### Why a build-time prerender (over runtime SSR)

* The brief says reviewers should "load the build file into the browser and see the completed work without having to build ourselves."
* A long-lived SSR server fails that requirement; static HTML satisfies it on any host (or even via `file://` for a non-interactive preview).
* The SSR codepath is retained (the same `entry-server.tsx` is loaded by both `server.ts` for dev and `prerender.ts` for builds) so if a page ever needs request-time data, the architecture is already in place.

### Why TypeScript in strict mode

* The challenge didn't require TypeScript, but once the project crosses ~5 components with shared types (NavItem, EventInfo, …), TS is a net productivity win, not a tax.
* Strict mode (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`) was enabled from day one because the cost of *relaxing* later is much lower than the cost of *tightening* later. Strict from the start, never strict retroactively.

### Why SCSS Modules + CSS custom properties (over CSS-in-JS)

* **CSS Modules** scope class names automatically - no BEM discipline needed, no global-namespace collisions, and the `Record<string, string>` shape is trivially typed.
* **SCSS** adds the bits CSS Modules alone don't have: mixins (`card-interactive`, `focus-ring`, `sr-only`, breakpoint helpers) and nesting (`&:hover`, `@media`). It's compiled away at build time with zero runtime cost.
* **CSS custom properties** for *values* (colors, spacing, fonts, transitions, card tokens) live in `_variables.scss` and are consumed via `var(--…)`. They cascade, theme cleanly, can be overridden at runtime, and don't require any preprocessor knowledge to read. This is the layer most reviewers will want to touch.
* **CSS-in-JS was avoided** because the runtime cost (component-tree walking, style injection, hydration mismatch foot-guns) buys nothing for a mostly-static page. The mental model of "tokens in `_variables`, patterns in `_mixins`, scoped layout in `.module.scss`" stays in one language families designers are comfortable with.

### Why Vitest + React Testing Library

* **Vitest** because it shares the Vite config - no separate Jest setup, no ts-jest, no `jest.config.js` drift. ESM and TypeScript work natively. Its API is a near-superset of Jest's, so the muscle memory carries over.
* **React Testing Library** because tests query the DOM the way *users* do (by role, accessible name) rather than by implementation details. This is doubly valuable here: the same `getByRole('button', { name: /…/ })` query that verifies behaviour also verifies that the control has an accessible name. The a11y work in this project would have been much harder to keep regression-free without RTL's role-first query API.

### Why ESLint + Prettier together (instead of one tool)

* **Prettier** owns formatting - line width, quotes, trailing commas. No style debates.
* **ESLint** owns code-quality rules (unused vars, hook rules, React-specific lints, TypeScript-aware checks via `@typescript-eslint`).
* `eslint-config-prettier` disables the formatting rules in ESLint so the two tools don't fight over the same lines. This is the long- established convention; tools like Biome are an option but re-implementing the rules set is its own project.

### Why `tsx` to run Node-side scripts

* `server.ts`, `prerender.ts`, and `serve.ts` are TypeScript. `tsx` (via `node --import tsx/esm`) runs them directly with native ESM resolution and no compile step.
* The alternatives, emitting JS via a separate `tsc -p tsconfig.node.json` pass, or `ts-node` (slower, occasional ESM/CJS friction), both add pipeline steps for very little benefit on three small scripts.

### Why Express for the production server

* `serve.ts` is ~12 lines: `compression` + `serve-static` for `dist/client/`. Express is the lowest-common-denominator way to achieve that in Node.
* The whole script is convenience-grade; the actual deliverable is the contents of `dist/client/`, which can be hosted on **any** static CDN/object store (S3 + CloudFront, Netlify, GitHub Pages, …).

### Why a numeric spacing scale (over named t-shirt sizes)

* Initially I used `--space-xs/sm/md/lg/2xl`, but the design uses several "in-between" pixel values (14, 18, 22) that don't map cleanly onto a coarse t-shirt scale.
* Switched to a numeric 2px-step scale (`--space-2` … `--space-32`, plus `--space-36`, `--space-48`, `--space-96`) which gives a direct, predictable mapping from a Figma value to a token. The scale stays disciplined (no arbitrary one-off pixel values in components) while staying expressive enough to hit the design.
