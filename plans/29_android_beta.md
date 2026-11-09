# Spec 29 — Bêta Android : Play Console et test fermé

## Contexte

Distribuer « Pilbo » à des testeurs Android par le Play Store, en test fermé (lien public, Google Group), avec une lane fastlane `make android-beta`, une fiche minimale et les pages web (support, confidentialité, « Rejoindre la bêta »). Le test fermé lance le compteur des 14 jours avant la production (spec 28). Spec et décisions : `specs/29_android_beta.md`.

Fichiers concernés :

- Build : `app.config.ts`, `Makefile`, `plugins/withAbiSplits.js`, `plugins/withReleaseSigning.js`, `.env.dist`, `.gitignore`
- fastlane : `fastlane/Fastfile`, `fastlane/Appfile`, `fastlane/what_to_test/`, `fastlane/beta_app_info/feedback_email.txt`, `fastlane/metadata/android/<fr-FR|en-US>/` (nouveau)
- Visuels : `scripts/generateArtwork.mjs`, `assets/artwork/config.ts`
- Web : `website/` (nouveau), `.github/workflows/` (modèle : `ci.yaml`), couleurs dans `src/design-system/tokens.ts`
- Docs : `docs/android_build.md`, `docs/database.md`, `CLAUDE.md`, mémoire `no-migration.md`
- Références : `specs/25_app_store.md` (pages web, ton et vocabulaire prudent de la fiche), `specs/28_play_store.md` (argumentaire alarmes exactes), `docs/notifications.md` (section Android)

Le compte Play Console, la création de l'app et les déclarations se font à la main : le plan te guide, tu coches. Je ne lance aucune opération git : les push (pages web, etc.) sont faits par toi.

## Étape 1 — Pages web

- Structure statique dans `website/`, anglais à la racine, français sous `fr/`, lien de changement de langue sur chaque page :
  - [x] `index.html` / `fr/index.html` : support (présentation courte de Pilbo, contact `pilbo@tentacode.dev`, liens vers les autres pages) ;
  - [x] `privacy/` / `fr/privacy/` : politique de confidentialité (contenu de la spec 25 : aucune donnée collectée, tout reste sur le téléphone, pas de compte, pas de publicité, pas de suivi), pour iOS et Android, avec une date de mise à jour ;
  - [x] `beta/` / `fr/beta/` : « Rejoindre la bêta », les deux étapes Android dans l'ordre (rejoindre le groupe, puis s'inscrire au test). Liens provisoires, remplis à l'étape 8.
