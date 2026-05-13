// Global state and localStorage management
let tasks = JSON.parse(localStorage.getItem('focus_tasks') || '[]');
let events = JSON.parse(localStorage.getItem('focus_events') || '[]');
let reminders = JSON.parse(localStorage.getItem('focus_reminders') || '[]');
let taskFilter = 'all';
let scheduleOffset = 0;

// Pomodoro state
let pomoMode = 'focus';
let pomoRunning = false;
let pomoTimer = null;
let pomoSecondsLeft = 25 * 60;
let pomoTotalSeconds = 25 * 60;
let pomoDurations = { focus: 25, short: 5, long: 15 };
let pomoCompletedToday = 0;
let pomoFocusMin = 0;
let pomoStreak = 0;
let pomoSessionsDone = 0;

// Export state for other modules (using global scope)
window.state = {
    tasks, events, reminders, taskFilter, scheduleOffset,
    pomoMode, pomoRunning, pomoTimer, pomoSecondsLeft, pomoTotalSeconds,
    pomoDurations, pomoCompletedToday, pomoFocusMin, pomoStreak, pomoSessionsDone
};