# GmapVue - Copilot Instructions

## Repository Overview

**GmapVue** is a Vue plugin that wraps the Google Maps JavaScript API into Vue components. This is a **pnpm workspace monorepo** forked from vue2-google-maps, containing:

- **Vue 2 plugin** (`packages/v2`) - Version 3.5.4 published as `@gmap-vue/v2`
- **Vue 3 plugin** (`packages/v3`) - Version 2.1.5 published as `@gmap-vue/v3` (primary package)
- **Docusaurus documentation** (`packages/documentation`) - Published to GitHub Pages
- **Legacy documentation** (`packages/old-documentation`) - Archived v1 docs

**Key Technologies:**

- Package Manager: **pnpm 9.13.2** (specified in `packageManager` field)
- Node Version: **LTS (latest)** - specified in `.node-version` as `24`
- CI uses: **Node 18.x, 20.x, 22.x** on **ubuntu-latest and windows-latest**
- Build Tools: Vite (v3), Rollup (v2), TypeScript, Vue SFC compiler
- Testing: Vitest (unit tests), Cypress (e2e tests)
- Linting: ESLint (flat config), Prettier
- Release: semantic-release with conventional commits

## Build & Validation Process

### Initial Setup (REQUIRED ORDER)

**ALWAYS run these steps in this exact order:**

1. **Install Node.js LTS:**

   ```bash
   fnm install 24 && fnm use 24
   ```

   Note: The `.node-version` file specifies version `24`. You should have this version installed.

2. **Install dependencies:**
   ```bash
   pnpm install
   ```
   Expected warnings (safe to ignore):
   - `DeprecationWarning: url.parse() behavior is not standardized` - From pnpm itself
   - `husky - install command is DEPRECATED` - Still functional
   - `Snyk protect was removed at 31 March 2022` - From old-documentation package
   - Installation takes approximately **6-10 seconds**

### Building

**Build all packages:**

```bash
pnpm run build:all
```

- Builds v2, v3, and documentation packages
- Takes approximately **15-20 seconds**
- Outputs to `packages/*/dist/` directories

**Build individual packages:**

```bash
# Vue 3 (primary package) - takes ~3-4 seconds
cd packages/v3 && pnpm run build

# Vue 2 - takes ~2-3 seconds
cd packages/v2 && pnpm run build

# Documentation - takes ~15 seconds
cd packages/documentation && pnpm run build
```

**Expected build warnings (safe to ignore):**

- `Browserslist: browsers data (caniuse-lite) is 17 months old` - Ignore or update with `npx update-browserslist-db@latest`
- v2 rollup warning: "Mixing named and default exports" - Known issue, doesn't affect functionality
- Documentation warnings about blog authors and truncation markers - Cosmetic only
- Documentation warnings about broken anchors - Known issues in legacy docs

### Testing

**Run all tests:**

```bash
pnpm run test
```

- Runs unit tests across all packages using `test:ci` script
- Takes approximately **3-5 seconds**
- Currently only v3 has tests (21 test files, 86 tests)
- v2 has placeholder: `echo 'not implemented yet'`

**Run v3 tests directly:**

```bash
cd packages/v3
pnpm run test        # Interactive mode
pnpm run test:ci     # CI mode (single run)
pnpm run coverage    # With coverage report
```

**Run e2e tests (requires Google Maps API key):**

```bash
pnpm run test:e2e    # All packages with e2e tests
```

- Requires `.env` file in `packages/v3/cypress/runner/.env` with:
  ```
  VITE_GOOGLE_API_KEY=your_key_here
  ```
- Installs Cypress automatically if not present
- Takes approximately **30-60 seconds** (depends on network)

### Linting

**Run linting:**

```bash
pnpm run lint
```

- Runs Prettier (format) then ESLint (fix) on all packages
- Takes approximately **7-10 seconds**
- Expected warnings: Browserslist warning (safe to ignore)

**Package-specific linting:**

```bash
# v3 uses ESLint flat config with TypeScript type checking
cd packages/v3 && pnpm run lint

# v2 uses traditional ESLint config
cd packages/v2 && pnpm run lint
```

### Running Documentation Locally

```bash
pnpm run serve:docs
```

