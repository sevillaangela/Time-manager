// Main application initialization
function initApp() {
  // Render all modules
  tasksModule.renderTasks();
  pomodoroModule.renderSessionDots();
  pomodoroModule.updateDisplay();
  scheduleModule.render();
  remindersModule.renderReminders();

  // Set default datetime-local to now + 1 hour
  const defDt = new Date(Date.now() + 3600000);
  document.getElementById('rem-datetime').value = defDt.toISOString().slice(0, 16);

  // Reschedule existing reminders on page load
  reminders.filter(r => !r.fired).forEach(r => remindersModule.scheduleReminderTimer(r));

  // Start periodic reminder check
  setInterval(() => remindersModule.checkReminders(), 30000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}