## Agent skills

### Issue tracker
GitHub issues, PRs-as-request-surface off. See `docs/agents/issue-tracker.md`.

### Triage labels
Canonical three-role vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs
single-context. See `docs/agents/domain.md`.

### Lessons
Learned rules, read by `/rumo build`'s planner and reviewer. See `docs/agents/lessons.md`.

### Design (Doop)
Doop is the visual map of the product: every screen, flow and piece of visual structure is prototyped on the Doop canvas first, and the native apps (Swift/Kotlin) are built from those frames — layout, hierarchy, navigation and tokens. A new screen or a visual change starts on Doop; when code and canvas diverge, update the canvas, then the code. Tools: `mcp__doop__*`, starting with `get_guide({ topic: "doop-instructions" })`.
