---
doc: scope
status: approved
---

# Hackathon Deadline Board

A small, no-login web app that shows hackathons as cards with live countdowns and a "Can I finish?" meter, so a student always knows what to work on today and whether they can still finish each one.

## The Unique Kernel

The "Can I finish?" feasibility meter: it compares how many checklist items are left against how much time remains, and labels each hackathon Safe, Tight, or Impossible. That's the whole point — most to-do apps list tasks but never tell you whether you'll make it. Ticking a task off moves the meter; that's the "oh, that's cool" beat.

## Who It's For

A 3rd year CSE-IoT student juggling several hackathons at once (Devpost, Hack2Skill, company ones), each with a different deadline. Today they track this in their head and lose track, panicking at the last minute or missing deadlines. They want one place that says what to do today and whether each hackathon is still finishable.

## The Core Loop

Open the board → see cards sorted by closest deadline, each with a live countdown, progress bar, and feasibility color → tick checklist items off as work happens → watch the meter react and the "What to do today" list reprioritize → close. They come back morning and night to see what changed and what to attack next.

## Inspiration & Identity

Clean dark dashboard like Linear and Notion, with GitHub-dark styling: simple cards, progress bars, and colors that show urgency (red = urgent/impossible, amber = tight, green = safe). Small celebration animation when a hackathon is fully done.

## Why This Matters to the Learner

They've already missed two hackathons for exactly this reason. This tool is for them and their CSE-IoT teammates, and anyone else who juggles hackathons — no login, data saved in each person's browser.

## What "Working" Looks Like

Open the app → click "Load sample hackathons" → four cards appear sorted by deadline with live countdowns, progress bars, and Safe/Tight/Impossible colors, and the "What to do today" list shows urgent tasks first → tick a task on the Impossible card and watch it become Tight (each unfinished task counts as ~3 hours, so the hours-needed vs. hours-left math flips) → add a new hackathon with name, deadline and link → refresh and everything survives → tick off every item on one hackathon and see a small celebration. Countdown is live, the meter reacts to ticks, the today-list reprioritizes, and data survives a refresh.

## The POC Boundary

- One self-contained web app, no backend, no login.
- Data saved in the browser (`localStorage`), survives refresh.
- Add a hackathon: name, deadline (date + time, entered in the user's local time), link.
- Each card: name, link, live countdown (days/hours), progress bar, checklist (idea, build, README, demo video, submit), tickable items, a delete button, and an edit option.
- Feasibility meter: each unfinished task counts as about 3 hours of work. Impossible = hours needed is more than hours left; Tight = hours needed is more than about 60% of hours left; Safe otherwise.
- Expired state: a hackathon past its deadline is greyed out and moved to the bottom of the board.
- Each card shows a one-line reason for its status and a daily pace hint (how many tasks to finish per day to stay on track).
- Cards sorted by closest deadline; color-coded by urgency.
- "What to do today" at top: unfinished tasks, priority-ordered mix — most urgent hackathon's tasks first, then a few from others.
- "Load sample hackathons" button for instant tryout.
- Small celebration when a hackathon is fully complete.
- Clean dark theme (Linear/Notion/GitHub-dark style).

## Later

Accounts, team sharing, notifications, automatic import from Devpost, recurring hackathons, edit/delete hackathons, export data, dark/light toggle, custom checklist templates, time zone handling.

## Explicitly Cut

- Accounts and login.
- Team sharing / multi-user sync.
- Notifications.
- Automatic importing from Devpost or other sources.
- Any backend or server.