# Spec 23 — Compte Apple payant et TestFlight

## Contexte

Passage au compte Apple Developer payant (build valable 1 an, notifications Time Sensitive), deux variantes installables côte à côte (« Pilbo » / « Pilbo Dev »), puis distribution sur TestFlight avec fastlane. Spec et décisions : `specs/23_paid_account_and_testflight.md`.

À lire avant de commencer :

- `CLAUDE.md` (contraintes iOS, commandes), `docs/architecture.md`, `docs/database.md`.
- Code existant :
  - Config Expo : `app.config.ts` (`bundleIdentifier`, `appleTeamId`, plugins), `plugins/withoutPushEntitlement.js` (à garder avant `expo-notifications`).
  - Makefile : cibles `install`, `clean`, `build-simulator`, `build-device`, `build-release`.
  - Mode debug actuel : `src/config/debug.ts` (`IS_DEBUG_MODE`), `src/app/_layout.tsx` (`setupFirstLaunch`), `src/features/onboarding/utils/setupFirstLaunch.ts` (+ spec), `.env.dist`.
  - Notifications : `src/features/notifications/notifications.ts` (`resetReminders`, `interruptionLevel: "active"`), `utils/planReminders.ts` (`PlannedReminder`), `utils/planLowStockAlerts.ts`.
  - Version affichée : `src/features/settings/components/VersionRow.tsx` (rien à changer).
  - Migrations : `src/shared/database/migrations/` (`0000` à `0004`, `migrations.js`, `meta/`).
  - E2E : `e2e/*.yaml` (`appId: com.tentacode.pilbo`).
  - Docs qui citent `EXPO_PUBLIC_DEBUG_MODE` : `docs/architecture.md`, `docs/database.md`, `store/screenshots/README.md`, `CLAUDE.md`.

# Partie 1 — En local

## Étape 1 — Inscription (toi)

- [x] Inscription à l'Apple Developer Program en tant que particulier, avec l'Apple ID actuel (developer.apple.com/programs/enroll ou app Apple Developer).
- [x] Validation reçue d'Apple (quelques heures à 48 h).

Je m'arrête et j'attends ta validation.

## Étape 2 — Équipe de signature (toi, guidé)

- [x] Récupérer le Team ID (developer.apple.com/account > « Membership details ») et remplacer `APPLE_TEAM_ID` dans `.env`.
- [x] Xcode > Settings > Accounts : la nouvelle équipe apparaît (sans « Personal Team »).

## Étape 3 — Variantes dans la config

- `app.config.ts` :
  - [x] Lire `APP_VARIANT` (`dev` / `prod`, défaut `prod`) ; valeur inconnue → erreur explicite.
  - [x] Dev : bundle ID `<bundle ID>.dev`, nom « Pilbo Dev », icône `assets/images/icon-dev.png`. Prod : valeurs actuelles.
  - [x] Bundle ID de base dans une constante, pour basculer facilement sur le repli (`com.tentacode.pilbo.app`, voir spec).
  - [x] Exposer la variante à l'app : `extra.appVariant`, lue via `expo-constants`.
  - [x] Lire `BUILD_NUMBER` (optionnel) → `ios.buildNumber` (utilisé par la lane, Partie 2).
