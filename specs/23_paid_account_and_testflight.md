# Compte Apple payant et TestFlight

On passe au compte Apple Developer payant pour profiter de ses avantages en local (build valable 1 an, notifications Time Sensitive), puis on distribue l'app à des testeurs avec TestFlight.

Le widget (spec 24) et la publication sur l'App Store (spec 25) viennent après.

## Partie 1 : en local

### 1. Inscription

- S'inscrire à l'Apple Developer Program (developer.apple.com/programs/enroll, ou l'app Apple Developer sur l'iPhone), en tant que particulier, avec l'Apple ID actuel.
- La validation par Apple peut prendre de quelques heures à 48 h.
- Abonnement annuel : sans renouvellement, l'app installée ne se lance plus et on revient aux limites du compte gratuit.

### 2. Équipe de signature

- Le compte payant crée une **nouvelle équipe**, avec un Team ID différent de la « Personal Team ».
- Récupérer le Team ID (developer.apple.com/account, « Membership details ») et remplacer `APPLE_TEAM_ID` dans `.env`.
- Xcode > Settings > Accounts : vérifier que la nouvelle équipe apparaît (sans « Personal Team »).
- Signature automatique : Xcode enregistre l'iPhone et crée les profils (valables 1 an).

### 3. Identifiant de l'app et données existantes

- À vérifier : `com.tentacode.pilbo` a été enregistré par la Personal Team. La nouvelle équipe ne pourra peut-être pas le réutiliser (« not available »). Dans ce cas, on passe à `com.tentacode.pilbo.app` (et `com.tentacode.pilbo.app.dev` pour la variante dev).
- iOS refuse en général d'installer par-dessus une app signée par une autre équipe : il faudrait alors **supprimer l'app, et donc ses données**.
- Pas de problème pour l'instant : l'iPhone n'a que des données de test, on peut supprimer l'app sans risque.

### 4. Variantes de l'app

- Deux apps installables côte à côte sur l'iPhone :
  - « Pilbo » (`com.tentacode.pilbo`) : vraies données.
  - « Pilbo Dev » (`com.tentacode.pilbo.dev`) : données de test.
- La section debug (10 taps sur « Version ») reste dans les deux variantes, y compris sur TestFlight et l'App Store.
- Choix de la variante par la variable d'environnement `APP_VARIANT` (`dev` ou `prod`) lue dans `app.config.ts` : bundle ID, nom affiché, icône distincte.
- `APP_VARIANT=dev` remplace `EXPO_PUBLIC_DEBUG_MODE` : seed des données de test et onboarding sauté au premier lancement. « Pilbo » ne charge jamais de données de test.
- Chaque variante a sa propre base et ses propres notifications.
- Cibles du `Makefile` :
  - `make build-simulator` et `make build-device` : « Pilbo Dev » en Debug (nécessite `make start` pour se lancer).
  - `make build-release` : « Pilbo » en Release.
  - Pas d'autre combinaison.
- Flows e2e Maestro : `appId` → bundle ID de « Pilbo Dev ».

### 5. Notifications Time Sensitive

