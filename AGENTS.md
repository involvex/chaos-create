# Agent Instructions for chaos-create

## Quick Commands

```bash
bun install              # Install dependencies (required)
bun run dev              # Run CLI in watch mode
bun test                 # Run tests (Bun native test runner)
bun run verify           # Lint + format check + typecheck
bun run build            # Build (runs verify + bundles to dist/)
```

## Critical Information

**Runtime**: Bun >= 1.0.0 required. Uses Bun's built-in test runner and `child_process.exec` for external CLIs.

**Entry points**:

- CLI: `src/index.ts` (commander, shebang `#!/usr/bin/env bun`)
- Framework registry: `src/framework-registry.ts` (single source of truth)
- Tests: `src/index.test.ts` (Bun.test)

**Workflow**: `lint → format:check → typecheck` via `bun run verify`. Build runs verify first.

## Non-Obvious Details

- **Module system**: ESM (`"type": "module"`), `moduleResolution: "bundler"`, `verbatimModuleSyntax: true`
- **Shebang**: Keep `#!/usr/bin/env bun` on line 1 of `src/index.ts`
- **Framework CLI args**: `{projectName}` placeholder in `framework-registry.ts`; `FrameworkGenerator.buildCommand()` replaces it
- **Mixed package managers**: Frameworks define their own `packageManager` (Angular uses `npm`, Flutter uses `flutter`, Deno frameworks use `deno`). Library injector dispatches accordingly.
- **Dev server commands**: Hardcoded map in `FrameworkGenerator.getDevCommand()`. New frameworks must add an entry.
- **Prettier**: LF endings, single quotes, 2-space indent, width 100, ES5 trailing commas
- **ESLint**: Flat config, `@typescript-eslint`, unused-vars error (args starting with `_` ignored), `no-explicit-any` off

## Known Issues

- `--template` flag implementation is incomplete (see `createFromTemplate()` in `src/index.ts`)
- Angular CLI (`ng`) must be installed globally for Angular scaffolding
- `bun build` bundles to `dist/` using `--target bun`

## File Ownership

- Add/edit frameworks → `src/framework-registry.ts`
- Add feature templates → `src/generators/feature-generator.ts` (`getFeatureCode()`)
- Change CLI options/flow → `src/index.ts`
- Change project generation/install/start logic → `src/generators/framework-generator.ts`
- Tests → `src/*.test.ts` (Bun.test, no Jest/Vitest)
