// Tasks management module
const tasksModule = {
  saveTasks() {
    localStorage.setItem('focus_tasks', JSON.stringify(tasks));
  },

  addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;
    
    const t = {
      id: Date.now(),
      text,
      priority: document.getElementById('task-priority').value,
      time: document.getElementById('task-time').value,
      done: false,
      created: new Date().toISOString()
    };
    tasks.unshift(t);
    this.saveTasks();
    input.value = '';
    document.getElementById('task-time').value = '';
    this.renderTasks();
    toast('Task added!');
    if (t.time) this.scheduleTaskReminder(t);
  },

  toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) { 
      t.done = !t.done; 
      this.saveTasks(); 
      this.renderTasks(); 
    }
  },

  deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  },

  filterTasks(f, btn) {
    taskFilter = f;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    this.renderTasks();
  },

  scheduleTaskReminder(task) {
    if (!task.time) return;
    const now = new Date();
    const [h, m] = task.time.split(':');
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +h, +m, 0);
    const diff = target - now;
    if (diff > 0 && diff < 86400000) {
      setTimeout(() => {
        triggerNotification('⏰ Task Reminder', task.text);
        toast('⏰ ' + task.text);
      }, diff);
    }
  },

  renderTasks() {
    const list = document.getElementById('task-list');
    let filtered = tasks;
    if (taskFilter === 'high') filtered = tasks.filter(t => t.priority === 'high');
    else if (taskFilter === 'medium') filtered = tasks.filter(t => t.priority === 'medium');
    else if (taskFilter === 'low') filtered = tasks.filter(t => t.priority === 'low');
    else if (taskFilter === 'pending') filtered = tasks.filter(t => !t.done);
    else if (taskFilter === 'done') filtered = tasks.filter(t => t.done);

    if (!filtered.length) {
      list.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>No tasks here yet.<br>Add one above!</div>';
    } else {
      list.innerHTML = filtered.map(t => `
        <div class="task-item ${t.done ? 'done' : ''}">
          <button class="task-check ${t.done ? 'checked' : ''}" onclick="tasksModule.toggleTask(${t.id})">
            ${t.done ? '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </button>
          <span class="task-text">${escHtml(t.text)}</span>
          ${t.time ? `<span class="task-time">${t.time}</span>` : ''}
          <span class="priority-badge p-${t.priority}">${t.priority}</span>
          <button class="task-del" onclick="tasksModule.deleteTask(${t.id})">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4h6v2"/></svg>
          </button>
        </div>
      `).join('');
    }
    this.updateStats();
  },

  updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const high = tasks.filter(t => t.priority === 'high' && !t.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-high').textContent = high;
    document.getElementById('stat-pct').textContent = pct + '%';
    const ring = document.getElementById('progress-ring');
    const circ = 251;
    ring.style.strokeDashoffset = circ - (circ * pct / 100);
    document.getElementById('progress-label').textContent = total ? `${done} of ${total} tasks complete` : 'No tasks yet';
  }
};

window.tasksModule = tasksModule;