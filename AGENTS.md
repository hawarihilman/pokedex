# AI Coding Guidelines – Pokédex

## 1. General Principles

- Follow the existing project architecture and coding conventions.
- Prioritize maintainability, readability, and simplicity.
- Reuse existing components, services, utilities, and patterns whenever possible.
- Do not introduce unnecessary abstractions or dependencies.
- Do not refactor unrelated code while implementing a requested feature.
- Do not make assumptions about requirements. Ask for clarification when necessary.

## 2. Architecture Protection

The application follows a feature-oriented architecture with three main areas:

- `core/`: Application-wide services, models, constants, interceptors, and utilities.
- `features/`: Feature-specific pages, components, and business logic.
- `shared/`: Reusable presentation components and pipes.

### Strict Rules

- Never move, rename, or reorganize existing directories without explicit permission.
- Never modify files belonging to another feature unless explicitly required.
- Never introduce dependencies between unrelated feature modules.
- Feature-specific business logic must remain inside its corresponding feature.
- Shared components must remain generic and reusable.
- Do not place feature-specific logic inside `shared/`.
- Do not place page-specific logic inside `core/`.
- Do not create duplicate services or components when an existing implementation can be reused.
- Do not introduce circular dependencies.

## 3. Cross-Feature and Cross-Layer Changes

Before making changes that affect multiple features or architectural layers:

1. Identify all affected files and dependencies.
2. Explain why changes outside the requested feature are necessary.
3. Present the proposed changes.
4. Wait for approval before modifying protected areas.

The following areas are considered protected:

- `core/`
- `shared/`
- Application routing and navigation configuration.
- Global application configuration.
- Other feature directories.
- Capacitor native projects (`ios/` and `android/`).

Do not modify protected areas unless the task explicitly requires it or approval has been provided.

## 4. Angular Development Standards

- Use Angular standalone components.
- Use TypeScript with strict typing.
- Prefer Angular Signals for local reactive state when appropriate.
- Use `computed()` for derived state.
- Avoid unnecessary subscriptions.
- Use `async` pipes or Angular's recommended reactive patterns where appropriate.
- Use modern Angular template control flow (`@if`, `@for`, `@switch`).
- Prefer `inject()` for dependency injection when consistent with existing code.
- Follow existing component naming and file naming conventions.
- Avoid `any`; use proper interfaces, types, and generics.

## 5. Ionic Development Standards

- Prefer Ionic components for mobile-oriented UI elements.
- Follow Ionic layout and navigation conventions.
- Ensure layouts work on both mobile and desktop.
- Use existing design tokens and CSS variables.
- Avoid duplicating styles across components.
- Ensure interactive elements have appropriate accessibility labels.

## 6. Component Guidelines

- Keep components focused on a single responsibility.
- Separate reusable UI from feature-specific business logic.
- Avoid unnecessarily large components.
- Extract reusable functionality only when there is a clear need.
- Use inputs and outputs appropriately.
- Do not create a new shared component for a one-off use case without a good reason.

## 7. API and Data Handling

- Use the existing API service for external requests.
- Do not make direct HTTP requests from presentation components.
- Keep API DTOs and domain models properly typed.
- Handle loading, empty, and error states.
- Avoid redundant network requests.
- Do not hardcode API responses in production code.

## 8. Styling and UI/UX

- Follow the established Pokédex visual design.
- Maintain consistency in spacing, typography, colors, and component behavior.
- Support both light and dark themes.
- Prioritize responsive and mobile-first layouts.
- Avoid introducing a new CSS framework or styling library without approval.
- Do not modify global styles for a feature-specific visual change unless necessary.

## 9. Dependencies and Configuration

- Do not install, remove, or upgrade npm packages without explicit approval.
- Do not change Angular, Ionic, Capacitor, or TypeScript versions without approval.
- Do not modify `package.json` scripts without approval.
- Do not change TypeScript compiler settings or build configuration without approval.
- Do not modify environment configuration or secrets.
- Never commit API keys, credentials, or other sensitive information.

## 10. Testing and Verification

- Add or update tests when implementing new functionality.
- Do not delete or weaken existing tests just to make a test suite pass.
- Run relevant tests after implementation.
- Run linting and production builds when appropriate.
- Report any tests that could not be executed.
- Never claim that a test passed unless it was actually executed successfully.

## 11. Git and Native Projects

- Do not execute Git commit, push, reset, rebase, or force-push commands without explicit permission.
- Do not modify native iOS or Android configuration when working on ordinary web features.
- Preserve existing Capacitor configuration and native platform projects.
- Do not remove generated or platform-specific configuration files without approval.

## 12. Required Workflow

Before implementing a task:

1. Inspect the existing implementation.
2. Identify the relevant feature and dependencies.
3. Propose a minimal implementation plan.
4. Identify any changes required outside the requested feature.
5. Ask for approval if protected areas or architectural boundaries need to change.

After implementation:

1. Summarize the files changed.
2. Explain important implementation decisions.
3. Report tests and build commands executed.
4. Mention any remaining issues or assumptions.

**Golden Rule: Make the smallest possible change that correctly solves the requested task. Preserve the existing architecture unless explicitly instructed otherwise.**