- Starts Docusaurus dev server at http://localhost:3000/gmap-vue/
- Takes approximately **15-20 seconds** to compile
- Expected warnings: Docusaurus update available, blog authors, truncation markers

### Pre-commit Validation

**Git hooks are configured via Husky:**

- Pre-commit: Runs `pnpm run --recursive lint-staged`
- Lint-staged config in `.lintstagedrc.yml`:
  ```yaml
  "*.{vue,js,ts,jsx,tsx}":
    - "pnpm run lint"
  ```
- Commit-msg: Enforces conventional commits via commitlint

### Commit Message Requirements

**CRITICAL: All commits MUST follow this pattern or CI will fail:**

```
type(scope): subject

[optional body]

[optional footer]
```

**Required conventions:**

- **Type:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Scope (REQUIRED):** `v2`, `v3`, `next`, `docs`, `root`, `all`
- **Subject:** 15-100 characters, lowercase
- **Body:** Max 1000 characters, blank line before body required
- **Footer:** Max 300 characters, blank line before footer required

**Examples:**

```bash
feat(v3): add polygon editing support
fix(v2): resolve marker clustering memory leak
docs(docs): update installation guide
chore(root): update pnpm to 9.13.2
```

## Project Layout & Architecture

### Root Directory Structure

```
.
├── .github/                    # CI/CD workflows and GitHub config
│   ├── workflows/
│   │   ├── publish.yml        # Main CI: build, test, publish (Node 18/20/22)
│   │   └── documentation.yml  # Docs deployment to gh-pages
│   └── [other github configs]
├── packages/                   # Monorepo packages
│   ├── v2/                    # Vue 2 plugin (@gmap-vue/v2)
│   ├── v3/                    # Vue 3 plugin (@gmap-vue/v3) - PRIMARY
│   ├── documentation/         # Docusaurus site
│   └── old-documentation/     # Archived docs (deprecated)
├── .editorconfig              # 2-space indent, LF line endings
├── .lintstagedrc.yml          # Pre-commit linting config
├── .node-version              # Node version: 24
├── commitlint.config.js       # Commit message enforcement
├── package.json               # Root workspace scripts
├── pnpm-workspace.yaml        # Workspace definition
└── README.md                  # Primary documentation
```

### Packages/v3 (Vue 3 Plugin - PRIMARY)

**This is the main actively developed package.**

```
packages/v3/
├── src/
│   ├── main.ts                # Plugin entry point
│   ├── components/            # Map components (index exports ~20 components)
│   ├── composables/           # Composition API utilities
│   ├── interfaces/            # TypeScript interfaces
│   ├── keys/                  # Vue injection keys
│   └── types/                 # TypeScript type definitions
├── tests/                     # Vitest unit tests (~21 test files)
├── cypress/                   # E2E tests with Cypress
│   ├── e2e/                   # Test specs
│   ├── runner/                # Test runner app with vite config
│   │   └── .env              # Required: VITE_GOOGLE_API_KEY
│   └── support/               # Cypress support files
├── dist/                      # Build output (gitignored)
│   ├── main.es.js            # ES module bundle
│   ├── main.umd.js           # UMD bundle
│   ├── types/                # TypeScript declarations
│   └── [other bundles]
├── vite.config.ts            # Build configuration (uses vite-plugin-dts)
├── eslint.config.mjs         # ESLint flat config with TS type checking
├── vitest.config.ts          # Test configuration
├── cypress.config.ts         # E2E test configuration
├── tsconfig.app.json         # App TypeScript config
├── tsconfig.eslint.json      # ESLint TypeScript config (project reference)
├── tsconfig.vitest.json      # Test TypeScript config
└── package.json              # Dependencies and scripts
```

**Key v3 scripts:**

- `build` - Production build with Vite
- `build:dev` - Development build (no minification)
- `test` - Interactive Vitest
- `test:ci` - Single run with no watch
- `test:e2e:ci` - Cypress e2e in CI mode
- `type-check` - TypeScript type checking
- `lint` - Prettier + ESLint (fixes automatically)
- `release` - semantic-release (auto version bump & publish)

### Packages/v2 (Vue 2 Plugin)

**Legacy package still maintained for Vue 2 users.**

