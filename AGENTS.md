# GmapVue - Custom Agents

This document defines specialized AI agents for working with the GmapVue monorepo. Each agent has domain-specific expertise to help with different aspects of the project.

**Important:** All agents should refer to `.github/copilot-instructions.md` for general repository setup, build processes, and validation steps.

---

## Vue3PluginExpert

**Expertise:** Vue 3 composition API, TypeScript, Google Maps JavaScript API integration, reactive component development

**Primary Focus:** `packages/v3/` - The main actively developed package

### Responsibilities

- Implement new Vue 3 components wrapping Google Maps features
- Write and maintain composables for Maps API functionality
- Ensure TypeScript type safety with proper interfaces and types
- Write unit tests using Vitest
- Write e2e tests using Cypress
- Maintain Vue 3 reactivity and composition API best practices

### Key Context

- **Entry Point:** `packages/v3/src/main.ts`
- **Components:** `packages/v3/src/components/` (~20 components)
- **Composables:** `packages/v3/src/composables/` (promise-lazy-builder, resize-bus, shapes-helper, etc.)
- **Types:** `packages/v3/src/types/` and `packages/v3/src/interfaces/`
- **Tests:** `packages/v3/tests/` (21 test files, 86 tests with Vitest)
- **E2E:** `packages/v3/cypress/e2e/`

### Build & Test Commands

```bash
cd packages/v3

# Development
pnpm run dev              # Start Vite dev server
pnpm run build            # Production build (~3-4 seconds)
pnpm run build:dev        # Development build (no minification)

# Testing
pnpm run test             # Interactive Vitest
pnpm run test:ci          # Single run for CI
pnpm run coverage         # With coverage report
pnpm run test:e2e         # Cypress e2e (requires API key in cypress/runner/.env)
pnpm run test:e2e:ci      # Cypress in CI mode

# Validation
pnpm run type-check       # TypeScript type checking
pnpm run lint             # Prettier + ESLint with auto-fix
```

### Configuration Files

- `vite.config.ts` - Build configuration (CJS + ES formats, vite-plugin-dts)
- `eslint.config.mjs` - ESLint flat config with TypeScript type checking
- `vitest.config.ts` - Unit test configuration (jsdom environment)
- `cypress.config.ts` - E2E test configuration
- `tsconfig.app.json` - Application TypeScript config (strict mode)
- `tsconfig.eslint.json` - For ESLint type checking (use this for performance)
- `tsconfig.vitest.json` - Test TypeScript config

### Important Notes

- **External Dependencies:** Vue, @googlemaps/markerclusterer, google.maps (not bundled)
- **Type Checking:** Always use `tsconfig.eslint.json` for ESLint to avoid performance issues
- **E2E Tests:** Require `packages/v3/cypress/runner/.env` with `VITE_GOOGLE_API_KEY=your_key`
- **Commit Scope:** Use `(v3)` in commit messages for v3-specific changes
- **Release Tag Format:** `gmv3_v${version}` (e.g., gmv3_v2.1.5)

### Code Style

- Single quotes (Prettier config)
- 2-space indentation (.editorconfig)
- TypeScript strict mode enabled
- Follow Vue 3 recommended practices from ESLint config

---

## Vue2PluginExpert

**Expertise:** Vue 2 options API, JavaScript (not TypeScript), Google Maps JavaScript API integration, legacy Vue patterns

**Primary Focus:** `packages/v2/` - Legacy package maintained for Vue 2 users

### Responsibilities

- Maintain existing Vue 2 components
- Fix bugs in Vue 2 implementation
- Ensure backward compatibility
- Address TODOs and technical debt in codebase
- Follow Vue 2 patterns (mixins, options API)

### Key Context

- **Entry Point:** `packages/v2/src/main.js`
- **Components:** `packages/v2/src/components/` (Vue 2 SFCs)
- **Mixins:** `packages/v2/src/mixins/` (map-element, mountable)
- **Utils:** `packages/v2/src/utils/` (factories, helpers, initializer)
- **Tests:** Not implemented yet (`echo 'not implemented yet'`)

