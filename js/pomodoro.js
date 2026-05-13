// Pomodoro timer module
const pomodoroModule = {
  setMode(mode, btn) {
    if (pomoRunning) return;
    pomoMode = mode;
    document.querySelectorAll('.pomo-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const dur = mode === 'focus' ? pomoDurations.focus : mode === 'short' ? pomoDurations.short : pomoDurations.long;
    pomoSecondsLeft = dur * 60;
    pomoTotalSeconds = dur * 60;
    const ring = document.getElementById('pomo-ring');
    ring.style.stroke = mode === 'focus' ? 'var(--accent)' : mode === 'short' ? 'var(--info)' : 'var(--warn)';
    this.updateDisplay();
  },

  toggle() {
    if (pomoRunning) {
      clearInterval(pomoTimer);
      pomoRunning = false;
      document.getElementById('play-icon').innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    } else {
      pomoRunning = true;
      document.getElementById('play-icon').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      pomoTimer = setInterval(() => this.tick(), 1000);
    }
  },

  tick() {
    if (pomoSecondsLeft <= 0) {
      clearInterval(pomoTimer);
      pomoRunning = false;
      this.onComplete();
      return;
    }
    pomoSecondsLeft--;
    if (pomoMode === 'focus') pomoFocusMin = Math.floor((pomoTotalSeconds - pomoSecondsLeft) / 60);
    this.updateDisplay();
  },

  onComplete() {
    triggerNotification('⏱ Pomodoro Complete!',
      pomoMode === 'focus' ? 'Focus session done! Time for a break.' : 'Break over! Ready to focus?');
    toast(pomoMode === 'focus' ? '🎉 Focus session complete!' : '☕ Break time over!');

    if (pomoMode === 'focus') {
      pomoCompletedToday++;
      pomoStreak++;
      pomoSessionsDone++;
      const sessions = parseInt(document.getElementById('sessions-num').value);
      this.renderSessionDots();
      document.getElementById('pomo-completed').textContent = pomoCompletedToday;
      document.getElementById('pomo-focus-min').textContent = pomoDurations.focus * pomoCompletedToday;
      document.getElementById('pomo-streak').textContent = pomoStreak;
      if (pomoSessionsDone >= sessions) {
        pomoSessionsDone = 0;
        this.setMode('long', document.querySelectorAll('.pomo-tab')[2]);
      } else {
        this.setMode('short', document.querySelectorAll('.pomo-tab')[1]);
      }
    } else {
      this.setMode('focus', document.querySelectorAll('.pomo-tab')[0]);
    }
    document.getElementById('play-icon').innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  },

  reset() {
    clearInterval(pomoTimer);
    pomoRunning = false;
    document.getElementById('play-icon').innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    const dur = pomoMode === 'focus' ? pomoDurations.focus : pomoMode === 'short' ? pomoDurations.short : pomoDurations.long;
    pomoSecondsLeft = dur * 60;
    pomoTotalSeconds = dur * 60;
    this.updateDisplay();
  },

  skip() {
    clearInterval(pomoTimer);
    pomoRunning = false;
    pomoSecondsLeft = 0;
    this.onComplete();
  },

  updateDisplay() {
    const m = Math.floor(pomoSecondsLeft / 60).toString().padStart(2, '0');
    const s = (pomoSecondsLeft % 60).toString().padStart(2, '0');
    document.getElementById('pomo-display').textContent = m + ':' + s;
    document.getElementById('pomo-phase').textContent =
      pomoMode === 'focus' ? 'Focus' : pomoMode === 'short' ? 'Short Break' : 'Long Break';
    const ring = document.getElementById('pomo-ring');
    const circ = 603;
    const prog = 1 - (pomoSecondsLeft / pomoTotalSeconds);
    ring.style.strokeDashoffset = circ * (1 - prog);
  },

  updateDurations() {
    pomoDurations.focus = parseInt(document.getElementById('focus-dur').value) || 25;
    pomoDurations.short = parseInt(document.getElementById('short-dur').value) || 5;
    pomoDurations.long = parseInt(document.getElementById('long-dur').value) || 15;
    if (!pomoRunning) this.reset();
  },

  renderSessionDots() {
    const n = parseInt(document.getElementById('sessions-num').value) || 4;
    const container = document.getElementById('session-dots');
    container.innerHTML = Array.from({ length: n }, (_, i) => {
      let cls = 'session-dot';
      if (i < pomoSessionsDone) cls += ' done';
      else if (i === pomoSessionsDone) cls += ' current';
      return `<div class="${cls}"></div>`;
    }).join('');
  }
};

window.pomodoroModule = pomodoroModule;