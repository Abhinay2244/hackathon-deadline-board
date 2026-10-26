# PRD: Hackathon Deadline Board

A small no-login web app where students add hackathons with deadlines and see live countdowns, a "Can I finish?" status for each one, and a "What to do today" list.

## Who it's for
Students and builders who juggle several hackathons at once and lose track of deadlines.

## Core journey
1. Open the app and see the first screen.
2. Add hackathons (or load samples).
3. Tick checklist items as work gets done.
4. Watch each card's status and the "What to do today" list update.
5. Come back morning and night to see what to do next.

## First screen (no hackathons yet)
- Dark GitHub-style page with the title "Hackathon Deadline Board".
- Tagline: "Know what to work on today, and whether you can still finish."
- 3-line explanation: add hackathons with deadlines, tick off tasks, see if each is Safe, Tight or Impossible.
- Buttons: **Add hackathon** and **Load sample hackathons**.
- Empty "What to do today" panel: "Nothing to do yet. Add a hackathon or load samples to get started."
- Returning users skip this and see the panel on top and cards below, sorted by closest deadline.

## Add / edit form
- Fields: Name (required), Deadline date and time in the user's local time (required), Link (optional).
- Buttons: Save, Cancel.
- Empty name or deadline: form stays open, red message under the field, nothing saved.
- Past deadline: card is still added and shows as Expired, with the note "This deadline has passed."
- Link without http: `https://` is added automatically.
- On save: form closes, card appears in the correct sorted position with 5 unticked checklist items, saved to the browser immediately.
- Edit uses the same form, pre-filled. Cancel saves nothing.

## Card (top to bottom)
1. Header: name as a link (opens in a new tab), Edit and Delete buttons. Delete asks for confirmation.
2. Deadline text, like "Oct 30, 2026, 10:30 PM".
3. Live countdown in a monospace font, like "4d 3h 12m left".
4. Status badge (Safe, Tight, Impossible, Expired) with a one-line reason and a daily pace hint.
   - Reason example: "6 tasks left, about 18 hours of work, 2 days left".
   - Pace hint example: "Aim for about 3 tasks a day".
5. Progress bar with text, like "60% done", in the status color. Progress is based on hours completed out of 15 total hours.
6. Checklist: Idea, Build, README, Demo video, Submit. Ticking updates the progress bar and status instantly.

## Status rule (the "Can I finish?" meter)
- Each unfinished task has a fixed hour estimate: Idea 2h, Build 8h, README 1h, Demo video 3h, Submit 1h (total 15h).
- Hours needed = sum of unfinished tasks' hours. Hours left = time until the deadline.
- Impossible: hours needed is more than hours left.
- Tight: hours needed is more than about 60% of hours left.
- Safe: otherwise.
- Submitted: all 5 items ticked (takes priority over the other states).
- Expired: the deadline has passed and the hackathon is not Submitted.

## Task Dependencies
- Submit is locked until Idea, Build, README, and Demo video are all ticked.
- While locked, its checkbox is disabled and shows a "Finish the other tasks first" hint.
- If any of the first four tasks is unticked while Submit is ticked, Submit is also unticked automatically.

## Done and Expired states
- Submitted: card turns green, shows "Submitted" instead of the countdown, confetti plays once, card moves below the active ones.
- Expired: card is greyed out, checklist locked, sits at the bottom under a small "Expired" heading, Delete still works.

## Ordering
- Active cards are sorted by closest deadline.
- Order: active cards, then Done, then Expired.

## "What to do today" panel
- At the top of the page, above the cards, in a highlighted box.
- Shows up to 6 unfinished tasks, each with the hackathon name and its small countdown.
- Order: the closest-deadline hackathon comes first. If it is Tight, Impossible or due within 48 hours, show its next 3 tasks first. Then show the next 1 or 2 tasks from each other active hackathon, ordered by deadline.
- Within a hackathon, tasks follow checklist order.
- Each task has a colored dot matching its hackathon's status.
- Tasks can be ticked from the panel and work the same as on the card.
- If a hackathon is Impossible, a small line shows: "Consider dropping [name] to focus on the others."
- Updates instantly when a task is ticked, or a hackathon is added, edited or deleted, or a deadline passes.
- Empty states:
  - No hackathons: "Nothing to do yet. Add a hackathon or load samples to get started."
  - All tasks done: "You're all caught up. Nice work!"
  - Only expired: "No active hackathons. Add a new one to plan your next steps." with an **Add hackathon** button inside the panel.

## Sample data
- The **Load sample hackathons** button adds 4 sample cards with different deadlines so that one is Impossible, one is Tight and two are Safe.

## Look and feel
- Dark theme in the style of Linear, Notion and GitHub dark.
- Font: Inter with a system sans-serif fallback. Monospace for countdown numbers.
- Colors: red = Impossible, amber = Tight, green = Safe or Done, grey = Expired.
- Rounded cards with a thin colored left border matching the status.
- Works on a phone: cards in one column, buttons easy to tap.

## Data
- Everything is saved in the browser (localStorage) and survives a refresh.
- No login, no backend, no accounts.

## What "working" looks like
1. Open the app, click Load sample hackathons, and see 4 cards with live countdowns, colors and the What to do today list.
2. Tick a task on the Impossible card and watch it become Tight (hours-based: Build=8h, Demo=3h, etc.).
3. Add a new hackathon and see it appear in the right place.
4. Refresh and everything is still there.
5. Tick all 5 items on one hackathon and see confetti.

## Not in this version
Accounts and login, team sharing, notifications, automatic import from Devpost, any backend.

## Open questions
- Exact sample hackathon names and deadlines (will be set relative to today's date so the demo always works).