```
packages/v2/
├── src/
│   ├── main.js               # Plugin entry point
│   ├── components/           # Map components (Vue 2 SFCs)
│   ├── mixins/               # Vue 2 mixins
│   └── utils/                # Utilities and factories
├── dist/                     # Rollup build output
│   ├── esm/                  # ES modules (tree-shakeable)
│   ├── main.js               # UMD bundle
│   └── gmap-vue.min.js       # Minified UMD
├── rollup.config.js          # Build configuration
└── package.json              # No tests yet: test: 'echo not implemented'
```

**Key v2 scripts:**

- `build` - Production build with Rollup
- `build:dev` - Development build
- `lint` - Prettier + ESLint
- `test` - Not implemented (placeholder)

### Packages/documentation (Docusaurus)

```
packages/documentation/
├── docs/                     # Markdown documentation
│   ├── vue-2-version/        # v2 plugin docs
│   └── vue-3-version/        # v3 plugin docs
├── blog/                     # Blog posts
├── src/                      # React components and pages
├── static/                   # Static assets
├── build/                    # Build output for GitHub Pages
├── docusaurus.config.ts      # Docusaurus configuration
└── sidebars.ts               # Sidebar navigation structure
```

**Documentation-specific notes:**

- Build output goes to `build/` directory
- Uses Docusaurus 3.6.3 (update available to 3.9.2)
- Published to `gh-pages` branch via documentation.yml workflow
- **HACK:** documentation.yml removes `pnpm-workspace.yaml` before build to isolate docs dependencies

## CI/CD Pipeline & Validation

### Publish Workflow (.github/workflows/publish.yml)

Runs on: **push to master** and **all PRs**

**Jobs:**

1. **install-and-cache** - Installs dependencies (Node 22.x, pnpm)
2. **build** - Builds v3 package only (artifacts uploaded)
3. **test** - Matrix strategy:
   - OS: ubuntu-latest, windows-latest
   - Node: 18.x, 20.x, 22.x
   - Test plans: `test`, `test:e2e`
   - Requires `.env` file creation with `VITE_GOOGLE_API_KEY`
4. **publish** - Only on master, uses semantic-release

**Important:**

- Only v3 is tested and published via CI
- v2 relies on separate semantic-release setup
- Tests run on 12 combinations (2 OS × 3 Node versions × 2 test plans)

### Documentation Workflow (.github/workflows/documentation.yml)

Runs on: **push to master only**

**Steps:**

- Installs pnpm globally (version 9.15.2)
- **CRITICAL WORKAROUND:** Removes `pnpm-workspace.yaml` before install to prevent workspace resolution issues
- Builds in `packages/documentation` directory
- Deploys to `gh-pages` branch using crazy-max/ghaction-github-pages@v4

## Configuration Files

### Linting & Formatting

- **Root:** `.editorconfig` (2-space indent, LF line endings)
- **v3:**
  - `eslint.config.mjs` - Flat config with TypeScript type checking, Vue3 recommended rules
  - `.prettierrc.yaml` - Single quotes only
  - Ignores: `.pack/*`, `dist/*`, `coverage/*`, `cypress/runner/dist/*`
- **v2:**
  - Traditional `.eslintrc` style (embedded in package.json or separate)
  - `.prettierrc.yaml` - Single quotes only

### TypeScript Configuration (v3 only)

- `tsconfig.json` - Base config for workspace
- `tsconfig.app.json` - Application code (strict mode, Vue3 support)
- `tsconfig.eslint.json` - Project reference for ESLint type checking
- `tsconfig.vitest.json` - Test-specific config
- `tsconfig.node.json` - Config files (vite.config.ts, etc.)

**Important:** Always use `tsconfig.eslint.json` for ESLint type checking to avoid performance issues with project references.

### Build Configuration

**v3 (Vite):**

- Entry points: main.ts, components/index.ts, composables/index.ts, keys/index.ts
- Output: CJS and ES formats
- External deps: vue, @googlemaps/markerclusterer, google.maps
- Uses vite-plugin-dts for TypeScript declaration generation

**v2 (Rollup):**

- Entry: src/main.js
- Output: ESM modules (tree-shakeable), UMD, UMD minified, IIFE minified
- External deps: vue, @googlemaps/markerclusterer
- Uses rollup-plugin-vue for SFC compilation

