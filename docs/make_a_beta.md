# Faire une bêta

Envoyer « Pilbo » aux testeurs : TestFlight (iOS) et test fermé du Play Store (Android). Détails : `docs/android_build.md` (section Play Console) et `fastlane/Fastfile`.

## 1. Vérifier

- [ ] `make tests` passe (lint, prettier, TypeScript, traductions, Jest, audit).
- [ ] `make test-e2e` (simulateur iOS) et `make android-test-e2e` (émulateur Android).
- [ ] Migration : une seule migration « en cours », qui conserve les données des testeurs (voir « Règle des migrations » dans `docs/database.md`).
- [ ] « Pilbo » en Release sur les téléphones (`make build-release`, `make android-build-release BUILD_NUMBER=<versionCode du Play Store + 1>`) : l'app s'ouvre sur les données existantes.

## 2. Version

- [ ] Nouvelles fonctionnalités : `make version-bump TYPE=minor` (corrections seules : `TYPE=patch`). Le numéro de build et le versionCode augmentent tout seuls.

Le premier build d'une nouvelle version repasse par la revue bêta d'Apple. Google fait une revue à chaque envoi.

## 3. Textes

- [ ] Notes « À tester », communes aux deux stores (500 caractères max) :
  - `fastlane/what_to_test/fr-FR.txt`
  - `fastlane/what_to_test/en-US.txt`
- [ ] Si les fonctionnalités ont changé :
  - description TestFlight : `fastlane/beta_app_info/description/<langue>.txt` ;
  - fiche Play Store : `fastlane/metadata/android/<langue>/` (description courte 80 caractères max, complète 4000), envoyée à chaque `make android-beta` ;
  - site : textes dans `website/src/locales/` (FR et EN, date de la politique de confidentialité si son contenu change), vérifiés avec `make preview-github-pages`. Captures du site : `make github-pages-screenshots` après une mise à jour de `store/screenshots/screenshots/`.
- [ ] Si l'interface a changé : captures du Play Store dans `fastlane/metadata/android/<langue>/images/phoneScreenshots/`.

## 4. Envoyer

```sh
make testflight
make android-beta
```

- `make android-beta TRACK=internal` : test interne, sans revue, pour un essai rapide.
- Ensuite, avant un build « Pilbo Dev » : `make clean` (`android/` et `ios/` sont restés en variante « Pilbo »).

## 5. Après l'envoi

- [ ] Revues acceptées : TestFlight dans App Store Connect, test fermé dans la Play Console.
- [ ] Mise à jour installée sur les téléphones par TestFlight et le Play Store : les données sont conservées.
- [ ] Testeurs Android prévenus par un message au groupe `pilbo-beta` (le Play Store ne les prévient pas). TestFlight prévient ses testeurs tout seul.
- [ ] La migration envoyée est désormais figée.
