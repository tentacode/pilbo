# Spec 37 — Site vitrine GitHub Pages

## Contexte

Le site `website/` (HTML écrit à la main et dupliqué FR/EN) devient un site vitrine : layout commun, home avec hero, fonctionnalités et captures, page bêta iOS + Android, page support séparée. Le site est généré par un script Node sans dépendance, et il n'a pas de mode sombre. Spec et décisions : `specs/37_better_github_pages.md`.

Fichiers utiles :

- Site actuel : `website/index.html`, `website/beta/`, `website/privacy/`, `website/fr/…`, `website/styles.css`, `website/fonts/`, `website/icon.png`.
- Déploiement : `.github/workflows/website.yaml`.
- Artwork : `scripts/generateArtwork.mjs`, `assets/artwork/config.ts` (`make artwork`).
- Captures : `store/screenshots/README.md` (procédure), `store/screenshots/screenshots/<langue>/`.
- Couleurs et icônes de l'app : `src/design-system/tokens.ts`, `src/design-system/components/Icon/iconShapes.tsx`.
- Ton des textes : section « Ton de l'app » de `CLAUDE.md`.

## Étape 1 — Générateur et aperçu local

- Déplacer les sources dans `website/src/` :
  - [x] `layout.html` : `<head>` (titre, description, `hreflang`, Open Graph / Twitter), header (marque, lien de langue), `<main>`, footer (navigation, mailto « Contactez-nous » vers `pilbo@tentacode.dev`, mention « pas un dispositif médical »).
  - [x] Une page par fichier : `pages/index.html`, `pages/beta.html`, `pages/support.html`, `pages/privacy.html`.
  - [x] Textes : `locales/en.json`, `locales/fr.json` (clés communes, contenu de la page confidentialité compris).
  - [x] Ressources statiques (`styles.css`, `fonts/`, `icon.png`, images) dans `website/src/static/` (ou équivalent), copiées telles quelles.
- [x] Script `website/build.mjs` (Node, sans dépendance) :
  - remplacement simple de variables et d'inclusions (`{{clé}}`, `{{> partiel}}`) ;
  - EN à la racine, FR sous `fr/`, mêmes chemins qu'aujourd'hui (`/`, `/beta/`, `/privacy/`, `/fr/…`) plus `/support/` et `/fr/support/` ;
  - chemins relatifs corrects selon la profondeur de la page ;
  - échec (code de sortie ≠ 0) si une clé manque dans une langue.
- [x] Sortie dans `website/dist/` (déjà ignoré par `dist/` dans `.gitignore`, à vérifier).
- [x] Script `website/preview.mjs` : génère, sert `dist/` avec `node:http` (les URLs en `dossier/` servent `index.html`), régénère à chaque modification de `website/src/` (`fs.watch`).
- [x] `Makefile` : cibles `build-github-pages` et `preview-github-pages`, avec leur ligne `## …` pour `make help`.
- [x] `.github/workflows/website.yaml` : installer Node (`actions/setup-node`), lancer `node website/build.mjs`, déployer `website/dist`. Le filtre `paths` reste `website/**`.
- [x] Vérifier que ESLint et Prettier couvrent les nouveaux scripts sans erreur (`make tests`).
- [x] À ce stade, le site généré est identique à l'actuel (même contenu), consultable avec `make preview-github-pages`. (Étape fusionnée avec la refonte : le contenu actuel a été repris directement dans le nouveau layout.)

## Étape 2 — Fond de pilules (`make artwork`)

- [x] `assets/artwork/config.ts` : nouvelle entrée `websiteHero` (type `ArtworkLayout`, sans grande capsule ou avec, à juger visuellement), documentée comme les autres.
- [x] `scripts/generateArtwork.mjs` : fonction `websiteHero()` sur le modèle de `featureGraphic()` (format large, même graine, mêmes pilules). Écrire `assets/artwork/website-hero.svg` et le copier dans les ressources statiques du site.
- [x] Copier aussi `featureGraphic.png` (déjà généré dans `fastlane/metadata/android/<langue>/images/`) dans les ressources du site, comme image d'aperçu de partage.
- [x] `make artwork`, puis vérifier que l'icône, le splash et le feature graphic n'ont pas changé (`git diff --stat assets/ fastlane/`).

## Étape 3 — Captures EN