- [x] Une feuille de style commune (`website/styles.css`) : couleurs reprises des tokens de l'app (`lightColors` / `darkColors`), mode sombre par `prefers-color-scheme`, contraste AA, tailles relatives (zoom du navigateur), responsive.
- [x] Accessibilité : `lang` sur chaque page, titres hiérarchisés, liens explicites, `hreflang` sur le lien de langue.
- [x] Textes en vouvoiement, ton de l'app (`CLAUDE.md`). Tu relis les textes FR et EN.
- [x] Workflow `.github/workflows/website.yaml` : déploiement GitHub Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`) à chaque push sur `main` qui modifie `website/**`, permissions minimales (`pages: write`, `id-token: write`), même style que `ci.yaml`.
- [x] Tu actives GitHub Pages (Settings → Pages → Source : « GitHub Actions ») et tu pousses.
- [x] Tu vérifies les pages en ligne : `https://tentacode.github.io/pilbo/`, `…/privacy/`, `…/beta/` et leurs versions `fr/`.

## Étape 2 — Notes de version neutres

- [x] Réécrire `fastlane/what_to_test/fr-FR.txt` et `en-US.txt` sans mention de TestFlight (ex. retours par e-mail à `pilbo@tentacode.dev`), 500 caractères max.
- [x] Tu valides les textes.

## Étape 3 — versionCode et AAB

- [x] `app.config.ts` : `android.versionCode` lu depuis `BUILD_NUMBER` (entier, erreur claire si la valeur n'est pas un entier positif), non défini sinon (Expo met alors 1).
- [x] `Makefile` : `android-build-release` transmet `BUILD_NUMBER` s'il est fourni (`make android-build-release BUILD_NUMBER=5`), aide de la cible mise à jour.
- [x] Lane fastlane `android bundle` (`fastlane/Fastfile`, `platform :android`) qui :
  - [x] exige `BUILD_NUMBER` ;
  - [x] lance `APP_VARIANT=prod BUILD_NUMBER=… pnpm expo prebuild --clean --platform android` dans `Bundler.with_unbundled_env` (comme la lane iOS) ;
  - [x] vide `android/build/generated/autolinking` ;
  - [x] construit l'AAB (`gradle`, tâche `bundleRelease`, `project_dir: "android/"`) ; les variables de signature viennent de `.env` (chargé par fastlane).
- [x] `Makefile` : cible `android-bundle` (`## Build the "Pilbo" Android App Bundle without uploading it (BUILD_NUMBER=…)`), même appel que `testflight` (`PATH="$(RUBY_BIN):$$PATH" bundle exec fastlane android bundle`), ajoutée à `.PHONY`.
- [x] Splits ABI : vérifier que `make android-bundle BUILD_NUMBER=2` réussit avec `plugins/withAbiSplits.js`. Si les splits gênent, limiter `enable` aux tâches `assemble…Release`.
- [x] Vérifier l'AAB : `bundletool` ou `jarsigner -verify -verbose -certs` (certificat du keystore), `versionCode` 2 (`aapt2 dump badging` sur un APK extrait, ou `bundletool dump manifest`), permissions sans `INTERNET`.
- [x] Vérifier que `make android-build-release` sans `BUILD_NUMBER` fonctionne toujours (versionCode 1).

## Étape 4 — Visuels de la fiche

- [x] `scripts/generateArtwork.mjs` : deux nouvelles sorties, écrites dans `fastlane/metadata/android/<fr-FR|en-US>/images/` :
  - [x] `icon.png` : icône 512 × 512 (même rendu que `icon()`) ;
  - [x] `featureGraphic.png` : 1024 × 500, fond de pilules et gélule centrée, sans texte (réglages dans `assets/artwork/config.ts`, documentés comme les autres). Vérifier que `renderPng` gère ce format non carré.
- [x] `make artwork`.
- [x] Tu valides visuellement les deux images.

## Étape 5 — Textes et captures de la fiche

- [x] `fastlane/metadata/android/<fr-FR|en-US>/` : `title.txt` (« Pilbo »), `short_description.txt` (80 caractères max), `full_description.txt` (4 000 max). Ton et vocabulaire prudent de la spec 25 (un pilulier et des rappels, pas de conseil médical).
- [x] Tu valides les textes FR et EN.
- [x] Captures sur l'émulateur (« Pilbo Dev », données de test), FR et EN, 4 à 6 écrans (Aujourd'hui, pilulier, stock, calendrier…) : `adb exec-out screencap -p`, rangées dans `images/phoneScreenshots/` de chaque langue (`1_<nom>.png`…). Pas de barre de debug, heure et batterie propres si possible (mode démo : `adb shell settings put global sysui_demo_allowed 1`).
- [ ] Tu valides les captures.

## Étape 6 — Compte Play Console

- [ ] Tu crées le compte **personnel** (play.google.com/console, 25 $).
- [ ] Tu fais la vérification d'identité, puis celle de l'appareil avec l'app Play Console sur le S9.
- [ ] Tu déclares le statut **non-trader** (DSA).
- [x] Relire l'aide officielle sur le test fermé des comptes personnels (12 testeurs, 14 jours d'affilée) et noter tout écart avec la spec.
  - Pas d'écart : 12 testeurs inscrits au moment de la demande, chacun depuis 14 jours consécutifs (un testeur qui se désinscrit repart à zéro).
  - À préparer pour la spec 28 : la demande d'accès à la production demande un résumé des retours des testeurs (et comment ils ont été recueillis), leur engagement (fonctions utilisées) et les changements faits depuis le test.

## Étape 7 — App, signature et déclarations

- [ ] Tu crées l'app : nom « Pilbo », langue par défaut anglais (`en-US`), app (pas jeu), gratuite.
- [ ] Play App Signing avec le keystore actuel (Configuration de l'app → Intégrité de l'app → « Utiliser une autre clé » → exporter depuis un keystore Java) :
  - [ ] télécharger `pepk.jar` et la clé publique de chiffrement ;
  - [ ] `java -jar pepk.jar --keystore=$ANDROID_KEYSTORE_PATH --alias=pilbo --output=<scratchpad>/pilbo-signing.zip --include-cert --rsa-aes-encryption --encryption-key-path=<clé publique>` (mot de passe de `.env`), puis tu envoies le zip ;
  - [ ] vérifier que l'empreinte SHA-256 de la clé de signature de l'app affichée est celle du keystore (`keytool -list -v -keystore …`), et que la clé d'importation est la même ;
  - [ ] supprimer le zip.
- [ ] Fiche principale : tu recopies les textes de `fastlane/metadata/android/` et tu envoies icône, image de présentation et captures (première fois à la main, la lane les synchronise ensuite). Catégorie Médecine, e-mail de contact, site `https://tentacode.github.io/pilbo/`.
- [ ] « Contenu de l'application », avec moi pour les réponses :
  - [ ] politique de confidentialité : `https://tentacode.github.io/pilbo/privacy/` ;
  - [ ] accès à l'app : aucune restriction (pas de compte) ;
  - [ ] publicités : non ;
  - [ ] classification du contenu : questionnaire ;
  - [ ] public cible : adultes (18 ans et plus) ;
  - [ ] sécurité des données : aucune donnée collectée ni partagée ;
  - [ ] applications de santé : formulaire de déclaration ;
  - [ ] alarmes exactes : si la déclaration de `USE_EXACT_ALARM` est demandée, argumentaire de la spec 28.

## Étape 8 — Test fermé et premier envoi

- [ ] Tu crées le Google Group `pilbo-testeurs`, « Tout le monde peut rejoindre » (et voir les membres réservé aux gestionnaires).
- [ ] Piste « Test fermé – Alpha » : le groupe comme liste de testeurs, pays : tous, e-mail de retour `pilbo@tentacode.dev`.
- [ ] `make android-bundle BUILD_NUMBER=2`.
- [ ] Tu envoies `android/app/build/outputs/bundle/release/app-release.aab` sur la piste fermée, notes de version de `fastlane/what_to_test/`, puis tu envoies en revue.
- [ ] Si Google refuse `USE_EXACT_ALARM` : on s'arrête et on en parle.
- [ ] Liens réels (groupe, inscription au test) dans les pages `beta/` FR et EN, puis tu pousses.
- [ ] Revue acceptée.

## Étape 9 — Lane `android beta`

- [ ] Tu crées le compte de service :
  - [ ] Google Cloud : projet, API « Google Play Android Developer » activée, compte de service, clé JSON rangée hors du repo (ex. `~/.google-play/pilbo-service-account.json`, `chmod 600`) ;
  - [ ] Play Console → Utilisateurs et autorisations : inviter l'adresse du compte de service, droits sur Pilbo limités aux pistes de test et à la fiche.
- [x] `.env.dist` : `GOOGLE_PLAY_JSON_KEY_PATH=` avec un commentaire (comme la clé App Store Connect). Tu remplis `.env`.
- [x] `fastlane/Appfile` : `package_name("com.tentacode.pilbo")` et `json_key_file` lu depuis `GOOGLE_PLAY_JSON_KEY_PATH` (sans casser la lane iOS si la variable manque).
- [x] Lane `android beta` :
  - [x] piste : `alpha` par défaut, `internal` si `TRACK=internal`, erreur claire pour toute autre valeur ;
  - [x] `versionCode` = plus grand de `google_play_track_version_codes` sur `alpha` et `internal` (piste vide ignorée) + 1 ;
  - [x] appelle la lane `bundle` avec ce numéro ;
  - [x] notes de version : copie de `fastlane/what_to_test/<langue>.txt` vers `fastlane/metadata/android/<langue>/changelogs/<versionCode>.txt`, erreur si plus de 500 caractères ; `changelogs/` ajouté au `.gitignore` ;
  - [x] `upload_to_play_store` : AAB, piste, `release_status: "completed"`, textes et images de `fastlane/metadata/android/`.
- [x] `Makefile` : cible `android-beta` (`## Build "Pilbo" and send it to the Play Store closed test (fastlane, TRACK=internal for the internal test)`), ajoutée à `.PHONY`.
- [ ] `make android-beta` : un build en versionCode 3 sur la piste fermée. Si fastlane répond que l'app est encore en brouillon, on en parle.

## Étape 10 — Données des testeurs

- [x] `docs/database.md` (« Règle des migrations ») : migration figée dès qu'elle est envoyée sur TestFlight, l'App Store **ou une piste du Play Store** ; la migration « en cours » préserve les données avant `make testflight` **et** `make android-beta`.
- [x] Mettre à jour la mémoire `no-migration.md` (même règle).
- [x] `CLAUDE.md` : même règle (après ta validation).

## Étape 11 — Documentation

- [x] `docs/android_build.md`, nouvelle section Play Console :
  - [x] compte de service, `GOOGLE_PLAY_JSON_KEY_PATH` ;
  - [x] Play App Signing (keystore actuel = clé de l'app et d'importation, la sauvegarde reste indispensable) ;
  - [x] `make android-bundle`, `make android-beta`, `TRACK=internal`, pistes `alpha` / `internal` ;
  - [x] Google Group, page « Rejoindre la bêta » ;
  - [x] `make android-build-release BUILD_NUMBER=…` : au-dessus du versionCode du Play Store, sinon Android refuse la rétrogradation (désinstaller = perdre les données) ;
  - [x] après `make android-bundle` / `make android-beta`, `android/` est en variante « Pilbo » (note `INTERNET` de `CLAUDE.md`) ;
  - [x] retirer la mention « splits ABI … AAB (spec 28, à vérifier) ».
- [x] `docs/architecture.md` : `website/` dans l'arborescence.
- [x] `CLAUDE.md` : commandes `make android-bundle` et `make android-beta`, `website/` (après ta validation).

## Étape 12 — Assurance qualité

- [ ] Tu rejoins le test fermé avec le S9 (groupe, puis lien d'inscription) : le Play Store propose la mise à jour de « Pilbo » installée en APK, et les données sont conservées.
- [ ] Une mise à jour suivante par `make android-beta` arrive par le Play Store et conserve les données.
- [ ] Un testeur externe s'inscrit par la page « Rejoindre la bêta ».
- [ ] 12 testeurs inscrits, compteur des 14 jours lancé (piste jamais mise en pause).

## Étape 13 — Fin

- [x] `make tests` passe.
- [ ] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
- [ ] Supprimer `checklist_android_fastlane.md` une fois tes textes reportés dans les fichiers sources (remplacé par le brouillon de la spec 33).
