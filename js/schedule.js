// Schedule/calendar module
const scheduleModule = {
  saveEvents() {
    localStorage.setItem('focus_events', JSON.stringify(events));
  },

  getScheduleDate() {
    const d = new Date();
    d.setDate(d.getDate() + scheduleOffset);
    return d;
  },

  shiftDay(offset) {
    if (offset === 0) scheduleOffset = 0;
    else scheduleOffset += offset;
    this.render();
  },

  render() {
    const d = this.getScheduleDate();
    const isToday = scheduleOffset === 0;
    const isTomorrow = scheduleOffset === 1;
    const dayKey = d.toISOString().slice(0, 10);
    const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    document.getElementById('schedule-day-title').textContent =
      isToday ? 'Today' : isTomorrow ? 'Tomorrow' : DAY_NAMES[d.getDay()];
    document.getElementById('schedule-day-sub').textContent =
      `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

    const grid = document.getElementById('time-grid');
    const dayEvents = events.filter(e => e.date === dayKey);
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);
    
    grid.innerHTML = hours.map(h => {
      const hStr = h.toString().padStart(2, '0') + ':00';
      const slotEvs = dayEvents.filter(e => {
        const [eh] = e.time.split(':');
        return parseInt(eh) === h;
      });
      return `
        <div class="time-slot">
          <div class="time-label">${h === 12 ? '12pm' : h > 12 ? (h-12)+'pm' : h+'am'}</div>
          <div class="slot-area">
            ${slotEvs.map(e => `
              <div class="event-block ${e.color}">
                <span>${escHtml(e.title)} <span style="opacity:0.65;font-size:11px">${e.time} · ${e.duration}m</span></span>
                <button class="ev-del" onclick="scheduleModule.deleteEvent(${e.id})">
                  <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    this.renderUpcoming();
  },

  addEvent() {
    const title = document.getElementById('ev-title').value.trim();
    const time = document.getElementById('ev-time').value;
    if (!title || !time) { toast('Please fill in title and time'); return; }
    const d = this.getScheduleDate();
    const ev = {
      id: Date.now(),
      title,
      time,
      duration: parseInt(document.getElementById('ev-duration').value) || 60,
      color: document.getElementById('ev-color').value,
      date: d.toISOString().slice(0, 10)
    };
    events.push(ev);
    this.saveEvents();
    document.getElementById('ev-title').value = '';
    this.render();
    toast('Event added!');
    if (scheduleOffset === 0 && tasksModule) {
      tasksModule.scheduleTaskReminder({ text: title, time });
    }
  },

  deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    this.saveEvents();
    this.render();
  },

  renderUpcoming() {
    const container = document.getElementById('upcoming-events');
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5);
    if (!upcoming.length) {
      container.innerHTML = '<div style="color:var(--text3);font-size:12px">No upcoming events</div>';
      return;
    }
    container.innerHTML = upcoming.map(e => `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
        <div style="width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0;color:var(--accent)"></div>
        <div style="flex:1">
          <div style="font-weight:500">${escHtml(e.title)}</div>
          <div style="font-size:11px;color:var(--text3);font-family:'DM Mono',monospace">${e.date} ${e.time}</div>
        </div>
      </div>
    `).join('');
  }
};

window.scheduleModule = scheduleModule;