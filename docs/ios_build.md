# Build iOS

## Prérequis

- Node, npm, Xcode, CocoaPods, Watchman.
- `npm install` à la racine.
- Xcode → Settings → Accounts : Apple ID connecté.
- Signing : `ios/Pilbo.xcworkspace` → target Pilbo → Signing & Capabilities → "Automatically manage signing" + Team "(Personal Team)".

`ios/` est généré par Expo (non versionné). Pour le régénérer : `npx expo prebuild --clean`, puis refaire le signing.

## Simulateur

```bash
npx expo run:ios
```

## iPhone — Debug (avec Metro)

```bash
npx expo run:ios --device
```

- iPhone branché en USB (la 1re fois), Mac et iPhone sur le même Wi-Fi.
- Metro doit tourner (`npx expo start` si besoin).

## iPhone — Release (sans Metro)

```bash
npx expo run:ios --device --configuration Release
```

## Expiration (compte gratuit)

L'app expire tous les 7 jours → relancer la commande de build.

## Problèmes fréquents

- **Erreur de signing / "No profiles found"** : vérifier le Team dans Xcode, ou changer `ios.bundleIdentifier` si l'identifiant est déjà pris.
- **"Développeur non approuvé"** : iPhone → Réglages → Général → VPN et gestion de l'appareil → faire confiance au profil.
- **Appareil non proposé / build refusé** : iPhone → Réglages → Confidentialité et sécurité → Mode développeur → activer (redémarrage).
- **Écran "No development servers found"** : Metro ne tourne pas ou pas le même Wi-Fi.
