// Card rendering — power cards vs normal
// Design varies by tier: C grey -> SSS rainbow animated

(function() {
  'use strict';
  window.App = window.App || {};

  function renderRevealCard(container, cardData, isFavourite, onFavToggle) {
    var number = cardData.number;
    var tier = cardData.tier;
    var score = cardData.score;
    var primaryCategory = cardData.primaryCategory;
    var flavourText = cardData.flavourText;
    var quote = cardData.quote;
    var tierClass = 'tier-' + tier.toLowerCase();

    container.innerHTML = '';
    container.className = 'reveal-card ' + tierClass;

    // Sparkles for SSS
    if (tier === 'SSS') {
      for (var i = 0; i < 8; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (10 + Math.random() * 80) + '%';
        sparkle.style.top = (10 + Math.random() * 80) + '%';
        sparkle.style.animationDelay = (Math.random() * 1.5) + 's';
        sparkle.style.animationDuration = (1 + Math.random()) + 's';
        container.appendChild(sparkle);
      }
    }

    // Favourite button
    var favBtn = document.createElement('button');
    favBtn.className = 'card-fav-btn' + (isFavourite ? ' active' : '');
    favBtn.textContent = isFavourite ? '\u2764\ufe0f' : '\u2661';
    favBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var newState = onFavToggle(number);
      favBtn.textContent = newState ? '\u2764\ufe0f' : '\u2661';
      favBtn.classList.toggle('active', newState);
    });
    container.appendChild(favBtn);

    // Tier badge
    var badge = document.createElement('div');
    badge.className = 'card-tier-badge';
    badge.textContent = tier;
    container.appendChild(badge);

    // Number
    var numEl = document.createElement('div');
    numEl.className = 'card-number';
    numEl.textContent = number.toLocaleString();
    container.appendChild(numEl);

    // Category — use flavour text name if available, otherwise generic category
    var catEl = document.createElement('div');
    catEl.className = 'card-category';
    catEl.textContent = flavourText || primaryCategory;
    container.appendChild(catEl);

    // Quote (S tier and above)
    if (quote && (tier === 'S' || tier === 'SS' || tier === 'SSS')) {
      var quoteEl = document.createElement('div');
      quoteEl.className = 'card-quote';
      quoteEl.textContent = '"' + quote + '"';
      container.appendChild(quoteEl);
    }

    // Score
    var scoreEl = document.createElement('div');
    scoreEl.className = 'card-score';
    scoreEl.textContent = score + ' pts';
    container.appendChild(scoreEl);

    // Animate in
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        container.classList.add('revealed');
      });
    });
  }

  function renderMiniCard(entry, onClick) {
    var number = entry.number;
    var tier = entry.tier;
    var favourite = entry.favourite;
    var timesPulled = entry.timesPulled;
    var tierClass = 'tier-' + tier.toLowerCase();

    var card = document.createElement('div');
    card.className = 'mini-card ' + tierClass;
    card.addEventListener('click', function() { onClick(entry); });

    if (favourite) {
      var fav = document.createElement('span');
      fav.className = 'mini-fav';
      fav.textContent = '\u2764\ufe0f';
      card.appendChild(fav);
    }

    if (timesPulled > 1) {
      var count = document.createElement('span');
      count.className = 'mini-count';
      count.textContent = 'x' + timesPulled;
      card.appendChild(count);
    }

    var numEl = document.createElement('span');
    numEl.className = 'mini-number';
    numEl.textContent = number.toLocaleString();
    card.appendChild(numEl);

    var tierEl = document.createElement('span');
    tierEl.className = 'mini-tier';
    tierEl.textContent = tier;
    card.appendChild(tierEl);

    return card;
  }

  function resetRevealCard(container) {
    container.classList.remove('revealed');
    container.innerHTML = '';
    container.className = 'reveal-card';
  }

  App.cards = {
    renderRevealCard: renderRevealCard,
    renderMiniCard: renderMiniCard,
    resetRevealCard: resetRevealCard,
  };
})();
