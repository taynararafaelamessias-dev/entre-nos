# Domain Docs

Before exploring this repo, read `CONTEXT.md` (or `CONTEXT-MAP.md` if this is a multi-context
repo, then each linked per-context `CONTEXT.md`) and any `docs/adr/` entries touching the area.
Missing files → proceed silently, don't propose creating them upfront; `domain-modeling`
creates them lazily when a term or decision actually resolves.

Layout: single-context (`CONTEXT.md` + `docs/adr/` at root) unless this repo shows real
monorepo signals (`pnpm-workspace.yaml`, a `workspaces` field, populated `packages/*/src`) —
then multi-context (root `CONTEXT-MAP.md` + per-package `CONTEXT.md`/`docs/adr/`).

**This repo: single-context, always.** The pnpm monorepo of ADR 0004 is one domain in a modular
monolith; its workspace files are not a multi-context signal. One root `CONTEXT.md`, one `docs/adr/`.

Use the glossary's terms exactly in output that names a domain concept — no drifting to a
synonym the glossary avoids. Output that contradicts a standing ADR must say so explicitly
("Contradicts ADR-000N — reopening because…"); a recorded tradeoff is by-design, not a finding.
