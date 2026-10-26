document.addEventListener('DOMContentLoaded', () => {
    // State
    let hackathons = JSON.parse(localStorage.getItem('hackathon_board_items')) || [];

    // DOM Elements
    const addBtn = document.getElementById('addHackathonBtn');
    const loadSamplesBtn = document.getElementById('loadSamplesBtn');
    const modal = document.getElementById('hackathonModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('hackathonForm');
    const board = document.getElementById('cardsBoard');
    const todoPanel = document.getElementById('todoPanel');

    // Constants
    const TASK_KEYS = ['idea', 'build', 'readme', 'demo', 'submit'];
    const TASK_LABELS = {
        idea: 'Idea',
        build: 'Build',
        readme: 'README',
        demo: 'Demo video',
        submit: 'Submit'
    };
    const TASK_HOURS = {
        idea: 2,
        build: 8,
        readme: 1,
        demo: 3,
        submit: 1
    };
    const TOTAL_HOURS = 15;
    const PREREQ_TASKS = ['idea', 'build', 'readme', 'demo'];

    // --- Core Functions ---

    function save() {
        localStorage.setItem('hackathon_board_items', JSON.stringify(hackathons));
    }

    function calculateStatus(h) {
        const unfinishedKeys = TASK_KEYS.filter(k => !h.tasks[k]);
        const unfinishedCount = unfinishedKeys.length;
        const hoursCompleted = TASK_KEYS.filter(k => h.tasks[k]).reduce((sum, k) => sum + TASK_HOURS[k], 0);
        const hoursNeeded = unfinishedKeys.reduce((sum, k) => sum + TASK_HOURS[k], 0);

        if (unfinishedCount === 0) {
            return { type: 'submitted', label: 'Submitted', reason: 'All items completed!' };
        }

        const deadline = new Date(h.deadline);
        const now = new Date();
        const hoursLeft = (deadline - now) / (1000 * 3600);

        if (hoursLeft <= 0) return { type: 'expired', label: 'Expired', reason: 'Deadline has passed' };

        // Build reason: list unfinished tasks by label, sum hours
        const unfinishedLabels = unfinishedKeys.map(k => TASK_LABELS[k]);
        const reason = `${unfinishedLabels.join(', ')} left, about ${hoursNeeded} hours needed, ${hoursLeft.toFixed(1)}h left`;

        const daysLeft = Math.max(1, Math.ceil(hoursLeft / 24));
        const pace = (unfinishedCount / daysLeft).toFixed(1);
        const hint = `Aim for about ${pace} tasks a day`;

        let type = 'safe';
        if (hoursNeeded > hoursLeft) {
            type = 'impossible';
        } else if (hoursNeeded > hoursLeft * 0.6) {
            type = 'tight';
        }

        const label = type.charAt(0).toUpperCase() + type.slice(1);

        return { type, label, reason, hint, hoursCompleted, hoursNeeded };
    }

    // --- UI Actions ---

    addBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Add Hackathon';
        document.getElementById('editId').value = '';
        form.reset();
        modal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const name = document.getElementById('name').value.trim();
        const deadline = document.getElementById('deadline').value;
        let link = document.getElementById('link').value.trim();

        if (!name || name.replace(/\s/g, '').length === 0) {
            showFormError('Name must not be empty or just spaces');
            return;
        }
        removeFormError();

        if (link && !link.startsWith('http')) link = 'https://' + link;

        if (id) {
            const h = hackathons.find(x => x.id === id);
            if (h) {
                h.name = name;
                h.deadline = deadline;
                h.link = link;
            }
        } else {
            hackathons.push({
                id: Date.now().toString(),
                name,
                deadline,
                link,
                tasks: { idea: false, build: false, readme: false, demo: false, submit: false },
                createdAt: new Date().toISOString()
            });
        }

        modal.classList.add('hidden');
        save();
        render();
    });

    function showFormError(msg) {
        const container = document.querySelector('.modal-content');
        let errEl = document.getElementById('formError');
        if (!errEl) {
            errEl = document.createElement('div');
            errEl.id = 'formError';
            errEl.style.color = '#f85149';
            errEl.style.fontSize = '12px';
            errEl.style.marginTop = '4px';
            const nameInput = document.getElementById('name');
            container.insertBefore(errEl, nameInput.nextSibling);
        }
        errEl.textContent = msg;
    }

    function removeFormError() {
        const errEl = document.getElementById('formError');
        if (errEl) errEl.remove();
    }

    loadSamplesBtn.addEventListener('click', () => {
        if (typeof sampleItems !== 'undefined') {
            hackathons = hackathons.filter(h => !h.id.startsWith('sample-'));
            hackathons.push(...JSON.parse(JSON.stringify(sampleItems)));
            save();
            render();
        }
    });

    window.toggleTask = (hackathonId, taskKey) => {
        const h = hackathons.find(x => x.id === hackathonId);
        if (!h) return;

        const wasDone = TASK_KEYS.every(k => h.tasks[k]);

        // If submitting, check prerequisites
        if (taskKey === 'submit' && !PREREQ_TASKS.every(k => h.tasks[k])) {
            return; // silently ignore - UI prevents this anyway
        }

        // If unticking a prereq and submit is ticked, also untick submit
        if (!h.tasks[taskKey] || taskKey === 'submit') {
            // Task is being checked (going from false to true) or it's submit
        } else {
            // Task is being unchecked
            if (h.tasks.submit && PREREQ_TASKS.includes(taskKey)) {
                h.tasks.submit = false;
            }
        }

        h.tasks[taskKey] = !h.tasks[taskKey];

        const isDone = TASK_KEYS.every(k => h.tasks[k]);

        if (isDone && !wasDone) triggerConfetti();
        save();
        render();
    };

    window.editHackathon = (id) => {
        const h = hackathons.find(x => x.id === id);
        if (!h) return;
        document.getElementById('modalTitle').textContent = 'Edit Hackathon';
        document.getElementById('editId').value = h.id;
        document.getElementById('name').value = h.name;
        document.getElementById('deadline').value = h.deadline;
        document.getElementById('link').value = h.link || '';
        modal.classList.remove('hidden');
    };

    window.deleteHackathon = (id) => {
        if (confirm('Delete this hackathon?')) {
            hackathons = hackathons.filter(x => x.id !== id);
            save();
            render();
        }
    };

    // --- Rendering ---

    function getCountdownText(deadlineStr) {
        const diff = new Date(deadlineStr) - new Date();
        if (diff <= 0) return 'Expired';
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return `${d}d ${h}h ${m}m ${s}s left`;
    }

    function render() {
        const sorted = [...hackathons].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        // Split groups
        const active = [];
        const done = [];
        const expired = [];

        sorted.forEach(h => {
            const status = calculateStatus(h);
            if (status.type === 'submitted') done.push({h, status});
            else if (status.type === 'expired') expired.push({h, status});
            else active.push({h, status});
        });

        // Render Panel
        renderTodoPanel(active);

        // Render Main Board
        if (hackathons.length === 0) {
            board.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b949e;">No hackathons yet. Add your first one or load samples to get started.</div>';
            return;
        }

        let html = active.map(({h, status}) => renderCard(h, status)).join('');
        if (done.length > 0) {
            html += `<div class="expired-section"><h3>Done</h3></div>`;
            html += done.map(({h, status}) => renderCard(h, status)).join('');
        }
        if (expired.length > 0) {
            html += `<div class="expired-section"><h3>Expired</h3></div>`;
            html += expired.map(({h, status}) => renderCard(h, status)).join('');
        }
        board.innerHTML = html;
    }

    function renderCard(h, status) {
        const hoursCompleted = status.hoursCompleted || TASK_KEYS.filter(k => h.tasks[k]).reduce((sum, k) => sum + TASK_HOURS[k], 0);
        const pct = Math.round((hoursCompleted / TOTAL_HOURS) * 100);

        // Checklist disabled for expired
        const disabledAttr = status.type === 'expired' ? 'disabled' : '';

        // Submit is locked if prerequisites not met
        const prereqsMet = PREREQ_TASKS.every(k => h.tasks[k]);
        const submitLocked = !prereqsMet && !h.tasks.submit;

        return `
            <div class="card status-${status.type}">
                <div class="card-header">
                    <a href="${h.link || '#'}" target="_blank">${escapeHtml(h.name)}</a>
                    <div class="card-actions">
                        <button class="btn-icon" onclick="editHackathon('${h.id}')">Edit</button>
                        <button class="btn-icon" onclick="deleteHackathon('${h.id}')">Delete</button>
                    </div>
                </div>
                <div class="deadline-text">${new Date(h.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                ${status.type === 'submitted' ? '<div class="countdown">Submitted</div>' : `<div class="countdown" data-deadline="${h.deadline}">${getCountdownText(h.deadline)}</div>`}

                <div class="status-row">
                    <span class="badge badge-${status.type}">${status.label}</span>
                    <span class="reason-line">${status.reason}</span>
                </div>
                ${status.hint ? `<div class="pace-hint">${status.hint}</div>` : ''}

                <div class="progress-container">
                    <div class="progress-text">
                        <span>Progress</span>
                        <span>${pct}% done</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill fill-${status.type}" style="width: ${pct}%"></div>
                    </div>
                </div>

                <div class="checklist">
                    ${TASK_KEYS.map(k => {
                        const isSubmit = k === 'submit';
                        const locked = isSubmit && submitLocked;
                        return `
                            <label class="task-item ${h.tasks[k] ? 'completed' : ''} ${locked ? 'locked' : ''}">
                                <input type="checkbox" ${h.tasks[k] ? 'checked' : ''} ${disabledAttr} ${locked ? 'disabled' : ''} onchange="toggleTask('${h.id}', '${k}')">
                                ${TASK_LABELS[k]}
                                ${locked ? '<span class="lock-hint">Finish the other tasks first</span>' : ''}
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderTodoPanel(activeGroups) {
        if (hackathons.length === 0) {
            todoPanel.innerHTML = '<p>Nothing to do yet. Add a hackathon or load samples to get started.</p>';
            todoPanel.classList.remove('hidden');
            return;
        }

        const totalActiveTasks = activeGroups.reduce((acc, g) => acc + TASK_KEYS.filter(k => !g.h.tasks[k]).length, 0);
        if (totalActiveTasks === 0) {
            const hasAnyDone = hackathons.some(h => TASK_KEYS.every(k => h.tasks[k]));
            if (hasAnyDone && activeGroups.length === 0) {
                todoPanel.innerHTML = '<p>You’re all caught up. Nice work!</p>';
            } else {
                const hasActive = activeGroups.length > 0;
                todoPanel.innerHTML = hasActive ? '<p>You’re all caught up. Nice work!</p>' : '<p>No active hackathons. <button onclick="document.getElementById(\'addHackathonBtn\').click()">Add a new one</button> to plan your next steps.</p>';
            }
            todoPanel.classList.remove('hidden');
            return;
        }

        todoPanel.classList.remove('hidden');
        let tasks = [];

        activeGroups.forEach((g, idx) => {
            // Filter out submit if locked
            const hTasks = TASK_KEYS.filter(k => !g.h.tasks[k]);
            const availableTasks = hTasks.filter(k => {
                if (k === 'submit') {
                    return PREREQ_TASKS.every(pk => g.h.tasks[pk]);
                }
                return true;
            });

            const isUrgent = g.status.type === 'tight' || g.status.type === 'impossible' || (new Date(g.h.deadline) - new Date() < 48 * 3600 * 1000);

            const countToTake = (idx === 0 && isUrgent) ? 3 : (idx === 0 ? 2 : 1);
            const slice = availableTasks.slice(0, countToTake).map(k => ({
                key: k,
                h: g.h,
                statusType: g.status.type
            }));
            tasks = tasks.concat(slice);
        });

        const limitedTasks = tasks.slice(0, 6);

        let html = '<h3 style="font-size: 14px; margin-bottom: 12px; color: #f0f6fc;">What to do today</h3>';
        html += '<ul class="todo-list">';
        html += limitedTasks.map(t => `
            <li class="todo-task">
                <span class="status-dot dot-${t.statusType}"></span>
                <input type="checkbox" onchange="toggleTask('${t.h.id}', '${t.key}')" style="margin-right: 8px;">
                <span>${TASK_LABELS[t.key]}</span>
                <span class="todo-hackathon-name">${escapeHtml(t.h.name)} • <span data-deadline="${t.h.deadline}">${getCountdownText(t.h.deadline)}</span></span>
            </li>
        `).join('');
        html += '</ul>';

        const impossible = activeGroups.find(g => g.status.type === 'impossible');
        if (impossible) {
            html += `<p style="font-size: 12px; color: #f85149; margin-top: 12px;">Consider dropping <strong>${escapeHtml(impossible.h.name)}</strong> to focus on the others.</p>`;
        }

        todoPanel.innerHTML = html;
    }

    function triggerConfetti() {
        const container = document.getElementById('confettiContainer');
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-10px';
            el.style.backgroundColor = ['#238636', '#58a6ff', '#d29922', '#f85149'][Math.floor(Math.random()*4)];
            el.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear forwards`;
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, t => {
            const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
            return replacements[t] || t;
        });
    }

    // Update countdowns every second
    setInterval(updateCountdowns, 1000);
    // Full render on user actions and every 60 seconds
    setInterval(render, 60000);
    render();

    function updateCountdowns() {
        document.querySelectorAll('[data-deadline]').forEach(el => {
            el.textContent = getCountdownText(el.dataset.deadline);
        });
    }
});