- Remplacer `EXPO_PUBLIC_DEBUG_MODE` :
  - [x] `src/config/debug.ts` → `src/config/appVariant.ts` (`IS_DEV_VARIANT`), à partir de `extra.appVariant`.
  - [x] `_layout.tsx` : `setupFirstLaunch(database, { isDebugMode: IS_DEV_VARIANT, … })` (renommer l'option en `isDevVariant` si plus clair, tests compris).
  - [x] Retirer `EXPO_PUBLIC_DEBUG_MODE` de `.env.dist` ; ajouter un commentaire sur `APP_VARIANT` (fixé par le Makefile, pas dans `.env`).
  - [x] Mettre à jour les docs qui le citent (liste dans « À lire »).
- [x] Tests Jest : prod ne seed jamais, dev seed et saute l'onboarding au premier lancement.

## Étape 4 — Icône « Pilbo Dev »

- [x] `assets/icon/icon-dev.svg` à partir de `assets/icon/icon.svg` (distincte au premier coup d'œil : bandeau « DEV » ou fond différent).
- [x] Export en `assets/images/icon-dev.png` (1024 × 1024, sans transparence).
- [x] Tu valides le rendu visuel.

## Étape 5 — Makefile

- [x] `build-simulator` et `build-device` : `APP_VARIANT=dev`, `expo prebuild --platform ios` puis `expo run:ios` (Debug).
- [x] `build-release` : `APP_VARIANT=prod`, `expo prebuild --platform ios` puis Release sur l'iPhone.
- [x] `clean` : préciser la variante (dev par défaut) ; `make help` à jour.
- [x] `test-e2e` inchangé ; `appId` de tous les flows `e2e/*.yaml` → bundle ID de « Pilbo Dev ».

## Étape 6 — Notifications Time Sensitive

- [x] Entitlement `com.apple.developer.usernotifications.time-sensitive` : `ios.entitlements` dans `app.config.ts` (survit à `make clean`). `withoutPushEntitlement` reste.
- [x] `PlannedReminder` : champ `interruptionLevel` (`"timeSensitive"` pour `planReminders`, `"active"` pour `planLowStockAlerts`), utilisé par `resetReminders`.
- [x] Tests Jest des deux planificateurs mis à jour.

## Étape 7 — Vérification sur l'iPhone (toi)

- [x] `make clean`, `make build-device` : « Pilbo Dev » se lance avec les données de test (`make start` lancé).
  - [x] (Non nécessaire : même Team ID, bundle ID conservé.) Si Xcode refuse `com.tentacode.pilbo` (« not available ») : passer au bundle ID de repli, rebuild.
  - [x] Si iOS refuse l'installation par-dessus l'ancienne app : supprimer l'app (données de test, sans risque).
- [x] `make build-release` : « Pilbo » se lance sans données de test, avec l'onboarding.
- [x] Les deux apps installées côte à côte, données et notifications séparées.
- [ ] Les notifications arrivent ; un rappel traverse « Ne pas déranger » ; une alerte de stock bas ne le traverse pas.
- [x] Date d'expiration du profil à 1 an (25/10/2027 pour les deux variantes) (Réglages > Général > VPN et gestion de l'appareil, ou Xcode).
- [x] `make test-e2e` passe sur le simulateur (variante dev).

## Étape 8 — Docs de la Partie 1

- [x] Proposer la mise à jour de `CLAUDE.md` (contraintes du compte gratuit retirées, variantes, cibles du Makefile, `APP_VARIANT`) : après ta validation seulement.

# Partie 2 — TestFlight

## Étape 9 — Migration unique

- [x] Supprimer `src/shared/database/migrations/` (SQL, `meta/`, `migrations.js`) et régénérer avec `make db-generate` → une seule `0000`.
- [x] Jest passe (bases en mémoire via `testDatabase.ts`).
- [x] `docs/database.md` : retirer les notes « base à vider », section **Schéma** à jour, ajouter la règle des migrations (voir spec, « Décisions > Migrations »).
- [x] Mettre à jour la mémoire « no-migration » avec la nouvelle règle.
- [x] Réinstaller les deux variantes sur l'iPhone une dernière fois (supprimer puis `make build-device` / `make build-release`).

## Étape 10 — Build distribuable

- `app.config.ts` :
  - [x] `ios.infoPlist.ITSAppUsesNonExemptEncryption: false`.
  - [x] `ios.privacyManifests` : lister les « API à raison déclarée » utilisées par l'app et ses dépendances (vérifier dans `node_modules` les `PrivacyInfo.xcprivacy` des modules Expo / React Native et la doc Expo), avec les codes de raison.
- [x] `make clean` puis `make build-release` : l'app se lance toujours.

## Étape 11 — Clé API et App Store Connect (toi, guidé)

- Clé API :
  - [x] App Store Connect > Utilisateurs et accès > Intégrations > Clés : clé avec le rôle « App Manager ».
  - [x] `.p8` rangé hors du repo (ex. `~/.appstoreconnect/`), `.env` : `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_PATH` ; mêmes clés vides dans `.env.dist`.
- Création de l'app (appstoreconnect.apple.com > Apps > « + ») :
  - [x] Plateforme iOS, nom « Pilbo », langue principale anglais, bundle ID de « Pilbo », SKU `pilbo`, accès complet.
  - [x] (Nom disponible.) Si le nom est déjà pris : je m'arrête et je te demande.
- [x] Groupe externe « Pilbo Externe » créé dans l'onglet TestFlight, lien public activé (section « Tests externes » visible seulement après le premier build : reporté à l'étape 13).

## Étape 12 — fastlane

- [x] `Gemfile` (fastlane) + `Gemfile.lock` à la racine ; `fastlane/Appfile`, `fastlane/Fastfile` ; `.gitignore` : sorties de build fastlane (`fastlane/report.xml`, `*.ipa`, `*.dSYM.zip`, etc.).
- [x] `make install` : vérifie le Ruby Homebrew (message `brew install ruby` sinon, comme pour ccache), puis `bundle install`.
- [x] Textes dans le repo (ton de l'app, voir `CLAUDE.md`) :
  - [x] `fastlane/what_to_test/fr-FR.txt` et `en-US.txt`.
  - [x] Infos de test : description de la bêta FR/EN, e-mail de contact (dossier `fastlane/beta_app_info/` ou équivalent).
- Lane `beta` (nom `testflight` déjà pris par une action fastlane ; ordre dans la spec, « Décisions > fastlane et TestFlight ») :
  - [x] Clé API via `app_store_connect_api_key` (variables de `.env`).
  - [x] `latest_testflight_build_number` + 1 (1 s'il n'y a aucun build).
  - [x] `APP_VARIANT=prod BUILD_NUMBER=… pnpm expo prebuild --clean --platform ios`.
  - [x] `build_app` (workspace `ios/`, scheme Pilbo, export `app-store`, `xcargs: "-allowProvisioningUpdates"` + authentification par la clé API).
  - [x] `upload_to_testflight` : « Quoi tester » FR/EN, infos de test, `distribute_external` vers « Pilbo Externe » (ignoré avec un avertissement tant que le groupe n'existe pas).
- [x] `make testflight` lance la lane.
- [x] `make version-bump TYPE=major|minor|patch` : met à jour `version` dans `app.config.ts` ; sans `TYPE` ou valeur inconnue, s'arrête avec un message d'aide. Testé sur les trois types.

## Étape 13 — Premier envoi et vérification (toi)

- [x] `make testflight` : build visible dans App Store Connect.
- [ ] Toi ajouté en testeur interne ; build installé sur l'iPhone par l'app TestFlight (remplace « Pilbo » installé par Xcode si besoin).
- [ ] Ajouter quelques données, puis second `make testflight` (numéro de build +1) : la mise à jour conserve les données.
- [ ] Revue bêta externe soumise ; lien public fonctionnel une fois acceptée.

## Étape 14 — Fin

- [x] `make tests` passe.
- [x] Proposer une mise à jour de `CLAUDE.md` (règle des migrations, `make testflight`, `make version-bump`, fastlane, clé API) et des docs : après ta validation seulement.
