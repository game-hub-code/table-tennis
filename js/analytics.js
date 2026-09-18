import Analytics from './google-analytics.js';

// Fire a page view event on load
window.addEventListener('load', () => {
  Analytics.firePageViewEvent(document.title, document.location.href);
});

// Listen globally for all button events
document.addEventListener('click', (event) => {
  let restartIds = ['restart', 'easy', 'medium', 'hard'];
  if (event.target && event.target.id && restartIds.indexOf(event.target.id) >= 0) {
    Analytics.firePageViewEvent(document.title + ' - Restart', document.location.href);
  }
});