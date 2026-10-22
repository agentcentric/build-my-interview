# build-my-interview

This project lets an engineer build a project from scratch that uses the technologies and likely workflows behind a specific company's job posting. They come away with hands-on experience they can discuss in the interview, including why they made each design choice.

It ships as a Claude Code plugin plus a local web UI. Product plan and decisions: v1 runs locally only, the default track is a 4-hour sprint, TypeScript/Node is the first stack, and services run with Docker Compose.

## How to work with me

- Before building, ask me what I would do next, so I have to think through the logical steps of development myself. Then give me feedback: errors in my thinking, reasonable alternatives, what best practice says, and what you'd suggest.
- Get my input on each step. Go as granular as makes sense. I may tell you to fast-forward through some steps.
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

- Run the checks and report the real result, failures included. CI runs the same commands on every PR.
- Use Node 24 (see `.nvmrc`) and pnpm. Run commands from the repo root:
  - `pnpm install` installs all workspace packages.
  - `pnpm check` runs Biome (lint and format check). `pnpm fix` applies safe fixes and formatting.
  - `pnpm typecheck` runs `tsc` in every package.
  - `pnpm test` runs Vitest in every package.
- Never commit secrets. `.env` files are gitignored, and only `.env.example` is committed.

## Layout

- `packages/server/`: the local Node program. It speaks MCP (JSON-RPC over stdio, written by hand) to Claude Code, and will serve HTTP to the browser UI. Never write to stdout except MCP messages; log to stderr.
- `tsconfig.base.json`, `biome.json`: shared TypeScript and Biome settings.
- `.github/workflows/ci.yml`: CI for every PR.
