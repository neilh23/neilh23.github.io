// Collection & achievement state, localStorage persistence

(function() {
  'use strict';
  window.App = window.App || {};

  var STORAGE_KEY = 'one-in-a-million';
  var TIER_RANK = { C: 0, B: 1, A: 2, S: 3, SS: 4, SSS: 5 };

  var state = {
    pulls: 0,
    consecutiveCTier: 0,
    collection: [],
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        state = {
          pulls: parsed.pulls || 0,
          consecutiveCTier: parsed.consecutiveCTier || 0,
          collection: parsed.collection || [],
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return state;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function getState() {
    return state;
  }

  function recordPull(cardData) {
    state.pulls++;
    if (cardData.tier === 'C') {
      state.consecutiveCTier++;
    } else {
      state.consecutiveCTier = 0;
    }

    var existing = state.collection.find(function(e) { return e.number === cardData.number; });
    if (existing) {
      existing.timesPulled = (existing.timesPulled || 1) + 1;
      existing.lastPulledAt = new Date().toISOString();
      saveState();
      return existing;
    }

    var entry = {
      number: cardData.number,
      tier: cardData.tier,
      score: cardData.score,
      categories: cardData.categories.map(function(c) { return c.name; }),
      primaryCategory: cardData.primaryCategory,
      flavourText: cardData.flavourText || '',
      quote: cardData.quote || '',
      favourite: false,
      timesPulled: 1,
      pulledAt: new Date().toISOString(),
      lastPulledAt: new Date().toISOString(),
    };

    state.collection.push(entry);
    saveState();
    return entry;
  }

  function toggleFavourite(number) {
    var entry = state.collection.find(function(e) { return e.number === number; });
    if (entry) {
      entry.favourite = !entry.favourite;
      saveState();
      return entry.favourite;
    }
    return false;
  }

  function isFavourite(number) {
    var entry = state.collection.find(function(e) { return e.number === number; });
    return entry ? entry.favourite : false;
  }

  function getConsecutiveCTier() {
    return state.consecutiveCTier;
  }

  function getCollection(sortBy, filterBy) {
    sortBy = sortBy || 'score';
    filterBy = filterBy || 'all';
    var items = state.collection.slice();

    if (filterBy === 'favourites') {
      items = items.filter(function(e) { return e.favourite; });
    } else if (filterBy !== 'all') {
      items = items.filter(function(e) { return e.tier === filterBy; });
    }

    switch (sortBy) {
      case 'score':
        items.sort(function(a, b) { return b.score - a.score || TIER_RANK[b.tier] - TIER_RANK[a.tier]; });
        break;
      case 'number':
        items.sort(function(a, b) { return a.number - b.number; });
        break;
      case 'date':
        items.sort(function(a, b) { return new Date(b.pulledAt) - new Date(a.pulledAt); });
        break;
      case 'tier':
        items.sort(function(a, b) { return TIER_RANK[b.tier] - TIER_RANK[a.tier] || b.score - a.score; });
        break;
    }
    return items;
  }

  function getStats() {
    var coll = state.collection;
    var bestScore = 0;
    var bestTier = 'C';
    var totalScore = 0;

    for (var i = 0; i < coll.length; i++) {
      var entry = coll[i];
      totalScore += entry.score;
      if (entry.score > bestScore) {
        bestScore = entry.score;
        bestTier = entry.tier;
      }
    }

    return {
      pulls: state.pulls,
      unique: coll.length,
      bestScore: bestScore,
      bestTier: bestTier,
      totalScore: totalScore,
    };
  }

  App.collection = {
    loadState: loadState,
    getState: getState,
    recordPull: recordPull,
    toggleFavourite: toggleFavourite,
    isFavourite: isFavourite,
    getConsecutiveCTier: getConsecutiveCTier,
    getCollection: getCollection,
    getStats: getStats,
  };
})();
