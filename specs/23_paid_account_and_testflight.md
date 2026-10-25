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

- À vérifier : `com.tentacode.pilbo` a été enregistré par la Personal Team. La nouvelle équipe ne pourra peut-être pas le réutiliser (« not available »). Dans ce cas, il faut changer de bundle ID.
- iOS refuse en général d'installer par-dessus une app signée par une autre équipe : il faudrait alors **supprimer l'app, et donc ses données**.
- Pas de problème pour l'instant : l'iPhone n'a que des données de test, on peut supprimer l'app sans risque.

### 4. Variantes de l'app

- Deux apps installables côte à côte sur l'iPhone :
  - « Pilbo » (`com.tentacode.pilbo`) : vraies données.
  - « Pilbo Dev » (`com.tentacode.pilbo.dev`) : données de test.
- La section debug (10 taps sur « Version ») reste dans les deux variantes, y compris sur TestFlight et l'App Store.
- Choix de la variante par une variable d'environnement (ex. `APP_VARIANT=dev`) lue dans `app.config.ts` : bundle ID, nom affiché, icône distincte.
- Chaque variante a sa propre base et ses propres notifications.
- Cibles du `Makefile` adaptées pour construire l'une ou l'autre variante.

### 5. Notifications Time Sensitive

- Capability et entitlement `com.apple.developer.usernotifications.time-sensitive`, déclarés dans la config Expo (survit à `make clean`).
- Les rappels de prise passent en `interruptionLevel: "timeSensitive"` : ils traversent les modes de concentration et restent plus longtemps sur l'écran verrouillé.
- `plugins/withoutPushEntitlement.js` reste (on n'utilise pas les notifications push).

### 6. Vérification

- `make clean`, puis `make build-device` et `make build-release`, pour chaque variante.
- L'app se lance, les notifications arrivent, la date d'expiration n'est plus à 7 jours.
- Un rappel traverse un mode de concentration (ex. « Ne pas déranger »).
- Mettre à jour `CLAUDE.md` (les contraintes du compte gratuit ne s'appliquent plus).

## Partie 2 : TestFlight

### 1. Envoi avec fastlane

- **fastlane** installé par Bundler (`Gemfile` à la racine), ajouté à `make install`.
- Clé API App Store Connect (fichier `.p8`, ID de clé, ID d'émetteur) dans `.env`, jamais dans le repo.
- `make testflight` lance une lane fastlane qui :
  - construit la variante « Pilbo » en Release (`build_app`) ;
  - fixe le numéro de build (voir « Gestion des versions ») ;
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

- Créer l'app dans App Store Connect : nom, bundle ID, SKU, langue principale.
- Infos de test : description de la bêta (FR et EN), e-mail de contact.

### 5. Testeurs

- **Internes** (max 100, membres de l'équipe App Store Connect) : pas de revue Apple, build disponible tout de suite.
- **Externes** (max 10 000) : revue « bêta » d'Apple au premier build de chaque version.
  - Invités par **lien public** uniquement (pas d'invitation par e-mail).
  - Un groupe « Bêta publique » dans App Store Connect, auquel la lane fastlane ajoute chaque nouveau build.
- Builds TestFlight valables 90 jours.

### 6. Données des testeurs

- Fin de la règle « pas de migration » : les testeurs ont de vraies données, chaque changement de schéma passe par une migration Drizzle sans perte.
- Mettre à jour `CLAUDE.md` et `docs/database.md` en conséquence.

## Hors scope

- Publication sur l'App Store (spec 25).
- Widget et App Group (spec 24).
- Notifications push.
- Android.

## Assurance qualité

- `make tests` passe.
- Les deux variantes installées en même temps sur l'iPhone, avec des données séparées.
- Un build envoyé sur TestFlight, installé sur l'iPhone par l'app TestFlight.
- Une mise à jour TestFlight conserve les données.