### Build Commands

```bash
cd packages/v2

# Build
pnpm run build            # Production build (~2-3 seconds)
pnpm run build:dev        # Development build
pnpm run build:test       # Test build
pnpm run clean:build      # Clean dist directory

# Validation
pnpm run lint             # Prettier + ESLint with auto-fix
pnpm run test             # Not implemented (returns placeholder)
```

### Configuration Files

- `rollup.config.js` - Build configuration (ESM, UMD, UMD minified, IIFE)
- `.prettierrc.yaml` - Single quotes only
- ESLint config (embedded in package.json or separate .eslintrc)

### Important Notes

- **Known Warning:** "Mixing named and default exports" - Safe to ignore, documented behavior
- **External Dependencies:** Vue, @googlemaps/markerclusterer (not bundled)
- **Output Formats:** ESM (tree-shakeable), UMD, UMD minified, IIFE minified
- **Commit Scope:** Use `(v2)` in commit messages for v2-specific changes
- **Release Tag Format:** `gmv2_v${version}` (e.g., gmv2_v3.5.4)
- **Technical Debt:** Many TODO comments exist - check inline comments before modifying
- **HACK Alert:** Cluster loaded unconditionally (should be conditional) - see `src/main.js`

### TODOs in Codebase (Important Context)

- Multiple "TODO: analyze" comments about potential refactoring
- Several disabled ESLint rules needing review
- Promise-based API that may need simplification
- Check inline comments before modifying related code

### Code Style

- Single quotes (Prettier config)
- 2-space indentation (.editorconfig)
- Follow Vue 2 patterns (options API, mixins)
- Airbnb JavaScript style guide

---

## DocumentationExpert

**Expertise:** Docusaurus, technical writing, API documentation, Markdown, React (for Docusaurus components)

**Primary Focus:** `packages/documentation/` - Docusaurus-based documentation site

### Responsibilities

- Write and update documentation for Vue 2 and Vue 3 plugins
- Maintain API reference documentation
- Create guides and tutorials
- Update blog posts and release notes
- Manage documentation structure and navigation

### Key Context

- **Docs Directory:** `packages/documentation/docs/`
  - `vue-2-version/` - v2 plugin documentation
  - `vue-3-version/` - v3 plugin documentation
- **Blog:** `packages/documentation/blog/`
- **Components:** `packages/documentation/src/` (React components)
- **Static Assets:** `packages/documentation/static/`
- **Build Output:** `packages/documentation/build/` (deployed to gh-pages)

### Commands

```bash
cd packages/documentation

# Development
pnpm run start            # Start dev server at http://localhost:3000/gmap-vue/
pnpm run docusaurus       # Run Docusaurus CLI

# Build & Deploy
pnpm run build            # Production build (~15 seconds)
pnpm run serve            # Serve built site locally
pnpm run deploy           # Deploy to GitHub Pages
pnpm run typecheck        # TypeScript type checking

# Utilities
pnpm run clear            # Clear cache
pnpm run write-translations
pnpm run write-heading-ids
```

### Configuration Files

- `docusaurus.config.ts` - Main Docusaurus configuration
- `sidebars.ts` - Sidebar navigation structure
- `constants.ts` - Site constants
- `tsconfig.json` - TypeScript configuration

### Important Notes

- **Docusaurus Version:** 3.6.3 (update available to 3.9.2)
- **Base URL:** `/gmap-vue/` (GitHub Pages subdirectory)
- **Node Requirement:** >= 18.0
- **Expected Warnings (safe to ignore):**
  - Blog authors not in authors.yml
  - Missing truncation markers in blog posts
  - Broken anchors in legacy docs
  - Browserslist data outdated
- **CI Workaround:** Documentation workflow removes `pnpm-workspace.yaml` before build
- **Commit Scope:** Use `(docs)` in commit messages

### Documentation Structure

```
docs/
├── vue-2-version/
│   ├── guide/          # User guides
│   ├── api/            # API reference
│   ├── code/           # Code examples
│   └── developers/     # Contributing guide
└── vue-3-version/
    ├── guide/          # User guides
    ├── api/            # API reference
    └── developers/     # Contributing guide
```

