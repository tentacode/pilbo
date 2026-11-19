# Améliorations du site github pages

Aujourd'hui le site github pages est principalement utilisé pour les pages légales et mettre les liens de la bêta.

J'aimerais que ça devienne plus un site vitrine, avec une présentation rapide de l'app et de ses fonctionnalités, captures à l'appui (qui peuvent être réutilisé depuis les dossiers qui servent à l'app store, ou ajouter au générateur). La page bêta doit être succinte et proposer un lien iPhone et Android (aujourd'hui c'est Android uniquement).

Quand l'app sera sur les stores on mettra plus en avant la disponibilité sur les stores depuis la page d'accueil, et plus discrêtement (voir cachés) les liens vers la bêta.

## Détail des changements

- Layout : un layout plus complet que le simple rendu d'une page de texte
- Home page : header hero, lien vers la page bêta.
- Home page : description des features avec capture d'écran.
- Home page : de nouveau CTA lien vers la page bêta.
- Page bêta : lien retour vers la home page, description de la bêta, donnez votre avis etc., deux sections iOS et Android, avec chacun les steps nécessaire et un CTA vers la bêta
- Footer : un mailto contactez-nous vers "pilbo@tentacode.dev".
- Boutons apps : pour chaque boutons app, reprendre les logo iOS et Android.
- i18n : toujours dispo en Anglais ou en Français.
- Design : pas de dark mode, trop pénible à géré deux variations, on se concentre pour faire une belle variation claire.
- Design : cohérent par rapport à l'app, avenant, bienveillant, casual mais pas trop.
- Design : pourquoi pas réutiliser le fond avec plein de pillules comme on as sur le splash screen.

- Toute autres suggestions de ta part

## Tâches

- [ ] Rendre possible le test du site en local via `make preview-github-pages` (ou une autre solution si c'est déjà possible)
- [ ] Fond de pilules dans `make artwork`
- [ ] Layout et homepage
- [ ] Page bêta
- [ ] Page support et page confidentialité

## Décisions

### Génération et aperçu local

- Script Node maison, sans dépendance : gabarits HTML et textes FR/EN (JSON) dans `website/src/`, sortie générée dans `website/dist/` (non versionnée). Le layout (header, footer) n'est écrit qu'une fois.
- Le workflow GitHub Pages (`.github/workflows/website.yaml`) lance la génération puis déploie `website/dist/`.
- `make preview-github-pages` : génère le site, le sert en local et le régénère à chaque modification.

### Page bêta

- iOS : 1. installer TestFlight (App Store), 2. lien public TestFlight `https://testflight.apple.com/join/VTZ7Nr2P`.
- Android : les deux étapes actuelles (rejoindre le groupe Google `https://groups.google.com/g/pilbo-beta`, puis s'inscrire au test `https://play.google.com/apps/testing/com.tentacode.pilbo`).

### Captures

- Captures iPhone brutes, en FR et en EN, affichées dans un contour de téléphone dessiné en CSS, copiées en WebP réduit dans le site.
- Les captures EN manquantes (`store/screenshots/screenshots/en/`) sont à prendre sur le simulateur, selon la procédure de `store/screenshots/README.md`.

### Design

- Fond de pilules : nouvelle sortie SVG au format large dans `scripts/generateArtwork.mjs` (même graine et mêmes pilules que le splash), réglable dans `assets/artwork/config.ts`. Utilisé uniquement derrière le hero.
- Boutons d'app : au style du site, avec le logo Apple ou Android en SVG inline et un texte libre. Pas de badges officiels des stores (réservés à la sortie publique, hors périmètre).
- Icône par fonctionnalité, reprise des icônes de l'app (`src/design-system/components/Icon/iconShapes.tsx`).

### Pages

- Support : nouvelle page `/support/` reprenant le contenu actuel de la home (contact, conseils). L'URL de support est à changer dans App Store Connect et dans la Play Console (action manuelle).
- Confidentialité : passe dans le nouveau layout, contenu inchangé.

### Suggestions retenues

- Aperçu de partage : balises Open Graph / Twitter, avec le feature graphic généré par `make artwork` comme image.
- Vérification d'accessibilité : audit automatique (Lighthouse ou axe dans Chrome) de chaque page, en plus du contraste AA et de la navigation au clavier.

### Hors périmètre

- Mise en avant des stores après la sortie publique.
- Redirection automatique selon la langue du navigateur.
