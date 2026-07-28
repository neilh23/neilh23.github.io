// Slot-machine spinner animation
// Fast continuous scroll with deceleration, bounce settle on the final number,
// then a 1.5s hold so the player can read it before the card reveal.

(function() {
  'use strict';
  window.App = window.App || {};

  var TOTAL_ITEMS = 30;
  var SPIN_DURATION = 3000; // ms for the scroll
  var BOUNCE_AMOUNT = 6;
  var HOLD_MS = 1500; // time the final number sits in the viewport before resolve

  var reel = null;
  var spinnerWindow = null;
  var spinning = false;

  function initSpinner() {
    reel = document.getElementById('spinner-reel');
    spinnerWindow = reel.parentElement;
  }

  // Read actual dimensions from the DOM so responsive CSS is respected
  function getItemHeight() {
    var el = reel.querySelector('.spinner-number');
    return el ? el.offsetHeight : 60;
  }

  function getWindowHeight() {
    return spinnerWindow ? spinnerWindow.offsetHeight : 300;
  }

  function randomNumber() {
    return Math.floor(Math.random() * 1000001);
  }

  function formatNumber(n) {
    return n.toLocaleString();
  }

  var TIER_COLORS = {
    C:   '#666680',
    B:   '#39ff14',
    A:   '#00ccff',
    S:   '#cc44ff',
    SS:  '#ffd700',
    SSS: '#ff0080',
  };

  function styleForTier(el, tier) {
    var color = TIER_COLORS[tier] || TIER_COLORS.C;
    el.style.color = color;
    if (tier === 'S' || tier === 'SS' || tier === 'SSS') {
      el.style.textShadow = '0 0 15px ' + color;
    } else {
      el.style.textShadow = '';
    }
  }

  function setNumber(el, num) {
    el.textContent = formatNumber(num);
    var tier = App.classifyNumber(num).tier;
    styleForTier(el, tier);
  }

  function populateReel(finalNumber) {
    reel.innerHTML = '';
    var items = [];
    var targetIndex = Math.floor(TOTAL_ITEMS / 2);

    for (var i = 0; i < TOTAL_ITEMS; i++) {
      var num = i === targetIndex ? finalNumber : randomNumber();
      var div = document.createElement('div');
      div.className = 'spinner-number';
      setNumber(div, num);
      reel.appendChild(div);
      items.push({ el: div, number: num });
    }
    return { items: items, targetIndex: targetIndex };
  }

  function centredPosition(itemIndex, itemH, winH) {
    var centerOffset = winH / 2 - itemH / 2;
    return -(itemIndex * itemH) + centerOffset;
  }

  function spin(finalNumber) {
    if (spinning) return Promise.reject(new Error('Already spinning'));
    spinning = true;

    return new Promise(function(resolve) {
      var result = populateReel(finalNumber);
      var items = result.items;
      var targetIndex = result.targetIndex;

      // Measure actual dimensions after populating the reel
      var itemH = getItemHeight();
      var winH = getWindowHeight();

      var targetPosition = centredPosition(targetIndex, itemH, winH);
      var totalScrollDistance = itemH * TOTAL_ITEMS * 3;
      var startPosition = targetPosition + totalScrollDistance;

      var startTime = null;
      var lastTickPosition = startPosition;
      var refreshCounter = 0;

      App.audio.playWhoosh();

      function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
      }

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / SPIN_DURATION, 1);

        var easedProgress = easeOutQuint(progress);
        var currentPosition = startPosition - (startPosition - targetPosition) * easedProgress;

        reel.style.transform = 'translateY(' + currentPosition + 'px)';

        var distanceMoved = Math.abs(currentPosition - lastTickPosition);
        if (distanceMoved > itemH) {
          var pitch = 0.8 + (progress * 0.4);
          App.audio.playTick(pitch);
          lastTickPosition = currentPosition;

          refreshCounter++;
          if (refreshCounter % 2 === 0) {
            var refreshIdx = refreshCounter % TOTAL_ITEMS;
            if (refreshIdx !== targetIndex) {
              setNumber(items[refreshIdx].el, randomNumber());
            }
          }
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Snap to target then bounce
          reel.style.transform = 'translateY(' + targetPosition + 'px)';
          bounce();
        }
      }

      function bounce() {
        var bounceStart = null;
        var bounceDuration = 300;

        function animateBounce(timestamp) {
          if (!bounceStart) bounceStart = timestamp;
          var elapsed = timestamp - bounceStart;
          var t = Math.min(elapsed / bounceDuration, 1);
          var offset = Math.sin(t * Math.PI * 2) * BOUNCE_AMOUNT * (1 - t);
          reel.style.transform = 'translateY(' + (targetPosition - offset) + 'px)';

          if (t < 1) {
            requestAnimationFrame(animateBounce);
          } else {
            reel.style.transform = 'translateY(' + targetPosition + 'px)';
            App.audio.playTick(1.2);
            // Hold the final number in the viewport
            setTimeout(function() {
              spinning = false;
              resolve(finalNumber);
            }, HOLD_MS);
          }
        }

        requestAnimationFrame(animateBounce);
      }

      requestAnimationFrame(animate);
    });
  }

  function isSpinning() {
    return spinning;
  }

  App.spinner = {
    initSpinner: initSpinner,
    spin: spin,
    isSpinning: isSpinning,
  };
})();
