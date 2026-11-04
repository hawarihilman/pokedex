# ⚡ Pokédex

A modern, cross-platform **Pokédex application** built with **Angular 22**, **Ionic 9**, and **Capacitor 8**.

Designed for Pokémon Trainers to explore Pokémon data through a responsive, mobile-first interface. The application supports desktop browsers, mobile browsers, and native mobile development through Capacitor.

## ✨ Features

- Browse Pokémon with a responsive, mobile-first interface.
- Search and filter Pokémon.
- View detailed Pokémon information.
- Save favorite Pokémon.
- Support light and dark themes.
- Responsive layouts for desktop and mobile.
- Native mobile integration through Capacitor.

> Note: The feature list should reflect the functionality implemented in the current version of the application.

## 🛠️ Tech Stack

| Technology  | Purpose                                  |
| ----------- | ---------------------------------------- |
| Angular 22  | Application framework                    |
| Ionic 9     | UI components and mobile-first interface |
| Capacitor 8 | Native iOS and Android integration       |
| TypeScript  | Application development                  |
| RxJS        | Reactive programming                     |
| Ionicons 8  | Icon library                             |
| Vitest      | Unit testing                             |
| Playwright  | End-to-end testing                       |

## 🏛️ Application Architecture

The application follows a feature-oriented structure with separation between application-wide logic, feature pages, and reusable UI components.

```text
src/
└── app/
    ├── core/                     # Application-wide services, models, and utilities
    │   ├── constants/            # Shared constants and configuration
    │   ├── interceptors/         # HTTP interceptors
    │   ├── models/               # Domain models and API contracts
    │   ├── services/             # API, state, and platform services
    │   └── utils/                # Reusable utility functions
    │
    ├── features/                 # Feature-specific pages and logic
    │   ├── pokemon-list/         # Pokémon browsing, search, and filtering
    │   ├── pokemon-detail/       # Pokémon detail information
    │   ├── pokemon-favorites/    # Favorite Pokémon
    │   └── tabs/                 # Responsive application navigation
    │
    └── shared/                   # Reusable presentation components
        ├── components/           # Pokémon cards, badges, and UI components
        └── pipes/                # Reusable formatting pipes
```

### Architecture Principles

- **Separation of Concerns:** Application-wide logic is separated from feature-specific functionality.
- **Feature-Based Organization:** Related pages and components are grouped by domain.
- **Reusable Components:** Shared UI components help maintain consistent presentation.
- **Standalone Components:** Angular standalone APIs are used to keep the application modular.
- **Responsive Design:** The interface is designed with mobile usage as the primary consideration.

## 🚀 Getting Started

### Prerequisites

- **Node.js:** A version compatible with Angular 22.
- **npm:** Included with Node.js.
- **Git:** Required to clone the repository.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pokedex
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The application runs using Angular's development server.

Open the following URL in your browser:

```text
http://localhost:4200
```

Alternatively, you can use the Ionic CLI:

```bash
npx ionic serve
```

## 🧪 Testing

The project is configured with unit testing and end-to-end testing tools.

### Unit Tests

Run unit tests once:

```bash
npm run test:unit
```

Run unit tests in watch mode:

```bash
npm run test:unit:watch
```

### End-to-End Tests

Run Playwright tests:

```bash
npm run test:e2e
```

### Run All Tests

```bash
npm test
```

The `npm test` command runs unit tests followed by end-to-end tests.

## 🧹 Code Quality

The project includes ESLint, TypeScript checking for the end-to-end project, and Prettier.

### Check Code Quality

```bash
npm run lint
```

### Automatically Fix Linting and Formatting Issues

```bash
npm run lint:fix
```

## 📦 Production Build

Build the application for production:

```bash
npm run build
```

Angular generates the production build in the configured output directory.

## 📱 Native Mobile Development

The application uses Capacitor to integrate the web application with native iOS and Android projects.

### Build the Web Application

```bash
npm run build
```

### Synchronize Native Projects

After making changes to the web application, rebuild and synchronize the native projects:

```bash
npm run build
npx cap sync
```

### Open Native Projects

```bash
# Open the iOS project in Xcode
npx cap open ios
```

For Android, first install and add the Android platform:

```bash
npm install @capacitor/android
npx cap add android
```

Then you can open it in Android Studio:

```bash
npx cap open android
```

### Platform Requirements

| Platform | Requirements                   |
| -------- | ------------------------------ |
| iOS      | macOS and Xcode                |
| Android  | Android Studio and Android SDK |

## 🌐 Data Source

Pokémon information is retrieved from [PokéAPI](https://pokeapi.co/).

PokéAPI provides Pokémon data, including species information, types, stats, sprites, and artwork.

## ☁️ Deployment

The application can be deployed as a web application to a static hosting provider after running the production build.

Potential hosting options include:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

Native iOS and Android applications can be built and distributed through their respective platform workflows.

## 📄 License

This project was created for a technical assessment.
