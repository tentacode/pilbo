# Bêta Android : Play Console, tests interne et fermé

On distribue « Pilbo » à des testeurs Android par le Play Store, sur le modèle de TestFlight (spec 23) : d'abord des proches (test interne), puis des testeurs externes recrutés par un lien public (test fermé).

Le test fermé lance aussi le compteur obligatoire avant la production (compte personnel). La fiche complète et la sortie en production restent dans la spec 28.

## Prérequis

- Spec 17 faite : version Android au point, keystore de signature en place.
- Une URL de politique de confidentialité, demandée par la Play Console (voir « Questions ouvertes »).

## 1. Compte Google Play Console

- Compte **personnel** (pas d'entité légale), 25 $ une fois.
- Vérification d'identité, et vérification d'un appareil Android par l'app Play Console (sur le Galaxy S9).
- Passage en compte organisation possible plus tard, sans changer de compte (l'inverse est impossible).
- Statut professionnel dans l'UE (DSA) : **non-trader**, comme sur l'App Store (spec 25).

## 2. App dans la Play Console

- Création à la main, guidée pas à pas par le plan : nom « Pilbo », langue par défaut anglais (comme App Store Connect), app gratuite.
- Package `com.tentacode.pilbo` : seule la variante « Pilbo » est envoyée sur le Play Store.
- **Play App Signing** : choix de la clé de signature de l'app (voir « Questions ouvertes »).

## 3. Build AAB

- Build Release en **AAB** (Android App Bundle), signé avec le keystore actuel (`plugins/withReleaseSigning.js`).
- `android.versionCode` lu depuis `BUILD_NUMBER` dans `app.config.ts`, comme `ios.buildNumber`.
- Vérifier que les splits ABI (`plugins/withAbiSplits.js`) ne gênent pas le build AAB (le Play Store découpe lui-même par architecture).
- `make android-build-release` (APK installé sur le téléphone) ne change pas.

## 4. Envoi avec fastlane

- Compte de service Google Cloud avec accès à la Play Console : fichier JSON hors du repo, chemin dans `.env` (et `.env.dist`).
- Premier AAB envoyé à la main dans la Play Console, piste de test interne (fastlane ne sait pas créer la première version).
- Ensuite, `make android-beta` lance une lane fastlane `android beta` qui :
  - calcule le `versionCode` : le plus grand des pistes existantes (`google_play_track_version_codes`) + 1 ;
  - régénère `android/` pour la variante « Pilbo » (`APP_VARIANT=prod`, `BUILD_NUMBER`) et construit l'AAB ;
  - l'envoie (`upload_to_play_store`) sur la piste choisie : `TRACK=internal` (par défaut) ou `TRACK=closed` ;
  - ajoute les notes de version FR/EN, reprises de `fastlane/what_to_test/<langue>.txt` (500 caractères max).
- Fiche minimale (textes FR/EN, voir section 7) dans `fastlane/metadata/android/<langue>/`, envoyée par la même lane.

## 5. Test interne

- Proches uniquement : jusqu'à 100 adresses e-mail (comptes Google), ajoutées à la main dans la Play Console.
- Pas de revue, build disponible en quelques minutes.

## 6. Test fermé

- Revue de Google à la première publication (et éventuellement aux suivantes).
- Testeurs par **lien public** :
  - un Google Group (ex. `pilbo-testeurs`) réglé sur « Tout le monde peut rejoindre », déclaré comme liste de testeurs de la piste fermée ;
  - on partage deux liens (Reddit, entourage…) : celui du groupe, à rejoindre d'abord, puis le lien d'inscription au test ;
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
- **Politique de confidentialité** : URL.
- **Accès à l'app** : pas de compte, pas de connexion.
- **Alarmes exactes** (`USE_EXACT_ALARM`, spec 17) : déclaration si elle est demandée dès le test fermé (argumentaire dans la spec 28). Si Google refuse : on s'arrête et on en parle.

## 8. Données des testeurs

- Même règle que TestFlight : une migration envoyée sur une piste du Play Store est figée, et la migration « en cours » doit préserver les données des testeurs avant `make android-beta`.
- Mettre à jour `CLAUDE.md`, `docs/database.md` et la mémoire « no-migration » en conséquence.

## 9. Documentation

- `docs/android_build.md` : section Play Console (compte de service, `make android-beta`, pistes, Google Group).
- `CLAUDE.md` : nouvelle commande (après validation).

## Hors scope

- Fiche complète, captures automatisées, questionnaire d'accès à la production, test ouvert et sortie en production (spec 28).
- Bascule vers `SCHEDULE_EXACT_ALARM` (si Google refuse `USE_EXACT_ALARM`, on en parle).
- Achats intégrés, widget Android, autres stores.

## Assurance qualité

- `make tests` passe.
- Un AAB envoyé par `make android-beta` sur la piste interne, installé depuis le Play Store sur le Galaxy S9.
- Une mise à jour par le Play Store conserve les données.
- Test fermé accepté par Google, un testeur externe inscrit par les deux liens.
- 12 testeurs inscrits, compteur des 14 jours lancé.

## Questions ouvertes

1. **Clé de signature (Play App Signing)** : donner à Google le keystore actuel comme clé de signature de l'app (les APK déjà installés pourront se mettre à jour par le Play Store), ou laisser Google en générer une (il faudra désinstaller les APK actuels, donc perdre leurs données).
2. **Politique de confidentialité** : faire d'abord la partie « Pages web » de la spec 25 (en mentionnant Android), ou l'inclure dans cette spec.
