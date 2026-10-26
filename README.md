# Hackathon Deadline Board

A browser-only dashboard for students juggling multiple hackathons. Tracks live countdowns, shows a "Can I finish?" feasibility meter (Safe / Tight / Impossible), and surfaces a prioritized **What to do today** panel so you always know what to attack next.

Zero dependencies. Zero build step. Runs by double-clicking `index.html`.

---

## Features

- **Add hackathons** with name, deadline (local time), and link
- **Live countdown** (days, hours, minutes, seconds) updating every second
- **Feasibility meter** — each task has a fixed hour estimate:
  - Idea: 2h | Build: 8h | README: 1h | Demo: 3h | Submit: 1h (total 15h)
  - **Impossible** = hours needed > hours left
  - **Tight** = hours needed > 60% of hours left
  - **Safe** = otherwise
- **What to do today** panel — prioritized list of unfinished tasks, urgent hackathons first
- **Submit lock** — Submit stays disabled until Idea, Build, README, Demo are all ticked
- **Submitted celebration** — confetti animation + "Submitted" badge, card moves to Done section
- **Expired state** — past-deadline cards grey out, checklist locks, sink to bottom
- **Full persistence** — everything saved to `localStorage`, survives refresh
- **Load sample hackathons** — instantly try with 4 pre-made examples (always relative to today)
- **Edit / Delete** any hackathon
- **Dark GitHub-style theme** with Inter font, monospace timers, color-coded status borders

---

## Quick Start

```bash
# Option 1: Just open the file (recommended)
double-click index.html

# Option 2: Local static server
npx serve .

# Option 3: Python
python -m http.server 8000
# then open http://localhost:8000
```

> **Note:** This is a pure static app — no build, no server needed. Just open `index.html` directly in your browser.

---

## Project Structure

```
├── index.html      # Page structure, modal, confetti container
├── style.css       # Dark theme, status colors, progress bars, confetti animation
├── app.js          # State, localStorage, feasibility engine, rendering, timers
├── samples.js      # Runtime-generated sample data (relative to today)
└── devpost/        # Planning artifacts (scope, PRD, spec, checklist, app-map)
```

---

## How the Feasibility Meter Works

```js
const TASK_HOURS = { idea: 2, build: 8, readme: 1, demo: 3, submit: 1 };
const TOTAL_HOURS = 15;

// hoursNeeded = sum of unfinished tasks' hours
// hoursLeft   = (deadline - now) in hours

if (hoursNeeded > hoursLeft)        → "Impossible"
else if (hoursNeeded > hoursLeft*0.6) → "Tight"
else                                  → "Safe"
```

Progress % = `hoursCompleted / 15 * 100`

---

## Submission

Built for **Devpost Learn: Build With AI – Basics**.

- Demo video: https://youtu.be/5_GSEsx1O_Y
- Public repo: `https://github.com/Abhinay2244/hackathon-deadline-board`

---

## License

MIT — free to use, modify, and share.
