// Number classification system
// Each number gets: tier, score, categories[], flavourText, quote

(function() {
  'use strict';
  window.App = window.App || {};

  var TIERS = {
    C:   { name: 'Common',      color: '#666680', score: 1 },
    B:   { name: 'Uncommon',    color: '#39ff14', score: 5 },
    A:   { name: 'Rare',        color: '#00ccff', score: 25 },
    S:   { name: 'Super Rare',  color: '#cc44ff', score: 100 },
    SS:  { name: 'Ultra Rare',  color: '#ffd700', score: 500 },
    SSS: { name: 'Legendary',   color: '#ff0080', score: 1000 },
  };

  var TIER_ORDER = ['C', 'B', 'A', 'S', 'SS', 'SSS'];

  // Power card database — exact match numbers with special text
  var POWER_CARDS = {
    0:      { text: 'The Void',              quote: 'Nothing is more real than nothing. \u2014 Beckett',                        tier: 'SS' },
    1:      { text: 'The One',               quote: 'One is the loneliest number.',                                             tier: 'SSS' },
    2:      { text: 'The Pair',              quote: 'It takes two to tango.',                                                   tier: 'A' },
    3:      { text: 'The Triad',             quote: 'Good things come in threes.',                                              tier: 'A' },
    4:      { text: 'Unlucky Four',          quote: 'In many East Asian cultures, four sounds like death.',                      tier: 'A' },
    5:      { text: 'High Five',             quote: 'The human hand, distilled.',                                               tier: 'A' },
    6:      { text: 'The Hex',               quote: 'A perfect number: 1 + 2 + 3.',                                             tier: 'A' },
    7:      { text: 'Lucky Seven',           quote: 'Fortune favours the sevens.',                                              tier: 'S' },
    8:      { text: 'Infinity Turned',       quote: 'Eight on its side is forever.',                                            tier: 'A' },
    9:      { text: 'Cloud Nine',            quote: 'The highest single digit.',                                                tier: 'A' },
    10:     { text: 'Perfect Ten',           quote: 'A perfect score.',                                                         tier: 'A' },
    13:     { text: 'Unlucky Thirteen',      quote: 'Triskaidekaphobia intensifies.',                                           tier: 'A' },
    23:     { text: 'The 23 Enigma',         quote: 'Captain Clark welcomes you aboard.',                                       tier: 'S' },
    42:     { text: 'The Answer',            quote: 'The answer to life, the universe, and everything.',                         tier: 'S' },
    69:     { text: 'Nice',                  quote: 'Nice.',                                                                    tier: 'S' },
    80:     { text: 'Eighty',                quote: 'Around the world in 80 days.',                                             tier: 'A' },
    88:     { text: '88 MPH',               quote: 'When this baby hits 88 miles per hour, you\'re gonna see some serious s\u2014', tier: 'S' },
    99:     { text: 'Ninety-Nine',           quote: '99 Luftballons.',                                                          tier: 'A' },
    100:    { text: 'The Century',           quote: 'A perfect hundred.',                                                       tier: 'A' },
    101:    { text: 'Room 101',              quote: 'Everyone knows what is in Room 101.',                                      tier: 'A' },
    123:    { text: 'Easy as 1-2-3',         quote: 'Simple as do-re-mi.',                                                      tier: 'A' },
    256:    { text: 'A Byte',                quote: '2\u2078 \u2014 The size of a byte.',                                       tier: 'A' },
    303:    { text: 'Acid House',            quote: 'Roland TB-303 \u2014 The sound of acid.',                                  tier: 'S' },
    314:    { text: 'Pi Day',                quote: '3.14159265...',                                                             tier: 'S' },
    404:    { text: 'Not Found',             quote: 'These aren\'t the droids you\'re looking for.',                             tier: 'A' },
    420:    { text: 'Blaze It',              quote: 'It\'s always 4:20 somewhere.',                                              tier: 'S' },
    451:    { text: 'Fahrenheit 451',        quote: 'The temperature at which book-paper catches fire. \u2014 Bradbury',        tier: 'A' },
    500:    { text: 'Internal Server Error', quote: 'Something went wrong on our end.',                                         tier: 'A' },
    512:    { text: 'Half a K',              quote: '2\u2079 \u2014 A power of two.',                                           tier: 'A' },
    666:    { text: 'Number of the Beast',   quote: 'Let him who hath understanding reckon the number...',                      tier: 'S' },
    747:    { text: 'Jumbo Jet',             quote: 'Boeing 747 \u2014 Queen of the Skies.',                                    tier: 'A' },
    777:    { text: 'Jackpot',               quote: 'Triple sevens! Winner winner!',                                            tier: 'S' },
    808:    { text: 'Boom',                  quote: 'Roland TR-808 \u2014 The beat goes on.',                                   tier: 'S' },
    867:    { text: '867-5309',              quote: 'Jenny, I got your number.',                                                tier: 'A' },
    909:    { text: 'The Nine Oh Nine',      quote: 'Roland TR-909 \u2014 House music\'s heartbeat.',                            tier: 'S' },
    911:    { text: 'Emergency',             quote: 'What\'s your emergency?',                                                   tier: 'A' },
    999:    { text: 'Triple Nine',           quote: 'Emergency services.',                                                       tier: 'A' },
    1024:   { text: 'Kilobyte',              quote: '2\u00B9\u2070 \u2014 A true kilobyte.',                                    tier: 'A' },
    1066:   { text: 'Battle of Hastings',    quote: 'The last successful invasion of England.',                                 tier: 'A' },
    1234:   { text: 'Counting Up',           quote: '1, 2, 3, 4 \u2014 simple and satisfying.',                                tier: 'A' },
    1312:   { text: 'ACAB',                  quote: 'All cats are beautiful.',                                                  tier: 'S' },
    1337:   { text: 'L33T',                  quote: 'h4x0r sp34k',                                                              tier: 'S' },
    1492:   { text: 'New World',             quote: 'In fourteen hundred ninety-two, Columbus sailed the ocean blue.',           tier: 'A' },
    1776:   { text: 'Independence',          quote: 'We hold these truths to be self-evident...',                                tier: 'A' },
    1789:   { text: 'Libert\u00e9',          quote: 'Libert\u00e9, \u00c9galit\u00e9, Fraternit\u00e9.',                        tier: 'A' },
    1865:   { text: 'Abolition',             quote: 'The Thirteenth Amendment.',                                                 tier: 'A' },
    1901:   { text: 'New Century',           quote: 'The dawn of the 20th century.',                                             tier: 'A' },
    1912:   { text: 'Titanic',              quote: 'Unsinkable, they said.',                                                    tier: 'A' },
    1945:   { text: 'Victory',              quote: 'The end of the Second World War.',                                          tier: 'A' },
    1969:   { text: 'Moon Year',            quote: 'One giant leap for mankind.',                                                tier: 'S' },
    1984:   { text: 'Big Brother',          quote: 'War is peace. Freedom is slavery. Ignorance is strength.',                  tier: 'S' },
    1989:   { text: 'The Wall Falls',       quote: 'Tear down this wall!',                                                      tier: 'A' },
    2000:   { text: 'Y2K',                  quote: 'The millennium bug that never quite bit.',                                   tier: 'A' },
    2001:   { text: 'A Space Odyssey',      quote: 'I\'m sorry, Dave. I\'m afraid I can\'t do that.',                           tier: 'S' },
    2012:   { text: 'End of the World',     quote: 'The Mayan calendar ends... or does it?',                                    tier: 'A' },
    2600:   { text: 'Phreaking',            quote: '2600 Hz \u2014 The hacker\'s frequency.',                                   tier: 'S' },
    4004:   { text: 'Genesis Chip',         quote: 'Intel 4004 \u2014 The first microprocessor.',                               tier: 'A' },
    4096:   { text: 'Power of Two',         quote: '2\u00B9\u00B2 \u2014 Deep in binary.',                                     tier: 'A' },
    4321:   { text: 'Countdown',            quote: '4, 3, 2, 1 \u2014 liftoff!',                                               tier: 'A' },
    8008:   { text: 'Calculator Classic',   quote: 'Every schoolkid\'s first hack.',                                            tier: 'S' },
    8080:   { text: 'Intel 8080',           quote: 'The chip that started the PC revolution.',                                  tier: 'A' },
    8086:   { text: 'x86 Origin',           quote: 'Intel 8086 \u2014 x86 architecture begins.',                               tier: 'A' },
    8888:   { text: 'Lucky Eights',         quote: 'Prosperity and fortune in Chinese culture.',                                tier: 'S' },
    9999:   { text: 'The Limit',            quote: 'Maximum four digits.',                                                       tier: 'A' },
    10000:  { text: 'Ten Thousand',         quote: 'The myriad.',                                                                tier: 'S' },
    12345:  { text: 'Sequential',           quote: 'That\'s the kind of combination an idiot would have on his luggage.',        tier: 'S' },
    31337:  { text: 'Elite',                quote: 'ELEET \u2014 The ultimate hacker badge.',                                   tier: 'SS' },
    42069:  { text: 'The Ultimate Meme',    quote: 'Nice answer.',                                                               tier: 'SS' },
    54321:  { text: 'Countdown',            quote: 'Final countdown!',                                                           tier: 'S' },
    58008:  { text: 'Classic Calculator',   quote: 'Flip it.',                                                                   tier: 'S' },
    65535:  { text: 'Max Unsigned 16-bit',  quote: '2\u00B9\u2076 - 1 \u2014 The 16-bit ceiling.',                              tier: 'S' },
    65536:  { text: 'Power of Two',         quote: '2\u00B9\u2076 \u2014 Overflowing into 17 bits.',                            tier: 'A' },
    80085:  { text: 'Calculator Strikes Again', quote: 'Some things never change.',                                             tier: 'S' },
    90210:  { text: 'Beverly Hills',        quote: 'The famous zip code.',                                                       tier: 'A' },
    99999:  { text: 'Five Nines',           quote: 'So close to the top.',                                                       tier: 'S' },
    100000: { text: 'Six Figures',          quote: 'Welcome to the big leagues.',                                                tier: 'SS' },
    111111: { text: 'All Ones',             quote: 'The simplest repdigit.',                                                     tier: 'S' },
    123456: { text: 'The Sequence',         quote: 'The world\'s worst password.',                                               tier: 'SS' },
    142857: { text: 'Cyclic Number',        quote: 'Multiply by 1-6 and the digits just rearrange.',                            tier: 'SS' },
    200769: { text: 'One Small Step',       quote: 'That\'s one small step for man... (20/07/69)',                               tier: 'SS' },
    314159: { text: 'Pi',                   quote: '\u03c0 \u2014 The ratio of a circle\'s circumference to its diameter.',     tier: 'SS' },
    250012: { text: 'Christmas',            quote: 'Merry Christmas! (25/12)',                                                   tier: 'SS' },
    271828: { text: 'Euler\'s Number',      quote: 'e \u2014 The base of natural logarithms.',                                  tier: 'SS' },
    110901: { text: 'A Day That Changed Everything', quote: 'September 11, 2001. (11/09/01)',                                   tier: 'SS' },
    60644:  { text: 'D-Day',               quote: 'Operation Overlord begins. (06/06/44)',                                      tier: 'SS' },
    141189: { text: 'The Wall Falls',       quote: 'The Berlin Wall comes down. (14/11/89)',                                    tier: 'SS' },
    280666: { text: 'World Cup \'66',       quote: 'They think it\'s all over... it is now! (28/06/66)',                         tier: 'SS' },
    150869: { text: 'Woodstock',            quote: '3 days of peace & music. (15/08/69)',                                       tier: 'SS' },
    120499: { text: 'The Matrix',           quote: 'What is the Matrix? (US release 31/03/99)',                                 tier: 'A' },
    161299: { text: 'Y2K Eve Approaches',   quote: 'Stocking up on canned goods. (16/12/99)',                                   tier: 'A' },
    500000: { text: 'Halfway',              quote: 'Perfectly balanced, as all things should be.',                               tier: 'SS' },
    654321: { text: 'Countdown Sequence',   quote: 'Counting down from the top.',                                               tier: 'SS' },
    696969: { text: 'Triple Nice',          quote: 'Nice nice nice.',                                                            tier: 'SS' },
    777777: { text: 'Lucky Sevens',         quote: 'The ultimate jackpot.',                                                      tier: 'SS' },
    888888: { text: 'Fortune',              quote: 'Maximum prosperity.',                                                        tier: 'SS' },
    999999: { text: 'The Penultimate',      quote: 'One short of a million.',                                                   tier: 'SSS' },
    1000000:{ text: 'One in a Million',     quote: 'You actually did it. One in a million.',                                    tier: 'SSS' },
  };

  // --- Classification functions ---

  function isPrime(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (var i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  function isRepdigit(n) {
    var s = String(n);
    return s.length >= 2 && s.split('').every(function(c) { return c === s[0]; });
  }

  function isPalindrome(n) {
    var s = String(n);
    if (s.length < 3) return false;
    return s === s.split('').reverse().join('');
  }

  function isSequentialAsc(n) {
    var s = String(n);
    if (s.length < 3) return false;
    for (var i = 1; i < s.length; i++) {
      if (parseInt(s[i]) !== parseInt(s[i - 1]) + 1) return false;
    }
    return true;
  }

  function isSequentialDesc(n) {
    var s = String(n);
    if (s.length < 3) return false;
    for (var i = 1; i < s.length; i++) {
      if (parseInt(s[i]) !== parseInt(s[i - 1]) - 1) return false;
    }
    return true;
  }

  function isRepeatedPattern(n) {
    var s = String(n);
    if (s.length < 4) return false;
    for (var len = 2; len <= s.length / 2; len++) {
      if (s.length % len === 0) {
        var pat = s.substring(0, len);
        var match = true;
        for (var i = len; i < s.length; i += len) {
          if (s.substring(i, i + len) !== pat) { match = false; break; }
        }
        if (match) return true;
      }
    }
    return false;
  }

  function isNearMiss(n) {
    var s = String(n);
    if (s.length < 4) return false;

    // One digit off from repdigit
    var counts = {};
    for (var ci = 0; ci < s.length; ci++) {
      var c = s[ci];
      counts[c] = (counts[c] || 0) + 1;
    }
    var values = Object.values(counts);
    if (values.length === 2 && Math.min.apply(null, values) === 1) return true;

    // One digit off from sequential ascending
    var offBy = 0;
    for (var i = 1; i < s.length; i++) {
      if (parseInt(s[i]) !== parseInt(s[i - 1]) + 1) offBy++;
    }
    if (offBy === 1) return true;

    return false;
  }

  function classifyNumber(n) {
    var categories = [];
    var bestTier = 'C';
    var bestScore = 1;
    var flavourText = '';
    var quote = '';

    function upgradeTier(tier, score, categoryName, categoryLabel) {
      categories.push({ name: categoryName, label: categoryLabel });
      if (TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(bestTier)) {
        bestTier = tier;
      }
      if (score > bestScore) {
        bestScore = score;
      }
    }

    // 1. Power card exact match
    if (POWER_CARDS[n]) {
      var pc = POWER_CARDS[n];
      flavourText = pc.text;
      quote = pc.quote;
      var tier = pc.tier;
      var score = TIERS[tier].score;
      upgradeTier(tier, score, 'power_card', 'Power Card');
    }

    // 2. Perfect patterns
    if (isRepdigit(n)) {
      var len = String(n).length;
      if (len >= 6) upgradeTier('SS', 200, 'repdigit', 'Repdigit');
      else if (len >= 4) upgradeTier('S', 100, 'repdigit', 'Repdigit');
      else upgradeTier('S', 50, 'repdigit', 'Repdigit');
    }

    if (isSequentialAsc(n)) {
      var len2 = String(n).length;
      if (len2 >= 6) upgradeTier('SS', 200, 'sequential', 'Sequential');
      else if (len2 >= 5) upgradeTier('S', 100, 'sequential', 'Sequential');
      else upgradeTier('A', 25, 'sequential', 'Sequential');
    }

    if (isSequentialDesc(n)) {
      var len3 = String(n).length;
      if (len3 >= 6) upgradeTier('SS', 200, 'sequential_desc', 'Countdown');
      else if (len3 >= 5) upgradeTier('S', 100, 'sequential_desc', 'Countdown');
      else upgradeTier('A', 25, 'sequential_desc', 'Countdown');
    }

    if (isPalindrome(n)) {
      var len4 = String(n).length;
      if (len4 >= 6) upgradeTier('SS', 200, 'palindrome', 'Palindrome');
      else if (len4 >= 5) upgradeTier('S', 100, 'palindrome', 'Palindrome');
      else upgradeTier('A', 25, 'palindrome', 'Palindrome');
    }

    if (isRepeatedPattern(n)) {
      var len5 = String(n).length;
      if (len5 >= 6) upgradeTier('S', 100, 'repeated_pattern', 'Repeated Pattern');
      else upgradeTier('A', 25, 'repeated_pattern', 'Repeated Pattern');
    }

    // 3. Near-miss patterns
    if (isNearMiss(n) && !isRepdigit(n) && !isSequentialAsc(n)) {
      upgradeTier('A', 25, 'near_miss', 'Near Miss');
    }

    // 4. Round numbers
    if (n > 0) {
      if (n % 100000 === 0) upgradeTier('SS', 200, 'round', 'Round Number');
      else if (n % 10000 === 0) upgradeTier('S', 50, 'round', 'Round Number');
      else if (n % 1000 === 0) upgradeTier('A', 25, 'round', 'Round Number');
      else if (n % 100 === 0) upgradeTier('B', 5, 'round', 'Round Number');
      else if (n % 10 === 0 && bestTier === 'C') upgradeTier('C', 2, 'round', 'Round Number');
    }

    // 5. Prime numbers
    if (isPrime(n)) {
      if (n < 100) upgradeTier('A', 25, 'prime', 'Prime Number');
      else if (n >= 10000) upgradeTier('A', 10, 'prime', 'Large Prime');
      else upgradeTier('B', 5, 'prime', 'Prime Number');
    }

    if (categories.length === 0) {
      categories.push({ name: 'common', label: 'Common Number' });
    }

    return {
      number: n,
      tier: bestTier,
      tierName: TIERS[bestTier].name,
      score: bestScore,
      categories: categories,
      primaryCategory: categories[0].label,
      flavourText: flavourText,
      quote: quote,
    };
  }

  App.classifyNumber = classifyNumber;
  App.TIERS = TIERS;
  App.TIER_ORDER = TIER_ORDER;
  App.POWER_CARDS = POWER_CARDS;
})();
