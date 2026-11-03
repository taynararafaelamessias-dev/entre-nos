# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Owner/repo: `taynararafaelamessias-dev/entre-nos`.

## Conventions
- Create: `gh issue create --title "..." --body "..."` (heredoc for multi-line bodies).
- Read: `gh issue view <n> --comments`.
- List: `gh issue list --state open --json number,title,body,labels,comments`.
- Comment / label / close: `gh issue comment`, `gh issue edit --add-label/--remove-label`, `gh issue close --comment "..." --reason <reason>`.

## When a skill says "publish to the tracker" / "fetch the ticket"
Create / `gh issue view <n> --comments`, respectively.