### Code Style

- Follow Docusaurus best practices
- Use MDX for interactive documentation
- Keep navigation structure in `sidebars.ts`
- Add truncation markers (`<!-- truncate -->`) in blog posts

---

## TestingExpert

**Expertise:** Vitest, Cypress, test-driven development, mocking Google Maps API, component testing

**Primary Focus:** Testing infrastructure and test coverage for v3 package

### Responsibilities

- Write unit tests for components and composables
- Write e2e tests for user interactions
- Maintain test infrastructure and configuration
- Improve test coverage
- Debug test failures in CI

### Key Context

- **Unit Tests:** `packages/v3/tests/` (21 files, 86 tests)
- **E2E Tests:** `packages/v3/cypress/e2e/`
- **Test Runner:** `packages/v3/cypress/runner/` (Vite-based test app)
- **Current Coverage:** Good coverage for composables, partial for components

### Test Commands

```bash
cd packages/v3

# Unit Tests (Vitest)
pnpm run test             # Interactive watch mode
pnpm run test:ci          # Single run (for CI)
pnpm run test:unit        # With jsdom environment
pnpm run coverage         # Generate coverage report

# E2E Tests (Cypress)
pnpm run test:e2e         # Open Cypress UI
pnpm run test:e2e:ci      # Headless mode (for CI)
pnpm run test:e2e:build   # Build test runner app
pnpm run test:e2e:preview # Preview test runner
```

### Configuration Files

- `vitest.config.ts` - Vitest configuration (jsdom, external deps)
- `cypress.config.ts` - Cypress configuration (baseUrl, specPattern)
- `packages/v3/cypress/runner/vite.config.mts` - Test runner build config
- `packages/v3/cypress/tsconfig.json` - Cypress TypeScript config

### Test Files by Category

**Composables (well-covered):**

- `promise-lazy-builder.spec.ts`
- `resize-bus.spec.ts`
- `shapes-helper.spec.ts`
- `component-promise-factory.spec.ts`
- `google-maps-api-initializer.spec.ts`

**Components (partial coverage):**

- `map-layer.spec.ts`
- `marker-icon.spec.ts`
- `circle-shape.spec.ts`
- `polygon-shape.spec.ts`
- `polyline-shape.spec.ts`
- `info-window.spec.ts`
- `cluster-icon.spec.ts`
- `heatmap-layer.spec.ts`
- `drawing-manager.spec.ts`
- `kml-layer.spec.ts`
- `autocomplete-input.spec.ts`

**Plugin & Config:**

- `main.spec.ts`
- `plugin-component-builder.spec.ts`
- `plugin-component-config.spec.ts`
- `helpers.spec.ts`

### Important Notes

- **E2E API Key:** Tests require `packages/v3/cypress/runner/.env` with valid Google Maps API key
- **Test Environment:** Vitest uses jsdom for DOM simulation
- **External Deps:** `@googlemaps/markerclusterer` and `google.maps` are externalized
- **Coverage Provider:** v8 (also supports istanbul, c8)
- **Coverage Location:** `packages/v3/coverage/`
- **CI Test Matrix:** Runs on 2 OS × 3 Node versions × 2 test plans = 12 combinations

### Mocking Strategy

- Google Maps API is typically mocked in unit tests
- Use actual API in e2e tests with valid key
- Mock global `google.maps` object structure
- Consider using `@googlemaps/jest-mocks` patterns

### Test Coverage Goals

1. All new components should have unit tests
2. All new composables should have unit tests
3. Critical user flows should have e2e tests
4. Aim for >80% coverage on new code

---

## BuildConfigExpert

**Expertise:** Vite, Rollup, bundling, TypeScript compilation, module formats, build optimization

**Primary Focus:** Build configurations for v2 (Rollup) and v3 (Vite)

### Responsibilities

- Configure and optimize build processes
- Manage module formats (CJS, ESM, UMD, IIFE)
- Handle TypeScript declaration generation
- Optimize bundle sizes
- Configure external dependencies
- Debug build issues

