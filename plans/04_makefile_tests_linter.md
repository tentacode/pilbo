# Spec 04 — Makefile, tests et linter

## Contexte

Outiller le projet : Makefile inspiré de `~/Workspace/Ideeri/portal`, builds plus rapides (ccache), Prettier, ESLint, TypeScript, Jest + RNTL, Maestro (E2E + MCP), audit, GitHub Actions.

> Chaque case est cochée dès que l'étape est faite et vérifiée. Je m'arrête après chaque étape et j'attends ton feu vert.

## Décisions validées

- **Gestionnaire de paquets** : pnpm (comme portal), `nodeLinker: hoisted` seulement si l'autolinking Expo pose problème.
- **ccache** : via `expo-build-properties` dans `app.config.ts` (`ios/` est régénéré).
- **ESLint** : `eslint-config-expo` (flat config) + `eslint-config-prettier`, pas de règles d'architecture.
- **Tests unitaires** : Jest + `jest-expo` + RNTL, fichiers `.spec.ts(x)` au même niveau que le fichier testé.
- **E2E** : Maestro, flows YAML dans `e2e/` à la racine, + MCP Maestro dans `.mcp.json`.
- **Audit** : `pnpm audit` strict, failles non corrigeables ignorées une par une (`audit.ignore` + commentaire).
- **CI** (dépôt public) : job ubuntu (push `main` + PR). Maestro en local uniquement (build macOS trop long en CI).
- **Local / CI** : `--write` / `--fix` en local, `--check` / `--max-warnings=0` en CI.

## Étape 0 — Plan

- [x] Écrire le plan dans `./plans/04_makefile_tests_linter.md`.

## Étape 1 — Passage à pnpm

- [x] Supprimer `package-lock.json` et `node_modules`, `pnpm install`, créer `pnpm-workspace.yaml`.
- [x] Ajouter `packageManager` dans `package.json`.
- [x] `npx expo-doctor` passe.
- [x] Build simulateur OK (vérifie l'autolinking).

## Étape 2 — Makefile de base et builds

- [x] `Makefile` : `help`, couleurs, `-include .env`.
- [x] `install` (vérifie que ccache est installé), `start`, `doctor`, `clean` (`expo prebuild --clean`).
- [x] `build-simulator`, `build-device` (Debug, `DEVICE_ID`), `build-release` (Release autonome, `DEVICE_ID`).
- [x] Tu vérifies `make build-device` et `make build-release` sur l'iPhone.

## Étape 3 — Build plus rapide

- [x] Installer `expo-build-properties`, activer ccache dans `app.config.ts`.
- [x] Vérifier que les binaires React Native précompilés sont actifs.
- [ ] Après `make clean` + deux builds, `ccache -s` montre des cache hits. Comparaison des temps de build. **Reporté** : ccache est branché (CC/CXX dans les Pods) mais Xcode 26.5 ne l’appelle pas (0 lecture). Build sans ccache : ~4 min 30.

## Étape 4 — Prettier

- [x] Installer Prettier + config (`.prettierrc`, `.prettierignore`), scripts `prettier` et `prettier:check`.
- [x] `make prettier`, formatage initial du code.
- [x] `.vscode/settings.json` (format on save, inspiré de portal) et `.vscode/extensions.json` (Prettier, ESLint).

## Étape 5 — ESLint

- [x] Installer ESLint, `eslint-config-expo`, `eslint-config-prettier`, `eslint.config.js`.
- [x] `make lint`, corriger les erreurs existantes.

## Étape 6 — TypeScript

- [x] Script `typescript` (`tsc --noEmit`), `make typescript` passe.

## Étape 7 — Tests unitaires

- [x] Installer Jest, `jest-expo`, `@testing-library/react-native`, config Jest.
- [x] Test `true -> true`.
- [x] Test RNTL d'un composant du design system (rendu + role/label d'accessibilité), à côté du composant.
- [x] `make test-unit` passe.

## Étape 8 — Audit

- [x] `make audit` (`pnpm audit`).
- [x] Failles non corrigeables listées dans `audit.ignore` avec un commentaire, à valider ensemble.

## Étape 9 — Maestro

- [x] Installer Maestro (CLI), dossier `e2e/`.
- [x] Flow pour l'écran Pilulier : nombre de prises et contenu (simple).
- [x] `make test-e2e` passe sur le simulateur.
- [ ] MCP Maestro (`maestro mcp`) déclaré dans `.mcp.json`, tu vérifies qu'il est disponible. **Non testé, reporté à plus tard**

## Étape 10 — `make tests`

- [x] Chaîne lint → prettier → typescript → test-unit → audit (sans Maestro), message vert par étape, `say` succès / échec (comme portal).
- [x] Tu vérifies (y compris la voix en cas d'échec).

## Étape 11 — GitHub Actions

- [x] `.github/workflows/ci.yaml`, job ubuntu : lint (`--max-warnings=0`), prettier check, typescript, jest, audit. Push `main` + PR.
- [x] ~~Job macOS : build simulateur + Maestro~~ supprimé : build CI trop long (> 23 min), Maestro reste en local uniquement (`make test-e2e` avant de merger).
- [x] Tu vérifies sur une PR que les deux jobs passent.

## Étape 12 — Fin

- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` (commandes `make`), après ta validation seulement.
