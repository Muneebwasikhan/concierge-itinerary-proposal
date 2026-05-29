# Human Interaction Tasks

## HUMAN-001 - Choose local repo location and project name

- Owner: Human
- Type: Human setup
- Priority: P0
- Depends on: None

### Goal

Decide where the app repo will live and what it will be called.

### Prompt to Give Codex

```text
No Codex prompt needed. Decide the project folder and name before running scaffold tasks.
```

### Acceptance Criteria

- Project folder location is known.
- Project name is selected.

## HUMAN-002 - Create or connect GitHub repository before implementation

- Owner: Human
- Type: Human interaction
- Priority: P0
- Depends on: HUMAN-001

### Goal

Prepare the submission repository before app code starts so every implementation task can be committed and pushed cleanly.

### Prompt to Give Codex

```text
No Codex prompt needed. Create the GitHub repo first, choose public/private according to the submission instructions, and keep the remote URL ready.
```

### Acceptance Criteria

- GitHub repo exists.
- Local repo can push to GitHub.
- Repo visibility matches submission requirements.

## HUMAN-003 - Initialize git, connect remote, and make baseline commit

- Owner: Human
- Type: Human setup
- Priority: P0
- Depends on: HUMAN-002

### Goal

Start the repository history before Codex begins implementation tasks.

### Prompt to Give Codex

```text
No Codex prompt needed unless you want Codex to run the git commands after the GitHub repo exists. Initialize git locally, add the GitHub remote, copy the task-pack specs into the repo if desired, and make an initial baseline commit.
```

### Acceptance Criteria

- Local git repo is initialized.
- GitHub remote is connected.
- Initial baseline commit exists before ER-001 implementation starts.
- Working tree is clean before starting ER-001.

## HUMAN-004 - Commit after every completed Codex task

- Owner: Human
- Type: Human checkpoint
- Priority: P0
- Depends on: HUMAN-003; repeat after each ER task

### Goal

Keep a readable implementation history with one focused checkpoint per task.

### Prompt to Give Codex

```text
After each ER task is completed and verified, review the diff, commit it with the task ID in the message, and push if you want remote backup after every step.
```

### Acceptance Criteria

- Each completed ER task has a focused commit.
- Commit messages include the task ID, for example `ER-004: add sqlite schema`.
- The working tree is clean before starting the next task.

## HUMAN-005 - Review final app locally

- Owner: Human
- Type: Human review
- Priority: P0
- Depends on: ER-026

### Goal

Catch any obvious product or presentation issue before recording.

### Prompt to Give Codex

```text
No Codex prompt needed. Run the app and click through the full flow as a reviewer would.
```

### Acceptance Criteria

- Human has completed one full dashboard-to-member flow.
- Any final issues are noted for Codex.

## HUMAN-006 - Record Loom or walkthrough video

- Owner: Human
- Type: Human deliverable
- Priority: P0
- Depends on: ER-027 and HUMAN-005

### Goal

Create the required 5-10 minute recorded walkthrough.

### Prompt to Give Codex

```text
Use `docs/LOOM_WALKTHROUGH.md` as the talking outline.
```

### Acceptance Criteria

- Recording shows full create -> send -> approve -> pay flow.
- Recording explains key technical decisions.
- Recording is 5-10 minutes.

## HUMAN-007 - Submit GitHub link and Loom link

- Owner: Human
- Type: Human submission
- Priority: P0
- Depends on: HUMAN-002, HUMAN-006

### Goal

Submit the completed assessment deliverables.

### Prompt to Give Codex

```text
No Codex prompt needed.
```

### Acceptance Criteria

- GitHub link is submitted.
- Loom/walkthrough link is submitted.
- Submission recipient/deadline from assessment are followed if provided.