## Known Issues & Workarounds

### 1. Node Version Management

**Issue:** Node version managers (fnm, nvm) need the specified version installed.

**Fix:** Always explicitly run: `fnm install 24 && fnm use 24`

### 2. Documentation Build in Monorepo

**Issue:** pnpm workspace resolution conflicts with Docusaurus dependencies.

**CI Workaround:** Remove `pnpm-workspace.yaml` before building docs:

```bash
rm -rf ./pnpm-workspace.yaml
cd packages/documentation && pnpm install && pnpm run build
```

**Local Development:** No workaround needed, `pnpm run serve:docs` works from root.

### 3. Husky Deprecation Warning

**Issue:** `husky install` command is deprecated.

**Status:** Warning is cosmetic, hooks still function correctly. Future update needed to Husky v9+ API.

### 4. V2 Build Warnings

**Issue:** Rollup warns about mixing named and default exports.

**Status:** Safe to ignore. Consumers must use `.default` for default export, which is documented.

### 5. Semantic Release Configuration

**Issue:** v2 and v3 use different tag formats to allow independent releases.

**Tags:**

- v3: `gmv3_v${version}` (e.g., gmv3_v2.1.5)
- v2: `gmv2_v${version}` (e.g., gmv2_v3.5.4)

**Release Rules:**

- v3 ignores commits with scope: v2, docs, next, root, gmap-vue, gmap-vue-next
- v2 ignores commits with scope: v3, docs, next, root, gmap-vue-next

### 6. E2E Tests Require Google Maps API Key

**Issue:** Cypress e2e tests fail without API key.

**Fix:** Create `packages/v3/cypress/runner/.env`:

```bash
echo "VITE_GOOGLE_API_KEY=your_key_here" > packages/v3/cypress/runner/.env
```

CI creates this file automatically from secrets.

### 7. TODOs and Technical Debt

Several TODOs exist in v2 codebase:

- Many "TODO: analyze" comments about potential refactoring
- HACK: Cluster loaded unconditionally (should be conditional)
- Several disabled ESLint rules needing review

**When working on v2:** Check inline comments for context before modifying related code.

## Mandatory Post-Change Validation

**CRITICAL: After EVERY code change, always run these three commands from the repository root in this order and fix any errors before considering the task done:**

```bash
pnpm run lint      # Must exit 0 — fix all ESLint/Prettier errors before proceeding
pnpm run test      # Must exit 0 — fix all failing unit tests before proceeding
pnpm run test:e2e  # Must exit 0 — fix all failing e2e tests before proceeding
```

Do not skip any of these steps. Do not proceed to commit or hand back to the user if any of them fails.

## Validation Checklist

Before submitting a PR, ensure:

1. ✅ Code builds: `pnpm run build:all` succeeds
2. ✅ Tests pass: `pnpm run test` succeeds (v3 only)
3. ✅ Linting passes: `pnpm run lint` succeeds
4. ✅ E2E tests pass: `pnpm run test:e2e` succeeds
5. ✅ Commits follow conventional format (enforced by commitlint)
6. ✅ Documentation builds: `cd packages/documentation && pnpm run build` succeeds
7. ✅ Type checking (v3): `cd packages/v3 && pnpm run type-check` succeeds
8. ✅ No new ESLint errors or TypeScript errors introduced

**For documentation changes:** 9. ✅ Preview locally: `pnpm run serve:docs` and verify changes

## Quick Reference

**Most Common Commands:**

```bash
# Setup
fnm install lts-latest && fnm use lts-latest
pnpm install

# Development
pnpm run build:all         # Build everything
pnpm run test              # Run unit tests
pnpm run lint              # Lint and format
pnpm run serve:docs        # Start docs locally

# Package-specific
cd packages/v3 && pnpm run dev        # Dev mode with Vite
cd packages/v3 && pnpm run test       # Interactive tests
cd packages/v3 && pnpm run test:e2e   # Run Cypress

# Validation
pnpm run build:all && pnpm run test && pnpm run lint
```

**Trust These Instructions:** The information in this document has been validated by running commands and reading configuration files. Only search for additional information if these instructions are incomplete or encounter specific errors not documented here.
