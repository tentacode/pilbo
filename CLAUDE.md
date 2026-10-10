# Directions for Claude

## Mise à jour de ce fichier CLAUDE.md

Si besoin, mettre à jour ce fichier pour les prochains prompt, mais ne le faire qu'après ma validation et pas tout seul.

## Project description

Project description is in `./README.md`. This is a global description and you don't have to take it all into account, as the project will be made step by step. It is still good to know what will be there in the future.

## Specs

Specs are in `./specs`.

Sometimes you will be asked to work on a specific spec, you must not be out of the spec scope unless you have permission. If you feel it's necessary to refine the scope you can always ask.

Specs are prefixed in numeric order, ex `./specs/01_setup_react_native.md`.

Once the plan is validated, don't take any actions yet, you need to create the plan in `./plans/01_setup_react_native.md`. Each step has a checkbox to know what had been done and what still needs to be done. You have to maintain the checkboxes as you go: tick each one as soon as the step is done and verified, before moving to the next one, never all at once at the end.

### Out of scope

* Everything that is not in the spec.
* Android is absolutely not a thing for now.
* Some advanced features that can be in the design but are not for a proof of concept, example: the pill design customizer.
* iOS widget (Swift/WidgetKit + App Group, requires a paid Apple Developer account): will be handled later.

Basically we are looking for a proof of concept, in doubt ask if it's in the scope.

## Stack

* React Native with **Expo**, using **development builds** (not Expo Go). iOS only.
* **TypeScript** in strict mode.
* Navigation: **Expo Router**.
* Storage: **expo-sqlite + Drizzle ORM** (allows migrations in the future).
* Data is **100% local**: no backend, no user account.
* i18n: **i18next + react-i18next + expo-localization** (French and English).
* Notifications: **expo-notifications** (scheduled local notifications).
* Tests: **Jest + React Native Testing Library**.
* Code quality: **ESLint + Prettier**.
* The app is tested on a personal iPhone through Xcode, with a free Apple account for now.

### iOS constraints to keep in mind

* Max 64 pending local notifications at the same time: use daily repeating reminders (1 slot each), rescheduled when an intake is validated.
* Silent mode: no sound, but vibration if "Play Haptics in Silent Mode" is enabled.
* Free Apple account: the installed app expires every 7 days (reinstall from Xcode).

## Code conventions

Conventions will be updated with the project advancement.

Conventions :

* Never run any git operation (commit, add, branch, stash, push, etc.), only reading is allowed (log, diff, show, status).
* Code (symbol names, file names) is written in English.
* Never hardcode UI text, always use i18n.
* Keep it concise and modular.
* Always favor small components.
* Prefer keeping the design and the logic separated.
* Never write code comments unless they are vital for logic or edge case comprehension.
* Never abbreviate symbol names (variables, components name, props, etc.).
* Accessibility: the app must be conform to the WCAG AA, a special effort must be dedicated to achieve this, I will test with screen readers and assistive technologies to make sure it's valid. Concretely:
  * Proper `accessibilityLabel`, `accessibilityRole` and `accessibilityState` on interactive elements.
  * Respect the iOS text size setting (Dynamic Type) without breaking layouts.
  * AA color contrast.
  * Reduce animations only when the iOS "Reduce Motion" setting is enabled.
  * Touch targets of at least 44pt.
* Always use tokens for font size/weight, colors, sizing, margins, etc.
* Components can go into the design-system or the features directory.

## Plans and answers

Every plans and answers must be written in French (even when I ask in English).

Messages must be clear, concise (avoid lengthy paragraphs), organized in sections, step by step if necessary. I have ADHD so it needs to be short and clear.

Always ask questions if something needs clarifications.
