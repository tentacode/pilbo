# Publication sur l'App Store

On publie Pilbo sur l'App Store, en français et en anglais, avec une fiche complète : description, captures et déclarations (confidentialité, accessibilité).

## Prérequis

- Spec 23 faite : compte payant, fastlane, `make testflight`, app créée dans App Store Connect.

## Fiche App Store

### Textes (FR et EN)

- Nom (30 caractères max), sous-titre (30), description, mots-clés (100), texte promotionnel (170, modifiable sans nouvelle version).
- Notes de version (« Nouveautés ») pour chaque version.
- Ton de l'app (voir `CLAUDE.md`) : « vous », phrases courtes.
- Vocabulaire prudent : un pilulier et des rappels, pas de conseil médical, pas de promesse de santé.

### Fichiers dans le repo

- La fiche est gérée par fastlane (`deliver`) dans `fastlane/metadata/<langue>/` (`fr-FR`, `en-US`) : un fichier texte par champ.
- `make app-store-metadata` envoie les textes et les captures, sans envoyer de build.
- `make app-store-release` envoie la fiche, choisit le dernier build TestFlight et le soumet à la revue d'Apple.

### Nom de l'app sur l'iPhone

- Nom affiché, et textes des demandes d'autorisation iOS (notifications) traduits en FR et en EN (`locales` dans la config Expo).

### Catégorie et prix

- Catégorie principale : **Médecine**. Catégorie secondaire : Santé et forme.
- Gratuite, sans achat intégré.

## Pages web

- **Politique de confidentialité** (URL obligatoire) et **page de support** (URL obligatoire), en FR et en EN.
- Contenu de la politique : aucune donnée collectée, tout reste sur l'iPhone, pas de compte, pas de publicité, pas de suivi.
- Hébergement : **GitHub Pages** (le repo est public).
  - Pages HTML statiques dans `website/` (`docs/` est déjà pris par la documentation technique).
  - Déployées par un workflow GitHub Actions à chaque push sur `main` qui modifie `website/`.
  - URLs : `https://tentacode.github.io/pilbo/` (support), `…/privacy/` (confidentialité), avec une version FR et une version EN.
  - Pages accessibles (WCAG AA), dans les couleurs de l'app.

## Déclarations dans App Store Connect

### Confidentialité

- « Aucune donnée collectée ».

### Accessibilité

Déclarer les fonctions prises en charge (Accessibility Nutrition Labels). Chaque fonction cochée doit être vérifiée sur l'iPhone avant :

- VoiceOver ;
- Contrôle vocal ;
- Texte plus grand ;
- Interface sombre ;
- Contraste suffisant ;
- Différenciation sans couleur ;
- Réduction des animations.

Les fonctions non vérifiées ne sont pas cochées. Une vérification qui échoue devient une correction à faire avant la publication, dans le scope de cette spec si elle est petite, sinon on en parle.

### Âge

- Questionnaire de classification par âge : pas de contenu sensible, mention des informations médicales si demandé.

### Statut professionnel dans l'UE (DSA)

- Obligatoire pour être distribué dans l'UE : **non-trader** (particulier, app gratuite, sans achat intégré).
- Les achats intégrés (cosmétiques, pour soutenir l'app) viendront dans une spec séparée, avec le passage en **trader** : contrat « Paid Apps », infos bancaires et fiscales, coordonnées publiques (adresse de domiciliation ou boîte postale, numéro dédié).

## Médias

### Icône

- Icône 1024 × 1024 sans transparence (déjà dans `assets/images/icon.png`, à vérifier).

### Captures

- Gabarits déjà prêts dans `store/screenshots/` (6 images, FR et EN, format 6,9").
- Captures de l'app automatisées avec des flows Maestro (un par image), sur le simulateur iPhone 17 Pro Max, avec les données de test.
- `make app-store-screenshots` : captures dans les deux langues, puis génération des images finales (`render.mjs`).
- iPhone uniquement (pas d'iPad).

## Revue d'Apple

- Notes pour l'équipe de revue : pas de compte, pas de connexion, l'app fonctionne hors ligne, comment ajouter un médicament.
- Coordonnées de contact pour la revue.

## Sortie

- Pays : tous.
- Sortie manuelle après acceptation par Apple (vous choisissez le moment).
- Mises à jour : `make version-bump`, `make testflight`, notes de version FR/EN, `make app-store-release`.

## Hors scope

- iPad, Android.
- Achats intégrés (spec séparée, avec le passage en trader), abonnement.
- Écran « Nouveautés » dans l'app après une mise à jour.
- Vidéo de présentation (les captures suffisent pour l'instant).
- Pages de produit personnalisées, événements in-app.

## Assurance qualité

- `make tests` passe.
- Fiche complète dans App Store Connect, en FR et en EN, sans erreur de validation.
- Captures vérifiées dans les deux langues.
- Chaque fonction d'accessibilité déclarée vérifiée sur l'iPhone.
- App acceptée par Apple et publiée.
