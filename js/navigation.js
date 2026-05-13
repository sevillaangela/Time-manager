// Panel navigation and UI utilities
const navigation = {
  showPanel(name, btn) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
    btn.classList.add('active');
    
    if (name === 'schedule' && scheduleModule) scheduleModule.render();
    if (name === 'reminders' && remindersModule) remindersModule.checkPermission();
  }
};

window.navigation = navigation;