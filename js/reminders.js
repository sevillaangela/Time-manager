// Reminders and notifications module
const remindersModule = {
  saveReminders() {
    localStorage.setItem('focus_reminders', JSON.stringify(reminders));
  },

  checkPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      document.getElementById('notif-banner').style.display = 'flex';
    }
  },

  requestNotifPerm() {
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        document.getElementById('notif-banner').style.display = 'none';
        toast('🔔 Notifications enabled!');
      }
    });
  },

  addReminder() {
    const title = document.getElementById('rem-title').value.trim();
    const dt = document.getElementById('rem-datetime').value;
    if (!title || !dt) { toast('Please add a title and date/time'); return; }
    const r = {
      id: Date.now(),
      title,
      datetime: dt,
      repeat: document.getElementById('rem-repeat').value,
      note: document.getElementById('rem-note').value.trim(),
      fired: false
    };
    reminders.push(r);
    this.saveReminders();
    document.getElementById('rem-title').value = '';
    document.getElementById('rem-note').value = '';
    this.renderReminders();
    this.scheduleReminderTimer(r);
    toast('Reminder set!');
    document.getElementById('notif-dot').classList.add('active');
  },

  scheduleReminderTimer(r) {
    const target = new Date(r.datetime).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return;
    setTimeout(() => {
      triggerNotification('🔔 ' + r.title, r.note || 'Your reminder is here!');
      toast('🔔 ' + r.title);
      const rem = reminders.find(x => x.id === r.id);
      if (rem) {
        if (rem.repeat === 'none') { 
          rem.fired = true; 
        } else {
          let next = new Date(rem.datetime);
          if (rem.repeat === 'daily') next.setDate(next.getDate() + 1);
          else if (rem.repeat === 'weekdays') {
            do { next.setDate(next.getDate() + 1); } while ([0,6].includes(next.getDay()));
          } else if (rem.repeat === 'weekly') next.setDate(next.getDate() + 7);
          rem.datetime = next.toISOString().slice(0, 16);
          this.scheduleReminderTimer(rem);
        }
        this.saveReminders();
        this.renderReminders();
      }
    }, diff);
  },

  deleteReminder(id) {
    reminders = reminders.filter(r => r.id !== id);
    this.saveReminders();
    this.renderReminders();
  },

  renderReminders() {
    const list = document.getElementById('reminder-list');
    const active = reminders.filter(r => !r.fired);
    document.getElementById('rem-count').textContent = active.length + ' active';
    document.getElementById('notif-dot').classList.toggle('active', active.length > 0);

    if (!reminders.length) {
      list.innerHTML = '<div class="empty"><div class="empty-icon">🔔</div>No reminders yet.</div>';
      return;
    }
    const sorted = [...reminders].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    const icons = { none: '🔔', daily: '🔁', weekdays: '💼', weekly: '📅' };
    const iconBg = { none: 'var(--info-bg)', daily: 'var(--accent-bg)', weekdays: 'var(--warn-bg)', weekly: 'var(--info-bg)' };
    list.innerHTML = sorted.map(r => {
      const dt = new Date(r.datetime);
      const dateStr = dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
      const timeStr = dt.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
      return `
        <div class="reminder-item ${r.fired ? 'fired' : ''}">
          <div class="reminder-icon" style="background:${iconBg[r.repeat] || 'var(--info-bg)'}">
            ${icons[r.repeat] || '🔔'}
          </div>
          <div class="reminder-info">
            <div class="reminder-title">${escHtml(r.title)}</div>
            <div class="reminder-time">${dateStr} · ${timeStr}${r.repeat !== 'none' ? ' · ' + r.repeat : ''}${r.fired ? ' · done' : ''}</div>
            ${r.note ? `<div style="font-size:11px;color:var(--text3);margin-top:2px">${escHtml(r.note)}</div>` : ''}
          </div>
          <button class="reminder-del" onclick="remindersModule.deleteReminder(${r.id})">
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      `;
    }).join('');
  },

  checkReminders() {
    const now = Date.now();
    reminders.forEach(r => {
      if (!r.fired && new Date(r.datetime).getTime() <= now) {
        triggerNotification('🔔 ' + r.title, r.note || 'Your reminder is here!');
        toast('🔔 ' + r.title);
        if (r.repeat === 'none') r.fired = true;
        else {
          let next = new Date(r.datetime);
          if (r.repeat === 'daily') next.setDate(next.getDate() + 1);
          else if (r.repeat === 'weekdays') {
            do { next.setDate(next.getDate() + 1); } while ([0,6].includes(next.getDay()));
          } else if (r.repeat === 'weekly') next.setDate(next.getDate() + 7);
          r.datetime = next.toISOString().slice(0, 16);
        }
      }
    });
    this.saveReminders();
    this.renderReminders();
  }
};

window.remindersModule = remindersModule;