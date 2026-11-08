# Android

On veut rendre Pilbo compatible avec les téléphones Android, sans rien changer à la version iOS.

Il n'y a pas de design spécifique : on garde le design actuel, en utilisant les composants natifs Android là où iOS utilise des composants natifs iOS.

## Fonctionnement

### Version iOS identique

La version iOS ne doit pas changer, ni visuellement, ni dans son comportement.

- Le code propre à une plateforme passe par des fichiers séparés (`Component.ios.tsx` / `Component.android.tsx`) plutôt que par des conditions `Platform.OS` dispersées dans le code.
- Les tests Jest et Maestro iOS existants doivent continuer de passer.

### Couleurs

- `DynamicColorIOS` n'existe pas sur Android : toutes les couleurs passent par `createThemedStyles` / `useThemeColors`, sur les deux plateformes.

### Configuration et build

- Environnement Android vérifié et mis à jour (Android Studio, SDK, émulateur, Java).
- Section `android` dans `app.config.ts` : identifiant du package, icône adaptative, permissions.
- Les plugins iOS (`withoutPushEntitlement`, `withSqliteHeader`) ne doivent pas casser le build Android.
- Nouvelles commandes dans le `Makefile` : build sur émulateur, build sur téléphone, build Release (APK installable directement).
- `make clean` régénère les deux projets natifs.

### Composants propres à iOS

- **Sélecteur d'heure** (`IntakeTimeRow`, SwiftUI) : équivalent Android natif (Material).
- **Menu d'actions** d'un médicament (`useMedRowActionSheet`, `ActionSheetIOS`) : équivalent Android.
- **Modales** (`presentation: "modal"`) : elles s'affichent en plein écran sur Android, c'est acceptable.
- **Bouton retour** Android : il doit se comporter comme le geste de fermeture iOS, avec la modale « abandonner les modifications » si des changements ne sont pas enregistrés.

### Notifications

Les rappels et les alertes de stock doivent fonctionner comme sur iOS.

- Canaux de notification Android, avec le son `beep.wav`.
- Permission de notification (Android 13 et plus), avec le même parcours que sur iOS (onboarding, réglages).
- Alarmes exactes (Android 12 et plus), pour que les rappels ne soient pas retardés par l'économie d'énergie.
- Les rappels ne doivent pas être bloqués par l'économie d'énergie du fabricant (ex. « applis en veille » Samsung) : à vérifier sur un vrai téléphone.
- Les rappels doivent survivre au redémarrage du téléphone.
- La pastille sur l'icône dépend du fabricant : pas d'effort particulier si elle ne s'affiche pas.

### Affichage

- Affichage bord à bord : zones de sécurité, barre d'état, barre de navigation Android, clavier.
- Rendu visuel à vérifier écran par écran : ombres, polices, hauteurs de ligne, petits écrans.
- Retours haptiques : on garde `expo-haptics`, le rendu variera selon les téléphones.

### Accessibilité

Mêmes exigences que sur iOS (WCAG AA) :

