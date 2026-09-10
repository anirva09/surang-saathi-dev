# Frontend Teammate — Windows CMD Setup

## 1. Authenticate to GitHub if needed

```cmd
gh auth login
```

## 2. Clone

```cmd
cd /d "%USERPROFILE%\Downloads"
```

```cmd
git clone https://github.com/anirva09/surang-saathi-dev.git
```

```cmd
cd /d "%USERPROFILE%\Downloads\surang-saathi-dev"
```

## 3. Switch to the branch already created by the owner

```cmd
git fetch origin
```

```cmd
git switch feat/golden-master-enhanced-ui
```

```cmd
git pull --ff-only origin feat/golden-master-enhanced-ui
```

```cmd
git branch --show-current
```

Expected branch name:

`feat/golden-master-enhanced-ui`

## 4. Check working tree

```cmd
git status --short
```

It should be clean immediately after clone/switch.

## 5. Install project dependencies

From repo root:

```cmd
npm ci
```

## 6. Prepare frontend local env

If `apps\web\.env.local` does not exist:

```cmd
copy apps\web\.env.example apps\web\.env.local
```

Do not commit `.env.local`.

## 7. Run baseline validation before AI edits

Use the exact scripts in root/package files.

Typical commands:

```cmd
npm run test
```

```cmd
npm run typecheck
```

```cmd
npm run lint
```

```cmd
npm run build
```

If a script does not exist, inspect `package.json` rather than inventing one.

## 8. Start app

```cmd
npm run dev
```

Open:

`http://localhost:3000`

Inspect the current homepage and portal before changing code.

## 9. NOW give the coding agent the master prompt

Only after baseline inspection/tests, paste:

`docs/team/UI_MASTER_PROMPT.md`

The agent must have the repository root as its workspace.

## 10. Push only your branch

```cmd
git push origin feat/golden-master-enhanced-ui
```

Never push directly to `main`.
