# Contributing

This repository follows Conventional Commits, named branches, and pull-request reviews.

## Branch naming

Pattern: `<type>/<description>`

Allowed types: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `chore`

Examples:

```
feature/bloom-level-7
bugfix/hud-hidden-attribute
docs/readme-preview-url
```

## Commits

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

Rules:

- Subject in lowercase, no trailing period
- Header max 100 characters
- One logical change per commit
- Explain why, not only what

Examples:

```
feat(shop): add mosaicista title
fix(hud): honor hidden attribute on welcome
test(flows): cover open-answer keyword miss
docs(readme): document local preview
```

Husky runs commitlint on `commit-msg`. A commit that does not match the format is rejected.

## Pull request process

1. Create a branch from `develop` following the naming convention
2. Make commits using Conventional Commits
3. Add or update Playwright tests for behavior changes
4. Update documentation when the player-facing flow changes
5. Ensure `npm test` passes
6. Open a pull request with the template in `.github/pull_request_template.md`
7. Request review from 1-2 people
8. Squash and merge when approved
9. Delete the branch after merge

Keep history linear. Rebase onto `develop` before merge. Do not push merge commits.

## Deploy

The site is static and published via GitHub Pages from the `develop` branch, root path: https://hoheckell.github.io/bloomquizart/. Every push to `develop` redeploys automatically.

## Code review checklist

Reviewers should verify:

- [ ] Code is clear and understandable
- [ ] Tests cover new or changed behavior
- [ ] No obvious bugs or security issues
- [ ] Follows project conventions
- [ ] Documentation is updated
- [ ] No unrelated changes included

Give specific, actionable feedback. Assume good intent.

## Tests

```
npm test
```

Playwright starts a local static server on port 4173. Chromium is required.

## Emergency procedures

Bypass git hooks only for production hotfixes or reverts:

```
git commit --no-verify -m "hotfix: critical production fix"
```

Force-push only after an approved history rewrite, and only with lease:

```
git push --force-with-lease
```

Create a follow-up pull request to restore any bypassed checks.
