# One in a Million

A gacha-style number game. Pull random numbers between 0 and 1,000,000 from a slot-machine spinner. Significant numbers become collectible power cards with unique flavour text and visual flair.

## How to Play

Open `index.html` in a browser. No build step, no server, no dependencies.

- **PULL** button or **Space** to pull a number
- Numbers are classified into tiers: C (Common), B (Uncommon), A (Rare), S (Super Rare), SS (Ultra Rare), SSS (Legendary)
- Collect power cards — famous dates, meme numbers, primes, palindromes, round numbers, and more
- Tap a card in your collection to view it again
- Heart button to favourite cards
- Sort and filter your collection by score, tier, number, or date
- Press **R** to open dev mode and force a specific number

## Tiers

| Tier | Name | Colour |
|------|------|--------|
| C | Common | Grey |
| B | Uncommon | Green |
| A | Rare | Cyan |
| S | Super Rare | Purple |
| SS | Ultra Rare | Gold |
| SSS | Legendary | Rainbow |

## Features

- ~80 hand-written power cards with flavour text and quotes
- Pattern detection: repdigits, palindromes, sequences, repeated patterns, near-misses
- Primality testing and round number classification
- Procedural audio via Web Audio API (no sound files)
- Slot-machine spinner with physics-based deceleration
- Pity system after 15+ consecutive common pulls
- Persistent collection via localStorage
- Dark neon cyberpunk aesthetic, mobile-first

## Tech

Vanilla HTML/CSS/JS. No frameworks, no build tools, no external dependencies.
