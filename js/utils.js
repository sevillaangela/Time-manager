// Helper utility functions
function toast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function triggerNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '' });
  }
}

function updateClock() {
  const now = new Date();
  document.getElementById('live-clock').textContent = now.toTimeString().slice(0, 8);
}

// Start clock
setInterval(updateClock, 1000);
updateClock();

window.utils = { toast, escHtml, triggerNotification };