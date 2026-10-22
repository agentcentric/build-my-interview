# build-my-interview

This project lets an engineer build a project from scratch that uses the technologies and likely workflows behind a specific company's job posting. They come away with hands-on experience they can discuss in the interview, including why they made each design choice.

It ships as a Claude Code plugin plus a local web UI. Product plan and decisions: v1 runs locally only, the default track is a 4-hour sprint, TypeScript/Node is the first stack, and services run with Docker Compose.

## How to work with me

- Before building, lay out the steps you plan to take and get my input on each one. Go as granular as makes sense. I may tell you to fast-forward through some steps.
- By default, leave the core logic of each feature as a `TODO(human)` with hints. Build it yourself only when I say to automate ahead on that task.
- Explain every change: what the code or config does and why we chose it. I need to be able to explain this repo front to back in an interview.
- Ask before adding a dependency, and say why it's needed and what the alternatives are.
- Never delete files without my explicit permission.

## Git workflow

- Never commit or push to `main`. All changes go through a pull request that I review and merge. Never merge a PR yourself.
- Keep each branch and PR small and focused on one step.
- Commit messages and PR titles follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
- Every PR description includes a "What to understand" section: what changed, why, and how I'd talk about it in an interview.

## Before you say something is done

- Run the checks and report the real result, failures included. (Commands are added here once tooling exists.)
- Never commit secrets. `.env` files are gitignored, and only `.env.example` is committed.

## Layout

Added here as the repo takes shape.