### Key Files

**v3 (Vite):**

- `packages/v3/vite.config.ts` - Main Vite configuration
- `packages/v3/tsconfig.app.json` - TypeScript for build
- `packages/v3/tsconfig.node.json` - TypeScript for config files
- Uses `vite-plugin-dts` for declaration generation

**v2 (Rollup):**

- `packages/v2/rollup.config.js` - Rollup configuration
- Uses `rollup-plugin-vue` for SFC compilation
- Uses `rollup-plugin-terser` for minification

### Build Configurations

**v3 Build (Vite):**

```javascript
// Entry points
{
  main: './src/main.ts',
  components: './src/components/index.ts',
  composables: './src/composables/index.ts',
  keys: './src/keys/index.ts'
}

// Output formats: CJS, ES
// External: vue, @googlemaps/markerclusterer, google.maps
// TypeScript: declarations in dist/types/
```

**v2 Build (Rollup):**

```javascript
// Entry: src/main.js
// Outputs:
// - dist/esm/ (tree-shakeable ES modules)
// - dist/main.js (UMD)
// - dist/gmap-vue.min.js (UMD minified)
// - dist/gmap-vue.iife.js (IIFE minified)
// External: vue, @googlemaps/markerclusterer
```

### Build Commands

```bash
# v3
cd packages/v3
pnpm run build            # Production (minified)
pnpm run build:dev        # Development (not minified)
pnpm run type-check       # TypeScript checking
pnpm run type-gen         # Generate declarations only

# v2
cd packages/v2
pnpm run build            # Production
pnpm run build:dev        # Development
pnpm run build:test       # Test build
pnpm run clean:build      # Clean dist/
```

### Important Notes

- **Minification Control:** v3 uses `VITE_IS_LOCAL_BUILD` env var to disable minification
- **Declaration Generation:** v3 uses vite-plugin-dts with tsconfig.app.json
- **Vue SFC Handling:** v3 uses @vitejs/plugin-vue, v2 uses rollup-plugin-vue
- **CSS Handling:** Both extract CSS separately
- **Source Maps:** Enable in development builds
- **Tree Shaking:** Maintained in ESM outputs

### Debugging Build Issues

1. Check Node version matches requirements (LTS)
2. Clear dist/ directory: `pnpm run clean:build`
3. Check for TypeScript errors: `pnpm run type-check`
4. Verify external dependencies are not bundled
5. Check rollup/vite config for entry points
6. Review package.json exports field

### Bundle Analysis

- v3 main bundle: ~42KB (resize-bus component)
- Components are code-split by default
- Use Vite's bundle visualizer for analysis
- Monitor bundle sizes in CI

---

## ReleaseExpert

**Expertise:** Semantic versioning, conventional commits, semantic-release, npm publishing, GitHub workflows

**Primary Focus:** Release automation, versioning, and changelog management

### Responsibilities

- Manage semantic releases for v2 and v3
- Ensure conventional commit compliance
- Review and update changelogs
- Debug CI/CD publish workflows
- Manage npm package publishing
- Handle version conflicts and dependencies

### Key Files

- `packages/v3/.releaserc` - v3 semantic-release config
- `packages/v2/.releaserc` - v2 semantic-release config
- `commitlint.config.js` - Commit message validation
- `.github/workflows/publish.yml` - Main CI/CD pipeline
- `.lintstagedrc.yml` - Pre-commit hooks
- `.husky/pre-commit` - Git hooks

### Semantic Release Configuration

**v3 Release Rules:**

- Tag format: `gmv3_v${version}`
- Ignores commits with scope: v2, docs, next, root, gmap-vue, gmap-vue-next
- Publishes to npm as `@gmap-vue/v3`
- Runs on master branch

**v2 Release Rules:**

- Tag format: `gmv2_v${version}`
- Ignores commits with scope: v3, docs, next, root, gmap-vue-next
- Publishes to npm as `@gmap-vue/v2`
- Runs on master branch

### Commit Message Format (STRICTLY ENFORCED)

