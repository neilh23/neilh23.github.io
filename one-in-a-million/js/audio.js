// Web Audio API procedural sound effects
// No audio files needed — everything is synthesized

(function() {
  'use strict';
  window.App = window.App || {};

  var audioCtx = null;
  var muted = false;

  function getCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function isMuted() {
    return muted;
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  function playTick(pitch) {
    if (pitch === undefined) pitch = 1.0;
    if (muted) return;
    var ctx = getCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800 * pitch;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  }

  function playWhoosh() {
    if (muted) return;
    var ctx = getCtx();
    var duration = 0.4;
    var bufferSize = ctx.sampleRate * duration;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    var noise = ctx.createBufferSource();
    noise.buffer = buffer;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2;
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + duration * 0.3);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + duration);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + duration);
  }

  function playRevealCommon() {
    if (muted) return;
    var ctx = getCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  function playRevealUncommon() {
    if (muted) return;
    var ctx = getCtx();
    [440, 554].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  function playRevealRare() {
    if (muted) return;
    var ctx = getCtx();
    [523, 659, 784].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  function playRevealSuperRare() {
    if (muted) return;
    var ctx = getCtx();
    [523, 659, 784, 1047].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  function playRevealUltraRare() {
    if (muted) return;
    var ctx = getCtx();
    [523, 659, 784, 1047, 1319].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
    var shimmer = ctx.createOscillator();
    var shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.value = 2500;
    shimmer.frequency.setValueAtTime(2500, ctx.currentTime + 0.3);
    shimmer.frequency.linearRampToValueAtTime(4000, ctx.currentTime + 0.8);
    shimmerGain.gain.setValueAtTime(0, ctx.currentTime);
    shimmerGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.4);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(ctx.currentTime + 0.3);
    shimmer.stop(ctx.currentTime + 0.9);
  }

  function playRevealLegendary() {
    if (muted) return;
    var ctx = getCtx();
    [262, 330, 392, 523, 659, 784, 1047].forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
    var chordTime = ctx.currentTime + 0.5;
    [523, 659, 784, 1047].forEach(function(freq) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(chordTime);
      osc.stop(chordTime + 1.0);
    });
    for (var i = 0; i < 5; i++) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 3000 + Math.random() * 2000;
      var t = ctx.currentTime + 0.5 + i * 0.15;
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  function playReveal(tier) {
    switch (tier) {
      case 'SSS': playRevealLegendary(); break;
      case 'SS':  playRevealUltraRare(); break;
      case 'S':   playRevealSuperRare(); break;
      case 'A':   playRevealRare(); break;
      case 'B':   playRevealUncommon(); break;
      default:    playRevealCommon(); break;
    }
  }

  function initAudio() {
    getCtx();
  }

  App.audio = {
    initAudio: initAudio,
    isMuted: isMuted,
    toggleMute: toggleMute,
    playTick: playTick,
    playWhoosh: playWhoosh,
    playReveal: playReveal,
  };
})();
