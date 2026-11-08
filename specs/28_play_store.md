# Publication sur le Play Store

On publie Pilbo sur le Play Store, en français et en anglais, sur le modèle de la publication App Store (spec 25).

Spec à détailler : seules les grandes lignes sont posées.

## Prérequis

- Spec 17 faite : version Android au point, keystore de signature en place.
- Pages web de la spec 25 (support, confidentialité) en ligne, adaptées pour mentionner Android.

## Compte Google Play Console

- Compte développeur (25 $, paiement unique), vérification d'identité.
- Type de compte à décider : **personnel** (test fermé obligatoire, voir plus bas) ou **organisation** (entité légale + numéro D-U-N-S, sans test fermé obligatoire).

## Tests

### Test interne

- Jusqu'à 100 testeurs, sans revue, disponible en quelques minutes : l'équivalent de TestFlight pour les testeurs proches.

### Test fermé (compte personnel)

- Obligatoire avant l'accès à la production : au moins 12 testeurs inscrits pendant 14 jours d'affilée (règle à revérifier).
- Recrutement : entourage, puis échange de tests entre développeurs si besoin. Pas de service payant.
- Questionnaire d'accès à la production : recrutement, retours des testeurs, corrections faites.

## Build et envoi

- Build **AAB** (Android App Bundle) en Release, en plus de l'APK actuel.
- **Play App Signing** : Google garde la clé de distribution, le keystore actuel devient la clé d'importation.
- fastlane `supply` (équivalent de `deliver`), sur le modèle de `make testflight` :
  - numéro de version (`versionCode`) +1 automatique ;
  - envoi sur une piste (interne, fermée, production) ;
  - fiche dans `fastlane/metadata/android/<langue>/`.
- Nouvelles commandes `make` préfixées `android-` (noms à définir).

## Fiche Play Store

- Textes FR et EN : nom, description courte, description complète, notes de version. Même ton et même vocabulaire prudent que la spec 25.
- Médias : icône 512 × 512, image de présentation 1024 × 500, captures Android (automatisées avec Maestro, comme sur iOS).
- Catégorie : Médecine. Gratuite, sans achat intégré.

## Déclarations

- **Sécurité des données** : aucune donnée collectée ni partagée.
- **Classification du contenu** : questionnaire.
- **Politique de confidentialité** : URL des pages web.
- **Public cible** : adultes.
- **Alarmes exactes** : on tente `USE_EXACT_ALARM` (déjà en place, spec 17).
  - Déclaration dans la Play Console : les rappels à l'heure sont la fonction principale de Pilbo, un oubli de médicament peut mettre la santé en danger.
  - Politique officielle à relire au moment de détailler la spec (catégories autorisées : réveil, minuteur, agenda).
  - **Si Google refuse** : bascule sur `SCHEDULE_EXACT_ALARM` pour toutes les versions d'Android (permission accordée par l'utilisateur dans un écran système), avec un parcours dans l'app (onboarding et réglages, sur le modèle de la permission de notification) et le mode dégradé de la spec 17 si l'utilisateur refuse (rappels approximatifs).

## Sortie

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
- Test fermé validé, accès à la production obtenu.
- App acceptée par Google et publiée.
