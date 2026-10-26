---
doc: spec
status: approved
---

# Hackathon Deadline Board — Technical Spec

## How This Works, In Plain Language
The Hackathon Deadline Board is a static web app built with vanilla HTML, CSS, and JavaScript. All data lives in the browser's `localStorage`, so everything survives a page refresh with zero backend or database required. 

- `index.html` holds the page structure: the header, the "What to do today" panel, the **Add hackathon** and **Load sample hackathons** buttons, the active cards grid, and the expired section.
- `style.css` handles the GitHub-dark styling, Inter font, monospace countdown numbers, status badge colors (red, amber, green, grey), progress bars, and animations (including a lightweight CSS/JS confetti effect).
- `app.js` handles all state management, `localStorage` loading/saving, live countdown timers (updating every second), task ticking, feasibility calculation (~3 hours per unfinished task), status badge evaluation (Safe, Tight, Impossible, Expired, Done), sorting, filtering, and rendering.

Why this shape? Three files, zero build tools, and no external npm packages mean it is instantly inspectable, incredibly fast, and deployable for free to GitHub Pages with a single click.

## The Core Journey Through the System
PRD ref: `prd.md > Core journey`.

1. **Arrival:** User opens `index.html` in a browser. `app.js` checks `localStorage`. If empty, it renders the welcome state with the description and buttons. If hackathons exist, it renders the "What to do today" panel and sorted cards.
2. **Adding/Loading:** Clicking **Load sample hackathons** generates 4 samples with deadlines computed relative to today (Impossible, Tight, Safe, Safe) and saves them to `localStorage`. Clicking **Add hackathon** opens a modal form; filling in Name, Deadline (local time), and Link and hitting Save validates the input, creates the card object, and saves it.
3. **Working & Ticking:** User ticks a task in the "What to do today" panel or directly on a card. `app.js` updates that task state, recalculates the progress percentage, computes remaining hours vs. remaining time, updates the status badge (Safe/Tight/Impossible/Done), re-sorts the board, and updates `localStorage`.
4. **Completion:** When all 5 tasks are ticked, the card turns green, triggers the lightweight confetti animation once, and moves below active cards.
5. **Persistence:** Refreshing the page re-reads `localStorage`, restoring exact state and live countdowns.

## Stack
- **Languages:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Styling / Typography:** Inter font (via Google Fonts), system-ui fallback, monospace for countdowns. No heavy CSS frameworks.
- **Persistence:** Browser `localStorage` API.
- **Dependencies:** None (zero external npm packages, zero build step).

## Where It Runs and How Someone Tries It
- **Runtime:** Any modern web browser (Chrome, Firefox, Safari, Edge).
- **Environment:** No server or installation needed.
- **Start / Test:** Double-click `index.html` or open it in a browser. For local development, running a simple static server (`npx serve .` or Python's `http.server`) works smoothly.
- **Demo / Submission:** Fully ready for local recording (for the demo video) and GitHub Pages deployment (for the public repo).

## Look and Feel
- **Palette:** GitHub dark theme (`#0d1117` background, `#161b22` card surface, `#30363d` borders, `#8b949e` muted text).
- **Status Colors:** Red (`#f85149` - Impossible/Urgent), Amber (`#d29922` - Tight), Green (`#238636` - Safe/Done), Grey (`#484f58` - Expired).
- **Typography:** Inter sans-serif for UI, `ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace` for countdown timers and time remaining.
- **Density:** Clean, modern dashboard layout with rounded cards, left-side status border accent, and subtle hover states.

## Components

### App State & Storage (`app.js`)
- Manages the array of hackathon objects in memory and syncs with `localStorage`.
- PRD ref: `prd.md > Data`.

### Live Countdown Timer (`app.js`)
- Runs a `setInterval` every second to update all active countdown displays and check if any deadlines have passed (triggering expired/status recalculations).
- PRD ref: `prd.md > Card`.

### Feasibility & Status Engine (`app.js`)
- Computes hours needed (sum of unfinished tasks' hours: Idea 2h, Build 8h, README 1h, Demo 3h, Submit 1h = 15h total).
- Compares with hours left until deadline.
- Evaluates states: Submitted (all ticked), Expired (past deadline), Impossible (hours needed > hours left), Tight (hours needed > 60% of hours left), Safe (otherwise).
- Generates the one-line reason (e.g., "Build, README left, about 9 hours needed, 4.5h left") and daily pace hint.
- Progress % = hours completed / 15h.
- PRD ref: `prd.md > Status rule`.

### Task Dependencies (`app.js`)
- Submit task locked until Idea, Build, README, Demo are all ticked.
- If a prerequisite is unticked while Submit is ticked, Submit is unticked automatically.
- PRD ref: `prd.md > Task Dependencies`.

### What to Do Today Panel (`index.html` + `app.js`)
- Renders the prioritized top task list according to the urgency rules.
- PRD ref: `prd.md > "What to do today" panel`.

### Card & Modal UI Renderer (`index.html` + `style.css` + `app.js`)
- Renders active cards, submitted cards, and expired cards under their respective headings.
- Handles the Add/Edit modal form and validation.
- Handles lightweight confetti effect on submission.
- PRD ref: `prd.md > Card`, `Add / edit form`, `Done and Expired states`.

## Data Model
Each hackathon is stored as an object in an array in `localStorage` under the key `hackathon_board_items`:

```json
{
  "id": "uuid-or-timestamp",
  "name": "Nebius x NVIDIA Global AI Hackathon",
  "deadline": "2026-10-30T22:30",
  "link": "https://example.com",
  "tasks": {
    "idea": true,
    "build": false,
    "readme": false,
    "demo": false,
    "submit": false
  },
  "createdAt": "2026-10-26T12:00:00.000Z"
}
```

Task hour estimates (used by feasibility engine): Idea 2h, Build 8h, README 1h, Demo 3h, Submit 1h = 15h total.

## File Structure
```
c:\Users\abhin\build_with_ai\
├── index.html
├── style.css
├── app.js
├── .gitignore
└── devpost/
    ├── learner-profile.md
    ├── scope.md
    ├── prd.md
    └── spec.md
```

## External Services and Dependencies
- **Google Fonts (Inter):** Loaded via CDN (`<link>` tag in `index.html`) for typography. Fallback to system sans-serif if offline.

## Important Failure Modes
- **Invalid date/time input:** Form validation prevents saving if deadline is empty or invalid.
- **Corrupted localStorage:** Fallback in `app.js` to an empty array `[]` if JSON parsing fails.
- **Passed deadlines during active session:** Live timer updates status immediately without needing a manual refresh.

## What Was Simplified and Why
- **No external confetti library:** Built a simple, lightweight 30-line CSS/JS particle animation instead of pulling in `canvas-confetti`, keeping dependencies at zero.
- **Fixed per-task hour estimates:** Used fixed hour estimates per task (Idea 2h, Build 8h, README 1h, Demo 3h, Submit 1h) rather than complex historical tracking, keeping the feasibility math transparent and predictable.

## Decisions and Open Issues
- **Stack Choice:** Vanilla HTML/CSS/JS with zero build step chosen for maximum simplicity, ease of local execution, and free GitHub Pages hosting compatibility.
- **File Layout:** 3 plain files (`index.html`, `style.css`, `app.js`) for utmost clarity and readability during AI-assisted coding.
- **Sample Data:** Computed dynamically relative to today's date so demo samples always fall correctly into Impossible, Tight, and Safe buckets.
- **Learner Uncertainty Clarified:** How vanilla JS handles reactive rendering and localStorage state synchronization was discussed; agreed to keep a single central `render()` function called after any state mutation.
