# Pilbo

Pilbo (pour « Pill Box ») est une application iOS de pilulier : elle aide à suivre ses prises de médicaments, sans compte et sans serveur.

## Fonctionnalités

- **Prises** : plusieurs moments dans la journée, chacun avec ses médicaments et ses quantités, sur certains jours de la semaine.
- **Rappels** : une notification à l'heure de la prise, répétée jusqu'à ce que la prise soit validée.
- **Médicaments à la demande** : à prendre en dehors des prises, si besoin.
- **Stocks** : le stock diminue à chaque prise, avec une alerte avant d'en manquer.
- **Calendrier** : l'historique des prises, jour par jour.
- **Données 100 % locales** : tout reste sur le téléphone.
- Français et anglais, mode sombre, accessibilité (VoiceOver, Dynamic Type).

## Stack

React Native avec Expo (development builds), TypeScript, Expo Router, expo-sqlite + Drizzle ORM, expo-notifications, i18next, Jest et Maestro.

## Lancer le projet

Prérequis : macOS, Xcode, pnpm, ccache et Ruby (`brew install ccache ruby`, Ruby pour fastlane).

```sh
make install                # dépendances
cp .env.dist .env           # puis renseigner APPLE_TEAM_ID (et DEVICE_ID pour un iPhone)
make build-simulator        # build et lancement sur le simulateur
make tests                  # lint, prettier, TypeScript, Jest et audit
```

`make help` liste toutes les commandes. La documentation technique est dans [`docs/`](docs/).

## Avertissement

Pilbo n'est pas un dispositif médical. Elle est fournie sans aucune garantie et ne remplace pas l'avis d'un médecin ou d'un pharmacien.

## Licence

Le code source est disponible sous licence [PolyForm Noncommercial 1.0.0](LICENSE) : vous pouvez le lire, le modifier et le partager pour un usage non commercial. Tout usage commercial est interdit, y compris une app gratuite avec publicité ou achats intégrés.

Le nom « Pilbo » et l'icône de l'application ne sont pas couverts par la licence et restent réservés.

Pour contribuer, voir [`CONTRIBUTING.md`](CONTRIBUTING.md).