- Capability et entitlement `com.apple.developer.usernotifications.time-sensitive`, déclarés dans la config Expo (survit à `make clean`).
- Les rappels de prise passent en `interruptionLevel: "timeSensitive"` : ils traversent les modes de concentration et restent plus longtemps sur l'écran verrouillé.
- Les alertes de stock bas restent en `interruptionLevel: "active"`.
- `plugins/withoutPushEntitlement.js` reste (on n'utilise pas les notifications push).

### 6. Vérification

- `make clean`, puis `make build-device` (« Pilbo Dev » en Debug) et `make build-release` (« Pilbo » en Release).
- L'app se lance, les notifications arrivent, la date d'expiration n'est plus à 7 jours.
- Un rappel traverse un mode de concentration (ex. « Ne pas déranger »).
- Mettre à jour `CLAUDE.md` (les contraintes du compte gratuit ne s'appliquent plus).

## Partie 2 : TestFlight

### 1. Envoi avec fastlane

- **fastlane** installé par Bundler (`Gemfile` à la racine), ajouté à `make install`, avec le Ruby de Homebrew.
- Clé API App Store Connect (fichier `.p8`, ID de clé, ID d'émetteur) dans `.env`, jamais dans le repo.
- `make testflight` lance une lane fastlane qui :
  - fixe le numéro de build (voir « Gestion des versions ») ;
  - régénère le projet iOS de la variante « Pilbo » et la construit en Release (`build_app`) ;
  - envoie le build sur TestFlight (`upload_to_testflight`), avec le « Quoi tester » en français et en anglais.
- « Quoi tester » : deux fichiers dans le repo, `fastlane/what_to_test/fr-FR.txt` et `fastlane/what_to_test/en-US.txt`, mis à jour avant chaque `make testflight`.
- fastlane resservira pour la fiche App Store (`deliver`, spec 25).

### 2. Gestion des versions

- Numéro de version (`version` dans `app.config.ts`, ex. `1.2.0`) : visible par les utilisateurs.
  - Changé par `make version-bump TYPE=major|minor|patch`, qui met à jour `app.config.ts`.
  - Sans `TYPE` (ou avec une valeur inconnue), la commande s'arrête avec un message d'aide.
- Numéro de build (`ios.buildNumber`) : doit augmenter à chaque envoi, calculé par fastlane à partir du dernier build sur TestFlight (`latest_testflight_build_number` + 1). Rien à modifier à la main.
- Les deux numéros sont déjà affichés dans les réglages (`VersionRow`) : rien à changer.

### 3. Build distribuable

- `ITSAppUsesNonExemptEncryption: false` dans l'`Info.plist` (pas de chiffrement propre), pour ne pas répondre à la question à chaque build.
- Privacy manifest (`ios.privacyManifests` dans la config Expo) : déclarer les « API à raison déclarée » utilisées par l'app et ses dépendances.
- Seule la variante « Pilbo » est envoyée sur TestFlight.

### 4. Fiche App Store Connect

- Créer l'app dans App Store Connect (à la main) : nom, bundle ID, SKU, langue principale.
- Infos de test : description de la bêta (FR et EN), e-mail de contact, envoyées par la lane fastlane.

### 5. Testeurs

- **Internes** (max 100, membres de l'équipe App Store Connect) : pas de revue Apple, build disponible tout de suite.
- **Externes** (max 10 000) : revue « bêta » d'Apple au premier build de chaque version.
  - Invités par **lien public** uniquement (pas d'invitation par e-mail).
  - Un groupe « Pilbo Externe » dans App Store Connect, auquel la lane fastlane ajoute chaque nouveau build.
- Builds TestFlight valables 90 jours.

### 6. Données des testeurs

- Fin de la règle « pas de migration » : les testeurs ont de vraies données, chaque changement de schéma livré passe par une migration Drizzle sans perte (règle détaillée dans « Décisions »).
- Mettre à jour `CLAUDE.md`, `docs/database.md` et la mémoire « no-migration » en conséquence.

## Hors scope

- Publication sur l'App Store (spec 25).
- Widget et App Group (spec 24).
- Notifications push.
- Android.

## Assurance qualité

- `make tests` passe.
- Les deux variantes installées en même temps sur l'iPhone, avec des données séparées.
- « Pilbo » démarre sans données de test, « Pilbo Dev » avec.
- Un build envoyé sur TestFlight, installé sur l'iPhone par l'app TestFlight.
- Une mise à jour TestFlight conserve les données.

## Décisions

### Compte et signature

- Bundle ID de repli si `com.tentacode.pilbo` est refusé : `com.tentacode.pilbo.app` (variante dev : `com.tentacode.pilbo.app.dev`).
- Signature automatique partout. Pour TestFlight : `build_app` avec `-allowProvisioningUpdates` et la clé API App Store Connect (certificat et profil créés par Xcode). Pas de `fastlane match`.

### Variantes

- `APP_VARIANT` (`dev` / `prod`) remplace `EXPO_PUBLIC_DEBUG_MODE` (supprimé de `.env.dist`, `src/config/debug.ts`, docs). Dev = seed + onboarding sauté au premier lancement. Prod = jamais de données de test, même si `.env` contient autre chose.
- Makefile : `build-simulator` / `build-device` = Dev en Debug, `build-release` = Pilbo en Release. Pas de Dev en Release ni de Pilbo en Debug.
- Le dossier `ios/` est partagé : chaque cible de build relance `expo prebuild` avec sa variante avant de construire.
- Simulateur et e2e en Dev : `appId` des flows Maestro mis à jour.
- Icône de « Pilbo Dev » : `assets/icon/icon-dev.svg`, dessinée par Claude à partir de `assets/icon/icon.svg`, exportée en PNG, validée visuellement par toi.

### Notifications

- `timeSensitive` pour les rappels de prise uniquement. Alertes de stock bas en `active`.

### fastlane et TestFlight

- Ruby installé par Homebrew (`brew install ruby`). `make install` vérifie sa présence (comme pour ccache), puis lance `bundle install`.
- Lane `testflight`, dans l'ordre :
  1. numéro de build = `latest_testflight_build_number` + 1 ;
  2. `expo prebuild --clean` avec `APP_VARIANT=prod` et `BUILD_NUMBER`, lu par `app.config.ts` (`ios.buildNumber`) ;
  3. `build_app` ;
  4. `upload_to_testflight` (« Quoi tester » FR/EN, infos de test, groupe « Pilbo Externe »).
- Infos de test (description de la bêta FR/EN, e-mail) : fichiers dans le repo, envoyés par la lane.

### App Store Connect

- Création de l'app à la main, guidée pas à pas par le plan (pas de `fastlane produce`).
- Langue principale : anglais.
- Si le nom « Pilbo » est déjà pris : l'implémentation s'arrête et demande.

### Migrations

- Avant le premier envoi sur TestFlight, les migrations `0000` à `0004` sont remplacées par une seule `0000` générée depuis le schéma actuel (réinstallation locale une dernière fois). Les notes « base à vider » de `docs/database.md` disparaissent.
- Règle à partir de là :
  - une migration déjà envoyée (TestFlight ou App Store) est figée ;
  - entre deux envois, les changements de schéma locaux vont dans une seule migration « en cours », qu'on supprime et régénère librement (réinstallation locale, pas de compatibilité) ;
  - avant `make testflight`, cette migration doit préserver les données des testeurs ;
  - même logique pour les réglages persistés (kv-store).
- Règle écrite dans `CLAUDE.md`, `docs/database.md` et la mémoire « no-migration » (mise à jour).
