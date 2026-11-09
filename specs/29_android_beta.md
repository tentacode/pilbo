# Bêta Android : Play Console et test fermé

On distribue « Pilbo » à des testeurs Android par le Play Store, sur le modèle de TestFlight (spec 23) : des testeurs externes recrutés par un lien public (test fermé). Le test interne reste possible, mais n'est pas utilisé par défaut.

Le test fermé lance aussi le compteur obligatoire avant la production (compte personnel). La fiche complète et la sortie en production restent dans la spec 28.

## Prérequis

- Spec 17 faite : version Android au point, keystore de signature en place.
- Une URL de politique de confidentialité, demandée par la Play Console : faite dans cette spec (section 8).

## 1. Compte Google Play Console

- Compte **personnel** (pas d'entité légale), 25 $ une fois.
- Vérification d'identité, et vérification d'un appareil Android par l'app Play Console (sur le Galaxy S9).
- Passage en compte organisation possible plus tard, sans changer de compte (l'inverse est impossible).
- Statut professionnel dans l'UE (DSA) : **non-trader**, comme sur l'App Store (spec 25).

## 2. App dans la Play Console

- Création à la main, guidée pas à pas par le plan : nom « Pilbo », langue par défaut anglais (comme App Store Connect), app gratuite.
- Package `com.tentacode.pilbo` : seule la variante « Pilbo » est envoyée sur le Play Store.
- **Play App Signing** : le keystore actuel devient la clé de signature de l'app (voir « Décisions »).

## 3. Build AAB

- Build Release en **AAB** (Android App Bundle), signé avec le keystore actuel (`plugins/withReleaseSigning.js`).
- `android.versionCode` lu depuis `BUILD_NUMBER` dans `app.config.ts`, comme `ios.buildNumber`.
- Vérifier que les splits ABI (`plugins/withAbiSplits.js`) ne gênent pas le build AAB (le Play Store découpe lui-même par architecture).
- `make android-bundle` construit l'AAB sans l'envoyer.
- `make android-build-release` (APK installé sur le téléphone) accepte `BUILD_NUMBER=…` (voir « Décisions »).

## 4. Envoi avec fastlane

- Compte de service Google Cloud avec accès à la Play Console : fichier JSON hors du repo, chemin dans `.env` (et `.env.dist`).
- Premier AAB envoyé à la main dans la Play Console, directement sur la piste de test fermé (fastlane ne sait pas créer la première version).
- Ensuite, `make android-beta` lance une lane fastlane `android beta` qui :
  - calcule le `versionCode` : le plus grand des pistes existantes (`google_play_track_version_codes`) + 1 ;
  - régénère `android/` pour la variante « Pilbo » (`APP_VARIANT=prod`, `BUILD_NUMBER`) et construit l'AAB ;
  - l'envoie (`upload_to_play_store`) sur la piste choisie : test fermé par défaut, `TRACK=internal` en option ;
  - ajoute les notes de version FR/EN, reprises de `fastlane/what_to_test/<langue>.txt` (500 caractères max).
- Fiche minimale (textes FR/EN, voir section 7) dans `fastlane/metadata/android/<langue>/`, envoyée par la même lane.

## 5. Test interne (option)

- Pas utilisé par défaut : `make android-beta TRACK=internal` reste possible.
- Pas de liste de testeurs internes à créer tant qu'on ne s'en sert pas (jusqu'à 100 adresses e-mail, ajoutées à la main dans la Play Console).
- Pas de revue, build disponible en quelques minutes.

## 6. Test fermé

- Revue de Google à chaque build envoyé (souvent quelques heures, parfois plusieurs jours).
- Testeurs par **lien public** :
  - un Google Group (ex. `pilbo-testeurs`) réglé sur « Tout le monde peut rejoindre », déclaré comme liste de testeurs de la piste fermée ;
  - deux liens à suivre dans l'ordre : celui du groupe, à rejoindre d'abord, puis le lien d'inscription au test. On partage la page « Rejoindre la bêta » (section 8), qui les présente (Reddit, entourage…) ;
  - le testeur installe Pilbo depuis le Play Store, avec les mises à jour automatiques.
- Retours des testeurs : e-mail de contact (`fastlane/beta_app_info/feedback_email.txt`), et retours privés de la Play Console.
- Objectif : au moins **12 testeurs inscrits pendant 14 jours d'affilée** (règle à relire dans l'aide officielle au moment de l'implémentation). Ne pas mettre la piste en pause pendant ce temps.
- Recrutement : entourage, Reddit, échange de tests entre développeurs si besoin. Pas de service payant.

## 7. Fiche minimale et déclarations

Demandées pour la revue du test fermé. Version simple ici, version finale dans la spec 28.

### Fiche (FR et EN)

- Nom, description courte (80 caractères), description complète : même ton et même vocabulaire prudent que la spec 25.
- Icône 512 × 512, image de présentation 1024 × 500.
- Quelques captures faites à la main sur l'émulateur (l'automatisation avec Maestro reste dans la spec 28).
- Catégorie : Médecine. Gratuite, sans achat intégré, sans publicité.

### Déclarations (« Contenu de l'application »)

- **Sécurité des données** : aucune donnée collectée ni partagée.
- **Classification du contenu** : questionnaire.
- **Public cible** : adultes.
- **Applications de santé** : formulaire de déclaration.
- **Politique de confidentialité** : URL (section 8).
- **Accès à l'app** : pas de compte, pas de connexion.
- **Alarmes exactes** (`USE_EXACT_ALARM`, spec 17) : déclaration si elle est demandée dès le test fermé (argumentaire dans la spec 28). Si Google refuse : on s'arrête et on en parle.

## 8. Pages web

La partie « Pages web » de la spec 25 est faite ici, la spec 25 les réutilisera.

- **Politique de confidentialité** et **page de support**, en FR et en EN, comme décrites dans la spec 25, mais pour iOS et Android.
- Hébergement **GitHub Pages** (repo public) : pages HTML statiques dans `website/`, déployées par un workflow GitHub Actions à chaque push sur `main` qui modifie `website/`.
- Page **« Rejoindre la bêta »** en FR et en EN, faite rapidement : les deux étapes Android (rejoindre le groupe, puis s'inscrire au test), avec les deux liens dans l'ordre.
- Pages accessibles (WCAG AA), dans les couleurs de l'app.

## 9. Données des testeurs

- Même règle que TestFlight : une migration envoyée sur une piste du Play Store est figée, et la migration « en cours » doit préserver les données des testeurs avant `make android-beta`.
- Mettre à jour `CLAUDE.md`, `docs/database.md` et la mémoire « no-migration » en conséquence.

## 10. Documentation

- `docs/android_build.md` : section Play Console (compte de service, Play App Signing, `make android-bundle`, `make android-beta`, pistes, Google Group, `BUILD_NUMBER` pour `make android-build-release`).
- `CLAUDE.md` : nouvelles commandes (après validation).

## Hors scope

- Fiche complète, captures automatisées, questionnaire d'accès à la production, test ouvert et sortie en production (spec 28).
- Bascule vers `SCHEDULE_EXACT_ALARM` (si Google refuse `USE_EXACT_ALARM`, on en parle).
- Achats intégrés, widget Android, autres stores.

## Assurance qualité

- `make tests` passe.
- Pages web en ligne, en FR et en EN.
- Un AAB envoyé par `make android-beta` sur la piste fermée, installé depuis le Play Store sur le Galaxy S9 (vous rejoignez vous-même le test fermé).
- Une mise à jour par le Play Store conserve les données.
- Test fermé accepté par Google, un testeur externe inscrit par les deux liens.
- 12 testeurs inscrits, compteur des 14 jours lancé.

## Décisions

### Signature

- Play App Signing : le keystore actuel (`~/.android-signing/pilbo-release.jks`) est envoyé à Google (outil PEPK) comme clé de signature de l'app, et sert aussi de clé d'importation. Un seul keystore à gérer, les APK déjà installés (versionCode 1) se mettent à jour par le Play Store.

### Pistes

- `make android-beta` envoie par défaut sur la **piste fermée** (identifiant `alpha` dans la Play Console). `make android-beta TRACK=internal` reste possible.
- Le premier AAB est envoyé à la main, directement sur la piste fermée, avec le versionCode **2** (au-dessus des APK actuels).

### Build et versionCode

- `make android-bundle` construit l'AAB sans l'envoyer (premier envoi manuel), la lane réutilise la même construction.
- La lane suit le même schéma qu'iOS : `prebuild --clean --platform android`, puis on vide le cache d'autolinking (`android/build/generated/autolinking`).
- `make android-build-release` accepte `BUILD_NUMBER=…` (versionCode), à passer à la main au-dessus de celui du Play Store pour installer un APK local par-dessus. Sans `BUILD_NUMBER`, versionCode 1 : Android refuse la rétrogradation, cas documenté.

### Notes de version

- Un seul texte pour iOS et Android : `fastlane/what_to_test/<langue>.txt`, neutre (sans mention de TestFlight). Le texte actuel est réécrit.

### Visuels et textes de la fiche

- Icône 512 × 512 et image de présentation 1024 × 500 générées par `make artwork` (`scripts/generateArtwork.mjs`) : fond de pilules et gélule, sans texte. Validées visuellement par vous.
- Textes de la fiche rédigés par Claude, validés par vous.

### Pages web

- Partie « Pages web » de la spec 25 faite dans cette spec (support, confidentialité, FR/EN, iOS et Android), plus une page « Rejoindre la bêta » FR/EN. C'est l'URL de cette page qu'on partage.