**Pattern:**

```
type(scope): subject

[optional body]

[optional footer]
```

**Rules (from commitlint.config.js):**

- **Type (required):** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- **Scope (REQUIRED):** v2, v3, next, docs, root, all
- **Subject:** 15-100 chars, lowercase
- **Body:** Max 1000 chars, blank line before required
- **Footer:** Max 300 chars, blank line before required

**Examples:**

```bash
# Good commits
feat(v3): add street view panorama component
fix(v2): resolve marker icon memory leak
docs(docs): update API reference for circle component
chore(root): upgrade pnpm to 9.13.2

# Bad commits (will fail CI)
feat: add new feature              # ❌ Missing scope
Fix(v3): bug fix                   # ❌ Capitalized type
feat(v3): add                      # ❌ Subject too short (< 15 chars)
feat(all): Update something        # ❌ Capitalized subject
```

### CI/CD Pipeline

**Publish Workflow Stages:**

1. **install-and-cache** (Node 22.x, pnpm)
2. **build** (v3 only, uploads artifacts)
3. **test** (Matrix: 2 OS × 3 Node × 2 test plans)
4. **publish** (master only, semantic-release)

**Test Matrix:**

- OS: ubuntu-latest, windows-latest
- Node: 18.x, 20.x, 22.x
- Plans: test, test:e2e
- Total: 12 test combinations

**Publish Steps:**

1. Checkout code
2. Setup pnpm and Node
3. Install dependencies (frozen lockfile)
4. Configure git credentials
5. Run semantic-release (determines version, creates changelog)
6. Publish to npm

### Release Commands

```bash
# Manual release (if needed)
cd packages/v3
pnpm run release          # Runs semantic-release

cd packages/v2
pnpm run release          # Runs semantic-release
```

### Important Notes

- **Automatic Releases:** Triggered on merge to master with proper commits
- **Version Determination:** semantic-release analyzes commits since last release
- **Breaking Changes:** Use `BREAKING CHANGE:` in footer or `!` after scope
- **Pre-commit Validation:** Husky runs lint-staged on staged files
- **Commit Validation:** commitlint validates message format before commit
- **NPM Authentication:** Uses NPM_TOKEN secret in GitHub
- **Git Authentication:** Uses GH_TOKEN_REPO secret in GitHub

### Debugging Release Issues

1. **Release Not Triggered:** Check commit messages match rules
2. **Wrong Version Bump:** Review commit types (feat=minor, fix=patch)
3. **Publish Failed:** Check npm authentication and package access
4. **Build Artifacts Missing:** Ensure build job completed successfully
5. **Tag Conflicts:** Check for existing tags with same version

### Pre-release Checklist

- [ ] All tests passing (pnpm run test)
- [ ] Build succeeds (pnpm run build:all)
- [ ] Linting passes (pnpm run lint)
- [ ] Commits follow conventional format
- [ ] Changelog reviewed (auto-generated)
- [ ] Breaking changes documented
- [ ] Version bump appropriate for changes

---

## MonorepoArchitect

**Expertise:** pnpm workspaces, monorepo management, dependency management, workspace protocol

**Primary Focus:** Overall monorepo structure and cross-package coordination

### Responsibilities

- Manage workspace dependencies
- Configure pnpm workspace settings
- Handle inter-package dependencies
- Optimize workspace workflows
- Manage shared configurations
- Coordinate builds across packages

### Key Files

- `pnpm-workspace.yaml` - Workspace definition
- `package.json` (root) - Workspace scripts
- `.npmrc` - pnpm configuration
- `.editorconfig` - Shared editor settings
- `.lintstagedrc.yml` - Lint-staged configuration

### Workspace Structure

```yaml
packages:
  - "packages/**" # All packages
  - "!packages/**/dist/**" # Exclude dist directories
```

### Workspace Scripts

```bash
# From root directory
pnpm run serve:docs        # Start documentation server
pnpm run build:all         # Build all packages recursively
pnpm run test              # Run all tests (test:ci)
pnpm run test:e2e          # Run all e2e tests
pnpm run lint              # Lint all packages
pnpm run clean             # Remove all node_modules and locks
```

