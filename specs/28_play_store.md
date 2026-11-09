# Publication sur le Play Store

On publie Pilbo sur le Play Store, en français et en anglais, sur le modèle de la publication App Store (spec 25).

Spec à détailler : seules les grandes lignes sont posées.

## Prérequis

- Spec 29 faite : compte Play Console, `make android-beta`, test fermé lancé avec au moins 12 testeurs pendant 14 jours.
- Pages web de la spec 25 (support, confidentialité) en ligne, adaptées pour mentionner Android.

## Accès à la production

- Questionnaire de la Play Console, à la fin des 14 jours de test fermé : recrutement, retours des testeurs, corrections faites.

## Fiche Play Store

- Version finale de la fiche minimale de la spec 29.
- Textes FR et EN : nom, description courte, description complète, notes de version. Même ton et même vocabulaire prudent que la spec 25.
- Médias : icône 512 × 512, image de présentation 1024 × 500, captures Android (automatisées avec Maestro, comme sur iOS).
- Catégorie : Médecine. Gratuite, sans achat intégré.
- Fiche dans `fastlane/metadata/android/<langue>/`, envoyée par fastlane `supply`.

## Déclarations

- Déclarations de la spec 29 relues pour la production.
- **Alarmes exactes** : on tente `USE_EXACT_ALARM` (déjà en place, spec 17).
  - Déclaration dans la Play Console : les rappels à l'heure sont la fonction principale de Pilbo, un oubli de médicament peut mettre la santé en danger.
  - Politique officielle à relire au moment de détailler la spec (catégories autorisées : réveil, minuteur, agenda).
  - **Si Google refuse** : bascule sur `SCHEDULE_EXACT_ALARM` pour toutes les versions d'Android (permission accordée par l'utilisateur dans un écran système), avec un parcours dans l'app (onboarding et réglages, sur le modèle de la permission de notification) et le mode dégradé de la spec 17 si l'utilisateur refuse (rappels approximatifs).

## Sortie

- Nouvelle piste `production` pour `make android-beta` (ou commande dédiée, à décider).
- Revue de Google, puis sortie en production.
- Pays : tous.
- Déploiement progressif ou complet : à décider.

## Hors scope

- Achats intégrés (spec séparée).
- Widget Android.
- Tablettes, Wear OS, Android TV, Chromebook.
- Autres stores (F-Droid, Galaxy Store…).

## Assurance qualité

- `make tests` passe.
- Fiche complète en FR et en EN, sans erreur dans la Play Console.
- Accès à la production obtenu.
- App acceptée par Google et publiée.
