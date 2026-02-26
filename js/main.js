// Main app — init, view routing, state machine, pity system

(function() {
  'use strict';

  var views = {};
  var currentView = 'collection';

  // Pity pool of interesting numbers
  var PITY_POOL = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 42, 43, 47, 53, 59, 61, 67,
    69, 71, 73, 79, 83, 89, 97, 100, 111, 123, 200, 222, 303, 314, 333, 404, 420,
    444, 500, 555, 666, 700, 777, 808, 888, 909, 999, 1000, 1024, 1066, 1111, 1234,
    1337, 1492, 1776, 1969, 1984, 2000, 2001, 2222, 3000, 3333, 4321, 4444, 5000,
    5555, 6666, 7777, 8080, 8888, 9999, 10000, 12345, 20000, 30000, 50000, 54321,
    100000, 111111, 123456, 200000, 314159, 500000, 654321,
  ];

  function showView(name) {
    for (var key in views) {
      views[key].classList.toggle('active', key === name);
    }
    currentView = name;

    var pullBtn = document.getElementById('btn-pull');
    var bottomBar = document.getElementById('bottom-bar');
    var collBtn = document.getElementById('btn-collection');

    if (name === 'spinner') {
      pullBtn.disabled = true;
      bottomBar.style.display = 'none';
    } else {
      pullBtn.disabled = false;
      bottomBar.style.display = '';
    }

    collBtn.classList.toggle('active', name === 'collection');
  }

  function generateNumber() {
    var devNum = App.dev.consumeDevNumber();
    if (devNum !== null) return devNum;

    var consecutiveC = App.collection.getConsecutiveCTier();
    if (consecutiveC >= 15 && Math.random() < 0.2) {
      return PITY_POOL[Math.floor(Math.random() * PITY_POOL.length)];
    }

    return Math.floor(Math.random() * 1000001);
  }

  function doPull() {
    if (App.spinner.isSpinning()) return;

    App.audio.initAudio();

    var number = generateNumber();
    var cardData = App.classifyNumber(number);

    showView('spinner');
    App.cards.resetRevealCard(document.getElementById('reveal-card'));

    App.spinner.spin(number).then(function() {
      App.collection.recordPull(cardData);
      App.audio.playReveal(cardData.tier);

      showView('cardReveal');
      App.cards.renderRevealCard(
        document.getElementById('reveal-card'),
        cardData,
        App.collection.isFavourite(number),
        function(num) { return App.collection.toggleFavourite(num); }
      );
    });
  }

  function renderCollection() {
    var grid = document.getElementById('collection-grid');
    var empty = document.getElementById('empty-collection');
    var sortBy = document.getElementById('sort-select').value;
    var filterBy = document.getElementById('filter-select').value;

    var items = App.collection.getCollection(sortBy, filterBy);

    grid.innerHTML = '';

    if (items.length === 0 && App.collection.getState().collection.length === 0) {
      empty.classList.add('visible');
      grid.style.display = 'none';
    } else {
      empty.classList.remove('visible');
      grid.style.display = '';

      if (items.length === 0) {
        var msg = document.createElement('div');
        msg.style.cssText = 'grid-column: 1/-1; text-align:center; color: var(--text-dim); padding: 20px;';
        msg.textContent = 'No cards match this filter.';
        grid.appendChild(msg);
      } else {
        for (var i = 0; i < items.length; i++) {
          (function(entry) {
            var miniCard = App.cards.renderMiniCard(entry, function(e) {
              var cd = App.classifyNumber(e.number);
              showView('cardReveal');
              App.cards.renderRevealCard(
                document.getElementById('reveal-card'),
                cd,
                App.collection.isFavourite(e.number),
                function(num) { return App.collection.toggleFavourite(num); }
              );
            });
            grid.appendChild(miniCard);
          })(items[i]);
        }
      }
    }

    updateStats();
  }

  function updateStats() {
    var stats = App.collection.getStats();
    document.getElementById('stat-pulls').textContent = stats.pulls.toLocaleString();
    document.getElementById('stat-unique').textContent = stats.unique.toLocaleString();
    document.getElementById('stat-best').textContent = stats.bestScore > 0
      ? stats.bestTier + ' (' + stats.bestScore + ')'
      : '\u2014';
    document.getElementById('stat-score').textContent = stats.totalScore.toLocaleString();
  }

  function initEvents() {
    document.getElementById('btn-pull').addEventListener('click', doPull);
    document.getElementById('btn-pull-again').addEventListener('click', doPull);

    document.getElementById('btn-back-collection').addEventListener('click', function() {
      showView('collection');
      renderCollection();
    });

    document.getElementById('btn-collection').addEventListener('click', function() {
      showView('collection');
      renderCollection();
    });

    document.getElementById('btn-mute').addEventListener('click', function() {
      var muted = App.audio.toggleMute();
      document.getElementById('icon-sound-on').style.display = muted ? 'none' : '';
      document.getElementById('icon-sound-off').style.display = muted ? '' : 'none';
    });

    document.getElementById('sort-select').addEventListener('change', renderCollection);
    document.getElementById('filter-select').addEventListener('change', renderCollection);

    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (currentView === 'collection' || currentView === 'cardReveal') {
          doPull();
        }
      }

      if (e.key === 'Escape' && currentView === 'cardReveal') {
        showView('collection');
        renderCollection();
      }
    });

    // Touch: swipe left on card reveal to go to collection
    var touchStartX = 0;
    var cardRevealView = views.cardReveal;
    cardRevealView.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    cardRevealView.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (dx < -60) {
        showView('collection');
        renderCollection();
      }
    }, { passive: true });
  }

  function init() {
    views = {
      collection: document.getElementById('view-collection'),
      spinner: document.getElementById('view-spinner'),
      cardReveal: document.getElementById('view-card-reveal'),
    };
    App.collection.loadState();
    App.spinner.initSpinner();
    App.dev.initDev();
    initEvents();
    renderCollection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