- [x] Prendre les captures EN manquantes sur le simulateur iPhone 17 Pro Max selon `store/screenshots/README.md` (langue de l'app en anglais, barre d'état propre), dans `store/screenshots/screenshots/en/`.
  - [x] Les captures FR montraient l'ancienne app (onglet « Stock ») : FR et EN reprises sur l'app actuelle (ta décision).
  - [x] Fixtures neutres (Magnésium, Vitamine D, Fer, Mélatonine, Paracétamol) à la place des vrais médicaments (ta décision) : `src/shared/database/fixtures.ts`, flows e2e, `docs/notifications.md` et 33 suites Jest adaptés.
  - [x] Procédure complétée dans `store/screenshots/README.md` (noms anglais, `03-pillbox`, `make github-pages-screenshots`).
- [x] Convertir les captures FR et EN pour le site avec `magick` : WebP, largeur réduite (environ 600 px), dans `static/screenshots/<langue>/` (script `website/screenshots.mjs`, `make github-pages-screenshots`).

## Étape 4 — Layout et home

- [x] `styles.css` : supprimer le mode sombre (`color-scheme: light`, retrait du bloc `prefers-color-scheme: dark`), couleurs reprises de `tokens.ts` (thème clair), tokens en variables CSS (couleurs, espacements, rayons, tailles de police).
- [x] Layout plus large que la colonne actuelle de 42rem pour la home (hero, grille de fonctionnalités), responsive jusqu'à 320 px de large, sans défilement horizontal.
- [x] Composant bouton d'app : bouton au style du site, logo Apple ou Android en SVG inline (`aria-hidden`), texte libre, zone tactile ≥ 44 px.
- [x] Contour de téléphone en CSS autour des captures (`<img>` avec `alt` descriptif, `width` / `height` pour éviter les sauts, `loading="lazy"` sauf la première).
- [x] Home :
  - [x] Hero sur le fond de pilules : titre, accroche, CTA vers la page bêta.
  - [x] Fonctionnalités (pilulier, rappels, apparence des pilules, stocks, calendrier, confidentialité, accessibilité) : icône reprise de `iconShapes.tsx` (SVG inline, `aria-hidden`), texte court, capture associée quand il y en a une.
  - [x] Nouveau CTA vers la page bêta en bas de page.
- [x] Textes FR et EN au ton de l'app (vouvoiement, phrases courtes, suggestions).
- [x] Balises Open Graph / Twitter (titre, description, image = feature graphic, URL) sur chaque page.
- [x] Animations éventuelles désactivées sous `prefers-reduced-motion: reduce`.

## Étape 5 — Page bêta

- [x] Lien retour vers la home.
- [x] Courte description de la bêta et invitation à donner son avis (mailto).
- [x] Section iOS : 1. installer TestFlight depuis l'App Store, 2. bouton vers `https://testflight.apple.com/join/VTZ7Nr2P`.
- [x] Section Android : 1. rejoindre le groupe Google, 2. s'inscrire au test du Play Store (liens dans la spec), avec les remarques actuelles (même compte Google, délai de quelques minutes).

## Étape 6 — Pages support et confidentialité

- [x] `/support/` (FR et EN) : contenu actuel de la section « Besoin d'aide ? » de la home (contact, conseils pour décrire un problème).
- [x] `/privacy/` : nouveau layout, contenu et date inchangés.
- [x] Navigation du footer : Accueil, Bêta, Support, Confidentialité, avec `aria-current="page"`.
- [x] Rappeler dans le message final de changer l'URL de support dans App Store Connect et dans la Play Console (action manuelle de ta part).

## Étape 7 — Vérifications

- [x] Toutes les pages en FR et en EN via `make preview-github-pages`, sans lien cassé (liens internes, ressources, changement de langue sur chaque page).
- [x] Rendu en 375 px (iPhone 12 mini), en largeur intermédiaire et sur ordinateur, captures d'écran à l'appui (Chrome).
- [x] Zoom du texte à 200 % sans casser la mise en page (vérifié en largeur 320 px, équivalent 400 %).
- [x] Contraste AA de tous les textes, y compris sur le fond de pilules.
- [ ] Navigation au clavier : ordre logique, focus visible. (Lien d'évitement, focus visible et ordre du DOM en place ; test interactif à faire : extension Chrome non connectée.)
- [ ] Audit d'accessibilité automatique (Lighthouse ou axe dans Chrome) sur chaque page, problèmes corrigés. (Bloqué : extension Chrome non connectée. Contrastes calculés : tous AA.)
- [x] Aperçu de partage vérifié (balises présentes, image en URL absolue ; accessible une fois déployé).

## Étape 8 — Fin

- [x] `make tests` passe.
- [x] Mettre à jour `docs/architecture.md` (ligne `website/`) et la section « Textes » de `docs/make_a_beta.md` (textes du site dans `website/src/locales/`).
- [x] Proposer une mise à jour de `CLAUDE.md` (pages web : génération, `make preview-github-pages`) après ta validation seulement.