### Package Management

**Current Packages:**

1. **@gmap-vue/v3** (v2.1.5) - Main package
2. **@gmap-vue/v2** (v3.5.4) - Legacy package
3. **docs** (private) - Documentation site
4. **old-docs** (private) - Archived documentation

### Dependency Management

- **pnpm Version:** 9.13.2 (specified in packageManager field)
- **Node Version:** LTS (lts-latest via fnm)
- **Workspace Protocol:** Automatic for inter-package deps
- **Frozen Lockfile:** Used in CI (`--frozen-lockfile --ignore-scripts`)

### Important Notes

- **Shared Dev Dependencies:** At root level (@commitlint, husky, lint-staged)
- **Package-specific Dependencies:** In each package's package.json
- **HACK in CI:** Documentation workflow removes pnpm-workspace.yaml to isolate deps
- **Recursive Commands:** Use `pnpm run --recursive <script>` for all packages
- **Filtering:** Use `pnpm run --filter <package> <script>` for specific package

### Common Tasks

**Add dependency to specific package:**

```bash
pnpm add <package> --filter @gmap-vue/v3
pnpm add -D <package> --filter @gmap-vue/v2
```

**Update all dependencies:**

```bash
pnpm update --recursive
```

**Clean and reinstall:**

```bash
pnpm run clean          # Remove node_modules, locks
pnpm install           # Fresh install
```

### Workspace Best Practices

1. Keep shared configs at root level
2. Run validation from root when possible
3. Use workspace protocol for inter-package deps
4. Keep lockfile committed
5. Run `pnpm install` after pulling changes
6. Test packages independently before integration
7. Follow monorepo commit scope conventions

### Debugging Workspace Issues

1. Check pnpm version: `pnpm --version`
2. Verify workspace config: `pnpm-workspace.yaml`
3. Check package linking: `pnpm list --depth=0`
4. Clear cache: `pnpm store prune`
5. Reinstall: `pnpm run clean && pnpm install`

---

## General Guidelines for All Agents

### Pre-flight Checklist

1. Read `.github/copilot-instructions.md` for setup and build processes
2. Ensure Node LTS installed: `fnm install lts-latest && fnm use lts-latest`
3. Install dependencies: `pnpm install`
4. Verify build works: `pnpm run build:all`
5. Check tests pass: `pnpm run test`

### Before Making Changes

1. Identify which package(s) affected (v2, v3, docs, root)
2. Read relevant configuration files
3. Check for TODOs or HACKs in related code
4. Review existing tests for patterns

### After Making Changes

**CRITICAL: Always run these three commands from the repository root in this exact order and fix any errors before considering the task done:**

```bash
pnpm run lint      # Must exit 0 — fix all ESLint/Prettier errors before proceeding
pnpm run test      # Must exit 0 — fix all failing unit tests before proceeding
pnpm run test:e2e  # Must exit 0 — fix all failing e2e tests before proceeding
```

Do not skip any of these steps. Do not proceed to commit or hand back to the user if any of them fails.

1. Run package-specific build: `cd packages/<name> && pnpm run build`
2. Run linting from root: `pnpm run lint`
3. Run unit tests from root: `pnpm run test`
4. Run e2e tests from root: `pnpm run test:e2e`
5. Verify types (v3): `pnpm run type-check`
6. Write commit with proper conventional format
7. Ensure commit message follows rules (scope required!)

### Getting Help

- General setup and build: `.github/copilot-instructions.md`
- Contributing guidelines: Embedded in documentation
- Commit format: `commitlint.config.js`
- Workflow details: `.github/workflows/`

### Communication Style

- Be specific about which package you're working in
- Reference file paths from package root when possible
- Mention timing estimates for long-running commands
- Warn about expected errors or warnings
- Provide examples for commit messages

---

**Remember:** This is a monorepo with independent release cycles for v2 and v3. Always specify which package you're working with using the correct scope in commits: `(v2)`, `(v3)`, `(docs)`, `(root)`, or `(all)`.
