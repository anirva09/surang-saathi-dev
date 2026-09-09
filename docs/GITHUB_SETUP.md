# GitHub Setup — Private Rebuild

This repository is intended to be the private GitHub repository:

```text
anirva09/surang-saathi-dev
```

Do not use the public `surang-saathi` repository for active rebuild work.

## If the private GitHub repository already exists

From this local repository:

```bash
git remote add origin https://github.com/anirva09/surang-saathi-dev.git
git push -u origin main
git push -u origin rebuild/v1
```

If `origin` already exists, inspect it before changing anything:

```bash
git remote -v
```

Never replace a remote blindly.

## If the private repository does not exist

Create `surang-saathi-dev` as **Private** under the `anirva09` GitHub account, then add it as `origin` and push both `main` and `rebuild/v1`.

If GitHub CLI is installed and authenticated, the equivalent creation flow is:

```bash
gh repo create anirva09/surang-saathi-dev --private --source=. --remote=origin
git push -u origin main
git push -u origin rebuild/v1
```

## Recommended rulesets

For `main` and `rebuild/v1` where account settings permit:

- require pull requests for feature integration
- require the `Governance checks` workflow
- block force pushes
- block branch deletion

For a solo repository, self-review may be the only available approval, but the feature-branch and verification discipline still applies.

## Google AI Studio

Connect/import the **private** `surang-saathi-dev` repository into Google AI Studio. Treat GitHub as canonical.

For every task:

1. update/fetch `rebuild/v1`
2. create the packet's feature branch
3. implement only that packet
4. run verification
5. push the feature branch
6. review the GitHub diff before integration

If workspace sync behaves unexpectedly, stop and reconcile against Git rather than treating AI Studio workspace state as authoritative.