- TalkBack (lecteur d'écran Android) sur tous les écrans.
- Taille de police système respectée sans casser les écrans.
- Réduction des animations respectée.

### Assurance qualité

- Jest : tests des comportements propres à Android (composants et fichiers `.android`).
- Maestro : les flows `e2e/` passent aussi sur un émulateur Android (adaptés si besoin, par exemple pour les dialogues de permission).
- Vérifications sur un vrai téléphone Android.

## Hors scope

- Widget Android : à prévoir dans une spec séparée, comme le widget iOS (spec 24).
- Publication sur le Play Store.
- Design propre à Android (Material Design complet) : on garde le design de Pilbo.

## Décisions

### Règles de code

- Rendu et comportement iOS inchangés, mais le code iOS existant peut être modifié (pas seulement renommé).
- Un comportement propre à une plateforme passe par des fichiers `.ios.ts(x)` / `.android.ts(x)` (avec un fichier vide ou sans effet sur l'autre plateforme si besoin, ex. création des canaux). Jamais de `Platform.OS`.
- Un ajout sans effet sur iOS (ex. `channelId` dans le contenu d'une notification) va directement dans le code partagé.

### Couleurs

- **Première étape, avant tout le reste** : migration de tous les `colors.*` (~175 usages, ~69 fichiers) vers `createThemedStyles` (fichiers `*.styles.ts`) et `useThemeColors` (couleurs passées en props : `Icon`, SVG).
  - Les tables de constantes définies hors composant (ex. `dayStatusAppearances.ts`, `IntakeStatusLabel.tsx`) stockent le nom de la couleur (ex. `"successInk"`), résolu dans le composant.
  - Suppression de `colors` et de `DynamicColorIOS` dans `tokens.ts`.
  - La règle ESLint actuelle (pas de `colors` sur bordures, contours, ombres) devient « pas de `colors` du tout ».
  - `docs/architecture.md` mis à jour.
  - Vérifiée sur l'iPhone (clair, sombre, thème choisi dans l'app) avant de commencer Android.

### Versions et appareils

- **Android 11 minimum** (API 30, `minSdkVersion`).
  - Android 11 et 12 ne sont pas testés : mode dégradé accepté (pas de popup de permission, la notification est autorisée d'office ; rappels approximatifs si l'utilisateur révoque les alarmes exactes sur Android 12).
- `targetSdkVersion` et `compileSdkVersion` : ceux d'Expo SDK 57 (Android 16, API 36). Pas de forçage vers Android 17 (bibliothèques non validées) : ça viendra avec une prochaine version d'Expo.
- Appareils de test :
  - **Émulateur sous Android 17** (dev, Maestro).
  - **Samsung Galaxy S9, Android 13, One UI 5.1** (notifications, alarmes exactes, redémarrage, TalkBack, APK Release). Identifiant dans `.env` (`ANDROID_DEVICE_ID`).

### Environnement

- Première étape Android : vérifier et mettre à jour l'environnement.
  - Android Studio à jour (actuellement 2024.1).
  - SDK Platform 36 et build-tools 36 (actuellement 33 et 34 seulement).
  - Image d'émulateur Android 17.
  - `ANDROID_HOME`, `adb` et `emulator` dans le PATH.
  - `JAVA_HOME` sur Java 17 (Zulu 17 installé, Java 23 par défaut).
- `make install` vérifie l'environnement Android (SDK, Java 17).
- Tout est documenté dans `docs/android_build.md` (équivalent de `docs/ios_build.md`).

### Configuration et build

- Deux variantes comme sur iOS, choisies par `APP_VARIANT` :
  - « Pilbo Dev » : `com.tentacode.pilbo.dev`, icône DEV, données de test.
  - « Pilbo » : `com.tentacode.pilbo`.
- Icône adaptative : `make artwork` génère les calques (fond = motif de petites pilules, avant-plan = grosse gélule dans la zone sûre, variante DEV avec bandeau dans la zone sûre).
- Splash Android : fond et image centrée (le plein écran d'iOS n'existe pas avec l'API de splash d'Android 12+).
- Commandes `make` préfixées, commandes iOS inchangées :
  - `make android-build-emulator` : « Pilbo Dev » en Debug sur l'émulateur.
  - `make android-build-device` : « Pilbo Dev » en Debug sur le téléphone (`ANDROID_DEVICE_ID`).
  - `make android-build-release` : « Pilbo » en Release, APK installé sur le téléphone, chemin de l'APK affiché.
- Signature du Release : **vraie clé** (keystore), générée une fois, hors du repo (comme le `.p8`), chemin et mots de passe dans `.env`, injectée par un plugin de config (survit à `prebuild --clean`).
  - `docs/android_build.md` détaille clairement : génération, sauvegarde (où et quoi sauvegarder), restauration après un `git clone` ou sur une nouvelle machine.
  - Sans cette clé, impossible de mettre à jour l'app installée sans la désinstaller (perte des données).

### Composants propres à iOS

- **Sélecteur d'heure** : un bouton affiche l'heure, l'appui ouvre le dialogue d'horloge Material d'Android. Lib : `@expo/ui/jetpack-compose` si elle le permet, sinon `@react-native-community/datetimepicker`.
- **Menu d'actions** : dialogue natif `Alert.alert`, avec le nom du médicament en titre et 3 boutons (Modifier le médicament, Retirer de la prise, Annuler).

### Notifications

- Deux canaux, avec des noms traduits (i18n) et le son `beep.wav` :
  - « Rappels de prise » : importance haute (bannière), équivalent de `timeSensitive`.
  - « Stock bas » : importance normale, équivalent de `active`.
- Alarmes exactes : `USE_EXACT_ALARM` (Android 13 et plus, accordée d'office aux applis de rappels), `SCHEDULE_EXACT_ALARM` limité à Android 12 (`maxSdkVersion` 32).
- Économie d'énergie des fabricants (ex. « applis en veille » Samsung) : rien dans l'app. Test d'une nuit sur le S9 (app fermée, écran éteint). Si les rappels sont bloqués, on en reparle.

### Assurance qualité

- Jest reste en iOS pour toute la suite existante.
- Un projet Jest `android` (preset `jest-expo/android`) limité aux fichiers `*.android.spec.ts(x)`, pour les composants et fichiers propres à Android.
- Maestro : flows `e2e/` sur l'émulateur Android 17.
