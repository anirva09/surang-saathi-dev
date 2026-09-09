# Google AI Studio Workflow

Use AI Studio for one bounded implementation packet at a time.

## Start a task

1. Ensure GitHub `surang-saathi-dev` is current.
2. Start from `rebuild/v1`.
3. Create the branch named in the packet.
4. Import/open the repository in Google AI Studio.
5. Provide `docs/ai-studio/MASTER_PROMPT.md` as the standing implementation contract.
6. Provide exactly one packet from `docs/ai-studio/packets/`.
7. Let AI Studio inspect relevant existing files before editing.
8. Run the packet verification commands.
9. Push the feature branch only.
10. Bring the diff/report/screenshots to ChatGPT for review.

## Rules

- Do not chain multiple packets in one AI Studio session without review.
- Do not accept a workspace “success” message as verification; use Git/test/build output.
- GitHub is canonical when workspace and repository state disagree.
- Never work against the public repository during active development.
