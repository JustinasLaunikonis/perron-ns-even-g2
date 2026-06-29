# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2026-06-29

### Changed

- **Even Hub SDK upgraded to 0.0.11** — `@evenrealities/even_hub_sdk` bumped from
  `^0.0.10` to `^0.0.11`, so the bundled SDK now matches the `min_sdk_version`
  declared in `app.json`. No behavioural change; the app uses no 0.0.11-only APIs.

### Removed

- **Dead code** — deleted the unused `src/config.ts` (a hard-coded station list
  left over from before stations were fetched live from NS).

## [0.1.3] - 2026-06-29

### Fixed

- **Favorites and saved journeys now persist** — previously, anything you saved
  to Favorites (e.g. Emmen) or your saved-journey list disappeared after you
  exited the feature in Even Hub and reopened it. Persistence used the browser's
  `localStorage`, which is wiped when the feature container closes. Both
  favorites and saved routes are now stored through the Even Hub SDK's
  host-backed storage (`bridge.getLocalStorage` / `bridge.setLocalStorage`) and
  are restored on startup.

## [0.1.2] - 2026-06-28

### Fixed

- **Narrow-screen overflow** — on small phone widths the "Add" button next to the
  favorites search and the From/To station autocomplete dropdown could spill past
  the card edge. The search field now shrinks correctly and the route dropdown is
  constrained to the card.

## [0.1.1] - 2026-06-28

### Added

- **Departure / arrival time picker** — the time box on the phone planner is now
  interactive. Tap it to choose whether to plan by departure or arrival time,
  set an hour and minute on scroll wheels, step the date forward/back, or reset
  to "now". The selection feeds the NS trip search (`dateTime` /
  `searchForArrival`) and an on-screen journey re-plans automatically.

### Changed

- **Smaller bundle** — only the icons actually used are bundled now (18 of 191),
  instead of inlining the entire icon set. The JS bundle dropped from ~212 kB to
  ~116 kB (gzip ~58 kB → ~42 kB), shrinking the `.ehpk`.

## [0.1.0] - 2026-06-28

### Added

- Initial release: NS (Dutch Railways) journey planner for Even Realities G2.
- Glanceable glasses lens with a clock that drills into live departure boards
  (times, delays, platforms, transfers, cancellations, crowd forecasts).
- Phone planner with From/To station autocomplete, Favorites, and a "Plan again"
  recent-journey history.
- Phone ↔ glasses mirroring with temple-gesture navigation.
- Auto-refresh of open boards every 60s.
- Cloudflare Worker proxy that injects the NS API key server-side, so no secret
  ships in the `.ehpk`.
- Even OS 2.0 styling (design tokens and icon set).
