# Makefile, tests et linter

On veut avoir un makefile pour faciliter le lancement des builds et des tests. La structure du Makefile doit être inspirée d'un autre projet `~/Workspace/Ideeri/portal/Makefile` (aide `make help`, couleurs, voix `say`).

On s'inspirera beaucoup du projet "portal", mais des adaptations seront nécessaires comme c'est un projet Next.js.

Ce qu'on veut :

- [ ] Passer de npm à pnpm (comme portal) : supprimer `package-lock.json`, générer `pnpm-lock.yaml`, créer `pnpm-workspace.yaml`. Si l'autolinking Expo pose problème, utiliser `nodeLinker: hoisted`.
- [ ] Un build plus performant :
  - ccache rendu permanent via `expo-build-properties` dans `app.config.ts` (le dossier `ios/` est régénéré, donc pas de modif directe du Podfile).
  - Vérifier que les binaires React Native précompilés sont actifs.
  - `make install` vérifie que ccache est installé.
- [ ] Le Makefile charge le `.env` (`-include .env`) et propose :
  - `make help` : aide.
  - `make install` : installation initiale.
  - `make start` : lance Metro (Fast Refresh, évite de rebuilder pour du JS).
  - `make build-simulator` : build pour le simulateur.
  - `make build-device` : build Debug sur l'iPhone (utilise `DEVICE_ID` du `.env`, déjà renseigné).
  - `make build-release` : build Release autonome sur l'iPhone (sans Metro), pour un usage réel au quotidien.
  - `make clean` : `expo prebuild --clean` pour un build propre.
  - `make doctor` : `npx expo-doctor`.
- [ ] Installer Prettier, `make prettier` (écrit les corrections). Ajouter la config VS Code (`.vscode/settings.json` avec format on save, inspiré de portal) et `.vscode/extensions.json` (Prettier, ESLint).
- [ ] Installer ESLint (`eslint-config-expo` en flat config + `eslint-config-prettier`), `make lint` (avec `--fix`). Pas de règles d'architecture/métier.
- [ ] Ajouter un test TypeScript : `make typescript` (`tsc --noEmit`).
- [ ] Tests unitaires avec Jest + `jest-expo` + React Native Testing Library : `make test-unit`. Les tests sont placés au même niveau que le fichier testé, suffixe `.spec.ts(x)` (ex. `src/features/pillbox/PillboxScreen.spec.tsx`, voir `docs/architecture.md`).
  - Un test d'assertion `true -> true` pour vérifier l'installation.
  - Un test RNTL d'un composant du design system (rendu + role/label d'accessibilité), qui servira de modèle.
- [ ] Ajouter `make audit` qui lance `pnpm audit` (échoue dès la moindre faille). Les failles non corrigeables sont ignorées une par une via `audit.ignore` dans `pnpm-workspace.yaml`, avec un commentaire expliquant pourquoi (comme portal).
- [ ] Tests end to end avec Maestro : `make test-e2e` (nécessite un simulateur). Les flows YAML sont dans le dossier `e2e/` à la racine. Créer un test pour l'écran "pill box" (vérifier le nombre et le contenu du pilulier, de manière simple, pas besoin de tout tester).
- [ ] Installer le MCP Maestro (`maestro mcp`) déclaré dans `.mcp.json`, pour aider au dev et au debug.
- [ ] Faire une commande `make tests` comme dans le projet portal : lint, prettier, TypeScript, tests unitaires et audit (sans Maestro) en chaîne, avec un message vert par étape, puis `say -v 'good news' 'Success'` ou `say -v 'bad news' 'Tests Failed'`.
- [ ] Créer un fichier GitHub Action, s'inspirer du projet portal (dépôt public, runners gratuits) :
  - Job ubuntu : lint (`--max-warnings=0`), prettier check, TypeScript, Jest, audit. Déclenché sur push vers `main` et sur PR.
  - ~~Job macOS : build simulateur + tests Maestro.~~ Abandonné : trop long en CI, Maestro reste en local uniquement.
