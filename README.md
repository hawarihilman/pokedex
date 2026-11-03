# ⚡ Pokédex — Senior Frontend Engineer Application

A production-grade, cross-platform **Pokédex** application engineered with **Angular 22**, **Ionic 9**, and **Capacitor 8**. Built for Pokémon Trainers to browse, filter, inspect, and favorite Pokémon seamlessly across **Desktop Web**, **Mobile Web**, and **Native iOS & Android**.

---

## 📋 Evaluation Criteria & Feature Matrix

| Requirement                         | Implementation Details                                                                                                                                                                                                                                      |  Status  |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| **Infinite Scrolling**              | Built with `<ion-infinite-scroll>` with threshold batching, animated spinning Pokéball loader indicator, and optimistic background hydration. Supports continuous browsing through all 1,300+ Pokémon without limits, plus type-filtered pagination.        | Complete |
| **Detailed Information**            | Deep dive view per Pokémon: physical dimensions (metric & imperial via custom pipes), base experience, abilities (with hidden flag), interactive audio cries player, base stats progress bars with normalized color scales, and alternative sprite gallery. | Complete |
| **High Quality Artwork**            | High-resolution official artwork with lazy loading, skeleton placeholder, graceful fallback, and a one-click **Shiny Form** toggle.                                                                                                                         | Complete |
| **Favourites Management**           | Dedicated Favorites tab, persistent storage via `StorageService` (`localStorage`), real-time reactive counter badge, tactile haptics via `@capacitor/haptics`, search filter, and automatic scroll-to-top on tab switch.                                    | Complete |
| **Type Filtering**                  | Dynamic filter chip carousel supporting all 18 Pokémon types with official type hex gradients, count indicators, and clear/reset actions.                                                                                                                   | Complete |
| **Desktop & Mobile Responsiveness** | Adaptive responsive grid (1-4 columns), desktop header navigation with favorite badge counters, and native mobile bottom tab bar.                                                                                                                           | Complete |
| **Native iOS & Android Support**    | Configured with Capacitor 8 for native compilation, safe-area insets, and haptic feedback.                                                                                                                                                                  | Complete |
| **Figma Prototype**                 | Comprehensive Figma Design System, Tokens, Wireframes, and Flow specification included in [FIGMA_PROTOTYPE_GUIDE.md](./FIGMA_PROTOTYPE_GUIDE.md).                                                                                                           | Complete |
| **Code Quality & Testing**          | Modular Clean Architecture, Angular Signals, typed DTOs, HTTP caching interceptor, and 100% passing Vitest unit test suite.                                                                                                                                 | Complete |

---

## 🏛️ Application Architecture & Design Patterns

### 1. Layered Architecture (Separation of Concerns)

```text
src/app/
├── core/                         # Singleton services, domain models, utilities, interceptors
│   ├── constants/                # Type metadata, stats configurations, generation limits
│   ├── interceptors/             # In-memory HTTP cache interceptor (immutable PokeAPI caching)
│   ├── models/                   # Pure TypeScript domain entities & API DTO contracts
│   ├── services/                 # API client, Signal store, Storage abstraction, Haptics
│   └── utils/                    # URL parsers, formatting helpers, pure math utilities
├── features/                     # Page-level domain slices (lazy-loaded routes)
│   ├── pokemon-list/             # Infinite scroll browser, search, type filter carousel
│   ├── pokemon-detail/           # Hero artwork, shiny toggle, cry audio, segmented tabs
│   ├── pokemon-favorites/        # Saved favorites grid, empty states, quick search
│   └── tabs/                     # Responsive container: mobile bottom bar & desktop header
└── shared/                       # Dumb presentational components & pure pipes
    ├── components/               # PokemonCard, TypeBadge, StatBar, TypeFilter, SkeletonGrid
    └── pipes/                    # PokemonIdPipe (#0025), MeasurementsPipes (m/ft, kg/lbs)
```

### 2. Modern Angular 22 Paradigm

- **Standalone Components**: Clean modularity with zero legacy `NgModule` overhead.
- **Angular Signals**: Fine-grained reactivity using `signal()`, `computed()`, and reactive stores (`PokemonStoreService`).
- **Control Flow**: Modern template syntax (`@if`, `@for`, `@empty`) for high rendering performance.
- **Component Input Binding**: Route parameters directly bound to component inputs via `withComponentInputBinding()`.

### 3. High Performance Caching

Because PokeAPI data is immutable (e.g. Pokémon #25 will never change base stats), an **In-Memory HTTP Cache Interceptor** (`cacheInterceptor`) intercepts all PokeAPI requests. Navigating back and forth between cards and details renders instantly from memory with **0 redundant network calls**.

### 4. Native & Tactile Feedback

Integrated with `@capacitor/haptics` to trigger tactile vibration feedback when trainers favorite Pokémon on iOS and Android devices, with graceful web browser fallback.

---

## 🚀 Getting Started & Local Environment

### Prerequisites

- **Node.js**: `>= 20.0.0` (LTS recommended)
- **npm**: `>= 10.0.0`

### 1. Installation

```bash
git clone <repository-url>
cd pokedex
npm install
```

### 2. Development Server (Desktop & Mobile Web)

```bash
npm start
```

Open your browser and navigate to **`http://localhost:4200`**.

### 3. Run Unit Tests (Vitest)

Unit tests cover utilities, services, stores, pipes, and components:

```bash
# Run unit tests once
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch
```

### 4. Code Quality & Formatting

```bash
# Lint code and verify types
npm run lint

# Auto-fix linting and format with Prettier
npm run lint:fix
```

### 5. Production Build

```bash
npm run build
```

The compiled output is generated in the **`www/`** directory with chunk optimization and lazy-loaded routes.

---

## 📱 Mobile Native Build (iOS & Android via Capacitor)

This application is ready to be packaged and run natively on iOS and Android devices using Capacitor.

### 1. Build the Web Distribution

```bash
npm run build
```

### 2. Add Native Platforms (One-Time Setup)

```bash
# Add iOS platform (requires macOS & Xcode)
npx cap add ios

# Add Android platform (requires Android Studio)
npx cap add android
```

### 3. Sync Web Assets to Native Projects

Whenever code is updated:

```bash
npx cap sync
```

### 4. Open in IDEs

```bash
# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

---

## ☁️ Cloud Deployment Options

The project compiles to static web files in `www/` and can be deployed to any modern cloud hosting service:

### Option A: Vercel

```bash
npm install -g vercel
vercel deploy --prod
# Root Directory: ./
# Output Directory: www
```

### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=www
```

### Option C: GitHub Pages

Configure GitHub Actions to run:

```bash
npm ci
npm run build
# Deploy 'www' directory to gh-pages branch
```

---

## 🧪 Testing Summary

- **Unit Testing**: Vitest with `@angular/core/testing` and `provideHttpClientTesting`.
- **E2E Testing**: Playwright (`playwright.config.ts`, `e2e/app.spec.ts`).
- **Test Results**: **8 test suites passed, 38 unit tests passing (100% success rate)**.
