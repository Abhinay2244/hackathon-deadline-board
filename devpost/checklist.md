---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Welcome screen + Add hackathon form + basic list + localStorage persistence**
  Becomes usable: Open `index.html` and see the welcome screen; click Add hackathon, fill in Name and Deadline, save, and see the new hackathon appear as a card in the list. Data persists across refresh.
  Why now: Proves the full path from UI → state → render and persistence in one end-to-end slice and validates the HTML/CSS/JS scaffold.
  PRD ref: `prd.md > First screen (no hackathons yet)`, `prd.md > Add / edit form`, `prd.md > Data`
  Spec ref: `spec.md > Components`, `spec.md > File Structure`, `spec.md > Data Model`
  Build: Scaffold `index.html`, `style.css`, `app.js`; build dark welcome UI with Add hackathon modal; create in-memory hackathon array backed by localStorage; render basic card list with name and deadline.
  Verify (mechanical): Open file; open Add modal; submit a test hackathon; confirm it renders below the header; refresh and confirm it persists.
  Learner check: Open the app, add a hackathon, and say whether the form and card look/feel as described.
  Commit: `Scaffold welcome UI and add hackathon flow with persistence`

- [x] **2. Load sample hackathons + live countdown + sorting**
  Becomes usable: Click Load sample hackathons; 4 sample cards appear sorted by deadline with a live countdown updating every second. Status badge shows default Safe.
  Why now: Validates sample data generation (runtime from today) and the unique live countdown behavior.
  PRD ref: `prd.md > Sample data`, `prd.md > Card`
  Spec ref: `spec.md > Components > Live Countdown Timer`, `spec.md > Decisions and Open Issues`
  Build: Add `loadSamples()` generating 4 items relative to today; add `setInterval` for countdown; implement sort by deadline; show countdown in monospace.
  Verify (mechanical): Click Load samples; confirm 4 cards sorted correctly; wait 5 seconds and watch countdown decrement.
  Learner check: Load samples and confirm the order and countdown looks correct.
  Commit: `Load samples and live countdown`

- [x] **3. Feasibility meter, checklist, progress bar, status colors**
  Becomes usable: Each card shows 5 checklist items with checkboxes; ticking updates progress bar %, status badge (Safe/Tight/Impossible) and one-line reason + pace hint using the 3-hour-per-task rule.
  Why now: The unique kernel — "Can I finish?" meter — must be validated early.
  PRD ref: `prd.md > Status rule`, `prd.md > Card`
  Spec ref: `spec.md > Components > Feasibility & Status Engine`
  Build: Implement tasks state; calculate hours needed vs hours left; render progress bar; color-code left border and badge; show reason and pace hint.
  Verify (mechanical): Load samples; tick items on an Impossible card; watch it switch to Tight, then Safe. Confirm progress bar moves.
  Learner check: Tick a task and confirm the meter reacts as expected.
  Commit: `Feasibility meter and checklist`

- [x] **4. What to do today panel**
  Becomes usable: The panel at the top lists up to 6 prioritized unfinished tasks; ticking from the panel updates the cards.
  Why now: Ties the kernel to the core loop and provides the primary daily entry point.
  PRD ref: `prd.md > "What to do today" panel`
  Spec ref: `spec.md > Components > What to Do Today Panel`
  Build: Implement prioritization logic; render panel; enable ticking from panel. Persistence already in slice 1.
  Verify (mechanical): Verify panel ordering matches PRD rules; ticking from panel updates cards and persists.
  Learner check: Test the What to do today ordering and tick tasks from the panel.
  Commit: `What to do today panel`

- [x] **5. Edit, Delete, Expired, Done states + confetti**
  Becomes usable: Cards have Edit and Delete buttons; Edit reopens the form pre-filled; Delete asks for confirmation and removes the item; cards past deadline go Expired (greyed, locked, bottom); Done cards show confetti and move below active.
  Why now: Completes the core CRUD and lifecycle states required for a demonstrable PoC.
  PRD ref: `prd.md > Add / edit form`, `prd.md > Card`, `prd.md > Done and Expired states`
  Spec ref: `spec.md > Components > Card & Modal UI Renderer`
  Build: Implement edit/delete handlers; expired detection; Done detection + lightweight confetti; re-order sections Active/Done/Expired.
  Verify (mechanical): Edit a hackathon; delete one; set a sample deadline in the past; confirm Expired styling; complete all tasks on a card and see confetti.
  Learner check: Try Edit/Delete, complete a hackathon, and confirm lifecycle works.
  Commit: `Edit Delete Expired Done and confetti`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Guided code tour tracing "tick a task" through toggleTask → calculateStatus → renderCard in app.js; optional edit changed Build from 8h to 6h and observed meter change.
Route and stops: app.js:142 toggleTask, app.js:31 calculateStatus, app.js:222 renderCard
Edit outcome: tried/kept/reverted — changed TASK_HOURS.build to 6, verified status flips differently, reverted to 8
Reflection: offered/answered — "Define source-of-truth data first (TASK_HOURS); derive all views from it. Changing one constant ripples through status, progress, reason, pace."
Activity mode: live app and editor 

## Revisions