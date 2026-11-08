# Build Android

## Prérequis

- Tout ce qu'il faut pour iOS (Node, pnpm, etc., voir `docs/ios_build.md`).
- **Android Studio** à jour.
- **SDK Android** (Android Studio → Settings → Languages & Frameworks → Android SDK) :
  - onglet _SDK Platforms_ : **Android 16.0 (API 36)** (`compileSdk` / `targetSdk` d'Expo SDK 57) et une image système **Android 17** (ARM 64) pour l'émulateur ;
  - onglet _SDK Tools_ : **Build-Tools 36**, **NDK 27.1.12297006**, **CMake 3.22.1**, **Command-line Tools**, **Platform-Tools** et **Emulator** à jour.
- **Java 17** (Zulu 17) : `brew install --cask zulu@17`. Gradle ne fonctionne pas avec Java 23.
- `make install` vérifie `ANDROID_HOME`, `adb` et Java 17.

`android/` est généré par Expo (non versionné), comme `ios/`.

## Mise en place de l'environnement

Dans `~/.zshrc` :

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
```

Puis ouvrir un nouveau terminal et vérifier :

```bash
adb version
emulator -list-avds
java -version   # openjdk version "17..."
```

## Émulateur

Android Studio → Device Manager → _Create Virtual Device_ :

- petit écran (ex. _Small Phone_), pour retrouver les contraintes de l'iPhone 12 mini ;
- image système Android 17 (ARM 64) : **cliquer sur la ligne** de l'image dans la liste, sinon _Finish_ reste grisé sans explication ;
- _Additional settings_ : RAM à 4 Go (1 Go par défaut, trop peu pour Android 17).

Émulateur du projet : `Small_Phone_-_Pilbo` (Android 17, API 37.1).

Lancement sans Android Studio : `emulator -avd <nom>` (`emulator -list-avds` pour les noms).

## Commandes

Comme sur iOS, deux variantes choisies par `APP_VARIANT` (fixé par le `Makefile`) : « Pilbo Dev » (`com.tentacode.pilbo.dev`, données de test) et « Pilbo » (`com.tentacode.pilbo`). Chaque cible met à jour `android/` pour sa variante (`prebuild --no-clean --platform android`).

- `make android-build-emulator` : « Pilbo Dev » en Debug sur l'émulateur démarré (Metro nécessaire, lancé automatiquement).
- `make android-build-device` : « Pilbo Dev » en Debug sur le téléphone `ANDROID_DEVICE_ID`.
- `make android-build-release` : « Pilbo » en Release, installé sur `ANDROID_DEVICE_ID` (sans Metro). Produit deux APK signés, chemins affichés :
  - `app-arm64-v8a-release.apk` (environ 80 Mo) : presque tous les téléphones récents, à partager en priorité ;
  - `app-universal-release.apk` (environ 150 Mo) : les 4 architectures, pour les vieux téléphones 32 bits et les émulateurs.

  Les splits ABI (`plugins/withAbiSplits.js`) ne s'activent qu'en Release et ne concernent que les APK, pas un AAB (spec 28, à vérifier à ce moment-là).

- `make clean` : régénère `ios/` et `android/` (`prebuild --clean`).

Si l'émulateur et le téléphone sont branchés en même temps, `expo run:android` demande lequel utiliser.

## Tests end to end (Maestro)

Les flows `e2e/` sont communs à iOS et Android. `make android-test-e2e` les lance sur l'émulateur démarré (Maestro le cible explicitement, même si le téléphone est branché).

Avant le premier lancement :

- « Pilbo Dev » installée sur l'émulateur (`make android-build-emulator`), Metro lancé ;
- émulateur **en français** : Paramètres → Système → Langues → ajouter _Français (France)_ et le placer en premier. `launchApp: clearState` efface la langue choisie pour l'app, et `-change-locale` ne fonctionne pas sans accès root (images Google Play).

En Debug sur l'émulateur, le premier lancement après `clearState` prend 15 à 20 s (bundle chargé depuis Metro) : les flows attendent jusqu'à 60 s le premier écran.

Flows pas encore adaptés à Android : `intake-edit` (sélecteur d'heure iOS), et ceux qui n'ont pas pu être lancés (`meds`, `onboarding`, `pillbox`, `settings`, `today-validation`).

## Permissions

`android.blockedPermissions` (`app.config.ts`) retire les permissions ajoutées par Expo et ses modules mais inutiles : `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, plus `INTERNET` pour « Pilbo » (« Pilbo Dev » en a besoin pour Metro). Vérifier un APK :

```bash
$ANDROID_HOME/build-tools/36.0.0/aapt2 dump permissions android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

## Téléphone Android

1. Téléphone → Paramètres → À propos du téléphone → Informations sur le logiciel → toucher 7 fois « Numéro de version » : les options de développement apparaissent.
2. Options de développement → activer **Débogage USB**.
3. Brancher le téléphone en USB, accepter l'empreinte de l'ordinateur sur le téléphone.
4. `adb devices` : copier l'identifiant dans `ANDROID_DEVICE_ID` (`.env`). `expo run:android --device` attend le nom du modèle (ex. `SM_N985F`) : le `Makefile` le déduit de l'identifiant (`adb devices -l`).

## Signature Release

L'APK Release est signé avec un keystore personnel, hors du repo. `plugins/withReleaseSigning.js` ajoute `signingConfigs.release` à `android/app/build.gradle` (il survit à `prebuild --clean`). Gradle lit les variables de `.env`, chargé par la CLI Expo :

| Variable                    | Valeur                                                 |
| --------------------------- | ------------------------------------------------------ |
| `ANDROID_KEYSTORE_PATH`     | `~/.android-signing/pilbo-release.jks` (chemin absolu) |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du keystore                               |
| `ANDROID_KEY_ALIAS`         | `pilbo`                                                |
| `ANDROID_KEY_PASSWORD`      | identique au mot de passe du keystore (format PKCS12)  |

Si une variable manque, seul un build Release échoue (« Release signing: missing … »). Les builds Debug restent signés avec la clé de debug.

### Génération (déjà faite, une seule fois)

```bash
mkdir -p ~/.android-signing && chmod 700 ~/.android-signing
PASSWORD="$(openssl rand -hex 24)"
keytool -genkeypair -storetype PKCS12 -keystore ~/.android-signing/pilbo-release.jks \
  -alias pilbo -keyalg RSA -keysize 4096 -validity 10950 -dname "CN=Gabriel Pillet" \
  -storepass "$PASSWORD" -keypass "$PASSWORD"
```

Puis reporter le chemin, l'alias et le mot de passe (deux fois) dans `.env`. Le certificat est valable 30 ans.

### Sauvegarde

À conserver ensemble dans un gestionnaire de mots de passe (pièce jointe + champs) :

- le fichier `~/.android-signing/pilbo-release.jks` ;
- les quatre variables `ANDROID_KEY*` de `.env`.

### Restauration (nouvelle machine ou `git clone`)

1. Copier le keystore dans `~/.android-signing/pilbo-release.jks` (`chmod 600`).
2. Recopier les quatre variables dans `.env` (à partir de `.env.dist`).
3. `make android-build-release`.

Vérifier la signature d'un APK :

```bash
$ANDROID_HOME/build-tools/36.0.0/apksigner verify --print-certs android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

### En cas de perte

Android refuse une mise à jour signée par une autre clé. Sans le keystore, il faut désinstaller « Pilbo » avant d'installer un nouvel APK, ce qui **supprime toutes les données** de l'app (prises, historique, stocks). Il n'y a pas de récupération possible.

### Changer de variante

`android/` est partagé entre « Pilbo Dev » et « Pilbo ». Le plugin Gradle de React Native garde en cache la configuration d'autolinking (dont le nom du package) : les cibles `make android-build-*` vident `android/build/generated/autolinking` après le prebuild, sinon la compilation échoue (« package com.tentacode.pilbo.dev does not exist »).
