# Questlog

Questlog is a React-based game tracking application. Discover games, build a personal library, track your progress, and access the app as an installable Progressive Web App (PWA).

## Features

- Browse and search the game catalog.
- Filter games by genre, platform, and library status.
- Sort and paginate game results.
- View individual game details.
- Add games to a personal library and track them as Want to Play, Playing, Completed, or Dropped.
- Create and manage custom games.
- View gaming statistics on the Dashboard.
- Sign up and log in using email/password or Google.
- Access a protected Profile page.
- Install Questlog as a standalone app.
- Use the app offline with previously available game data.
- See online/offline status and notifications when updates are available.
- Responsive layout for desktop and mobile screens.

## Technologies

- React 19
- Vite
- React Router 7
- Firebase Authentication
- JavaScript
- CSS
- Browser localStorage
- Service Workers and Cache Storage
- Web App Manifest
- GitHub Pages

## Installation

Clone the repository:

```bash
git clone https://github.com/SciSoulGalek/React-homework-07.git
cd React-homework-07
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and configure Firebase:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Data and Caching

The game catalog and library use a simulated asynchronous API in `src/services/gamesApi.js`. Game records are stored in browser `localStorage`, allowing saved data and local game-management actions to remain available offline.

The in-memory cache in `src/services/cacheService.js` includes:

- Cache keys for game lists and individual game details.
- A 30-second cache expiration period.
- Reuse of valid cached responses.
- Cache invalidation after game creation, updates, and library changes.
- Cache version checks to prevent outdated requests from repopulating invalidated entries.

Request identifiers prevent older asynchronous responses from overwriting newer results.

## Progressive Web App

Questlog includes a Web App Manifest and a Service Worker.

- The manifest defines the app name, standalone display mode, theme colors, and 192px/512px icons.
- The Service Worker precaches the application shell and built JavaScript/CSS chunks.
- Static assets use a cache-first strategy.
- Eligible same-origin GET API requests use a network-first strategy with cached fallback.
- Versioned caches are cleaned up when a new Service Worker activates.
- An update prompt lets users activate available updates.
- Offline navigation falls back to the cached application shell or a dedicated offline page.
- Online/offline status is displayed in the interface.

Authentication requests and private authentication data are not stored in the Service Worker's runtime caches.

## Project Structure

```text
public/
├── icons/
├── manifest.json
├── offline.html
└── sw.js
scripts/
├── copy-404.js
└── generate-precache.js
src/
├── components/
├── contexts/
├── layouts/
├── pages/
├── services/
│   ├── authService.js
│   ├── cacheService.js
│   └── gamesApi.js
├── firebase.js
├── App.jsx
└── main.jsx
```

## Deployment

The application is deployed to GitHub Pages using GitHub Actions.

Live application: https://scisoulgalek.github.io/React-homework-07/

GitHub Pages uses a generated `404.html` file to support direct navigation and page refreshes on React Router routes.

## Author

Galymzhan Ryszhanov

KBTU — Computer Systems and Software

2026
