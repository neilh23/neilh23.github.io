// Dev mode — press 'r' to toggle number input overlay
// Type a number (0-1,000,000), press Enter to force next pull

(function() {
  'use strict';
  window.App = window.App || {};

  var devNumber = null;

  function initDev() {
    var overlay = document.getElementById('dev-overlay');
    var badge = document.getElementById('dev-badge');
    var input = document.getElementById('dev-input');
    var submitBtn = document.getElementById('dev-submit');
    var closeBtn = document.getElementById('dev-close');

    function toggleOverlay() {
      overlay.classList.toggle('hidden');
      if (!overlay.classList.contains('hidden')) {
        input.focus();
        input.select();
      }
    }

    function setDevNumber() {
      var val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 0 && val <= 1000000) {
        devNumber = val;
        badge.classList.remove('hidden');
        badge.textContent = 'DEV: ' + val.toLocaleString();
        overlay.classList.add('hidden');
      }
    }

    function closeOverlay() {
      overlay.classList.add('hidden');
    }

    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        if (e.target === input && e.key === 'Enter') {
          setDevNumber();
        }
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        toggleOverlay();
      }
    });

    submitBtn.addEventListener('click', setDevNumber);
    closeBtn.addEventListener('click', closeOverlay);
  }

  function consumeDevNumber() {
    if (devNumber !== null) {
      var n = devNumber;
      devNumber = null;
      document.getElementById('dev-badge').classList.add('hidden');
      return n;
    }
    return null;
  }

  App.dev = {
    initDev: initDev,
    consumeDevNumber: consumeDevNumber,
  };
})();
