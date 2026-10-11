# Spec 01 — Setup React Native + compte Apple

## Contexte

Repo vide (README, CLAUDE.md, specs). Objectif : un projet Expo prêt, un "Hello world" qui tourne dans le simulateur, puis sur l'iPhone perso avec un Apple ID gratuit dédié.

Outils déjà présents : Node 24, npm 11, Xcode 26.5, CocoaPods, Watchman, simulateurs iPhone 15.

Décisions validées :

- "Hello world" en dur, temporaire (i18n viendra dans une spec dédiée).
- `ios/` généré par Expo (CNG), ignoré par git.

## Étape 1 — Créer le projet (moi)

- [x] `npx create-expo-app@latest` (template `default` = TypeScript + Expo Router) dans un dossier temporaire du scratchpad.
- [x] Lancer `npm run reset-project` pour retirer l'exemple → projet minimal.
- [x] Supprimer le dossier `app-example` généré.
- [x] Copier le résultat à la racine du repo (sans écraser README / CLAUDE.md / specs).

## Étape 2 — Configurer (moi)

- [x] `app.json` : `name: "Pilbo"`, `slug: "pilbo"`, `scheme: "pilbo"`, `ios.bundleIdentifier: "com.tentacode.pilbo"`, retirer les blocs `android` / `web`.
- [x] `tsconfig.json` : vérifier `"strict": true`.
- [x] `.gitignore` : ajouter `/ios` et `/android`.
- [x] `package.json` : retirer les scripts `android` / `web`.
- [x] `app/index.tsx` : un écran minimal, "Hello world" centré.

## Étape 3 — Simulateur (moi)

- [x] `npx expo run:ios` → génère `ios/`, installe les pods, build, lance le simulateur.
- [x] Vérifier que "Hello world" s'affiche.

## Étape 4 — Compte Apple (toi, pas à pas)

- [x] Créer un nouvel Apple ID sur account.apple.com.
- [x] Xcode → Settings → Accounts → `+` → Apple ID → se connecter.
- [x] Ouvrir `ios/Pilbo.xcworkspace` → target Pilbo → Signing & Capabilities → cocher "Automatically manage signing" → Team = "(Personal Team)".

## Étape 5 — iPhone (toi + moi)

- [x] Brancher l'iPhone en USB, "Faire confiance à cet ordinateur".
- [x] iPhone : Réglages → Confidentialité et sécurité → Mode développeur → activer (redémarrage).
- [x] `npx expo run:ios --device` (Debug, Metro doit tourner, même Wi-Fi).
- [x] iPhone : Réglages → Général → VPN et gestion de l'appareil → faire confiance au profil développeur.
- [x] Relancer l'app → "Hello world".

## Étape 6 — Documentation (moi)

- [x] Créer `docs/ios_build.md` (en français, court) :
  - Prérequis.
  - Simulateur : `npx expo run:ios`.
  - iPhone Debug : `npx expo run:ios --device`.
  - iPhone Release (sans Metro) : `npx expo run:ios --device --configuration Release`.
  - Rappel : expiration tous les 7 jours → relancer la commande.
  - Problèmes fréquents (signing, profil non approuvé, mode développeur).

## Hors scope

ESLint, Prettier, Jest, SQLite, i18n, Android, widget.

## Vérification

- [x] Simulateur : l'app s'affiche avec "Hello world".
- [x] iPhone : build Debug OK, puis build Release qui s'ouvre sans Metro.
- [x] `npx tsc --noEmit` passe.
- [x] Aucune opération git de ma part.
