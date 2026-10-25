# Thèmes

On veut un système de thèmes. Un thème change **tout** le visuel de l'app : couleurs, polices, formes, icônes, pilules, illustrations. Le thème actuel devient le thème par défaut « Pastel », gratuit. Les nouveaux thèmes (« Pixel », « Néon ») sont payants : c'est un soutien au projet avec une récompense (tip jar à 3 montants), et n'importe lequel des achats débloque tous les thèmes payants, actuels et futurs.

> ⚠️ **Spec à compléter** : l'écran « Soutenir pilbo » (design fait par moi) n'est pas encore décrit. Voir la section « À compléter ».

Le système doit permettre d'ajouter facilement un nouveau thème : un dossier par thème.

Pas de design existant : l'écran « Thèmes » et les nouveaux thèmes sont designés sur Claude Design, puis validés par moi.

## Fonctionnement

### Contenu d'un thème

| Élément                      | Thémable | Remarque                                                          |
| ---------------------------- | -------- | ----------------------------------------------------------------- |
| Couleurs                     | ✅       | Une palette par variante (claire, sombre)                         |
| Polices                      | ✅       | Les 4 rôles actuels : `regular`, `semiBold`, `bold`, `display`    |
| Rayons, bordures, ombres     | ✅       | `radius`, `borderWidth`, `shadow`                                 |
| Icônes                       | ✅       | Toutes les icônes de `Icon`                                       |
| Formes de pilules            | ✅       | Les 6 formes, la couleur choisie par l'utilisateur est respectée  |
| Illustrations                | ✅       | Onboarding, états vides, « tout est fait », en-tête               |
| Durées d'animation           | ✅       | Effets propres au thème (ex. lueur néon) : Reduce Motion respecté |
| Espacements, tailles, cibles | ❌       | Communs à tous les thèmes (mise en page, cibles de 44 pt)         |

### Variantes claire / sombre

- Un thème a au moins une variante : `light`, `dark`, ou les deux.
- Pastel a les deux (l'existant). Les nouveaux thèmes n'en ont qu'une (ex. Pixel en clair, Néon en sombre).
- Thème à une seule variante : le réglage « Apparence » est masqué, l'app (barre de statut, clavier, `Alert`…) est forcée dans cette variante.
- Thème à deux variantes : comportement actuel (suit iOS, ou le choix « Apparence »).

### Organisation

```
src/design-system/themes/
  theme.ts              // type Theme : le contrat que chaque thème respecte
  themeRegistry.ts      // liste des thèmes, gratuit ou payant
  pastel/
    index.ts            // assemble le thème
    light/colors.ts
    dark/colors.ts
    fonts.ts
    shapes.ts           // rayons, bordures, ombres
    icons/
    pills/
    illustrations/
    preview.png         // aperçu dans l'écran « Thèmes »
  pixel/
    light/colors.ts
    ...
  neon/
    dark/colors.ts
    ...
```

- Ajouter un thème = créer son dossier et l'ajouter au registre. TypeScript refuse un thème incomplet.
- Les illustrations quittent les features pour aller dans les thèmes. Les textes (libellés VoiceOver) restent dans les features.
- Seules les polices du thème actif sont chargées.

### Application du thème

- Le thème choisi est stocké dans `settingsStore` (`themeId`, persisté comme la langue, pas de flash au démarrage).
- Il est lu **au lancement**. Changer de thème recharge l'app (`reloadAppAsync`), après une confirmation (« L'app va redémarrer pour appliquer le thème »).
- Le passage clair / sombre à l'intérieur d'un thème reste en direct (comme aujourd'hui).

### Écran « Thèmes »

- Dans les réglages, une ligne « Thème » (avec le nom du thème actif) au-dessus de « Apparence », qui ouvre l'écran « Thèmes ».
- Une carte par thème : aperçu, nom, état (« Actif », « Gratuit », verrouillé).
- Toucher une carte débloquée : appliquer le thème. Toucher une carte verrouillée : ouvrir l'écran « Soutenir pilbo ».

### Soutenir pilbo

- Dans les réglages, un encart « Soutenez pilbo et débloquez des thèmes », avec un bouton qui ouvre l'écran « Soutenir pilbo ».
- L'écran « Soutenir pilbo » (aperçu des thèmes avant l'achat, 3 montants, « Restaurer les achats », erreurs) : **à compléter**, hors de cette version de la spec.

### Achat intégré

- Librairie : `expo-iap` (StoreKit 2).
- 3 achats **non consommables** : 1 €, 2 €, 5 € (montants ronds, disponibles dans la grille de prix Apple).
- N'importe lequel des 3 débloque tous les thèmes marqués payants dans le registre. Un thème ajouté plus tard est donc inclus automatiquement.
- On peut faire plusieurs achats (soutenir plusieurs fois), sans effet de plus sur les thèmes.
- Restauration des achats (obligatoire pour la validation Apple) : la logique est dans le scope, le bouton est sur l'écran « Soutenir pilbo ».
- Pas de backend : l'achat est vérifié par StoreKit (`currentEntitlements`) à chaque lancement.
- L'achat est lié à l'identifiant Apple : après suppression et réinstallation de l'app (ou sur un autre appareil), il est retrouvé sans racheter.
- L'état « acheté » est aussi gardé dans `settingsStore` pour appliquer le thème au lancement sans attendre StoreKit. Si l'achat n'est plus valide (remboursement), retour à Pastel au lancement suivant.
- Tests en local avec un fichier de configuration StoreKit (`.storekit`) dans Xcode, sur le simulateur.
- Section debug : « Débloquer tous les thèmes » (pour l'e2e et les tests sans achat).

### Accessibilité, pour chaque thème

- Contraste AA vérifié sur chaque paire texte / fond de chaque variante (test Jest, comme les tokens sombres).
- Polices lisibles en Dynamic Type, jusqu'aux plus grandes tailles, sans casser les mises en page (attention à la police pixel).
- Effets (lueur, scintillement) : désactivés avec Reduce Motion, jamais porteurs d'information seuls.
- Couleurs des médicaments (`pillSwatches`, couleur personnalisée) : identiques dans tous les thèmes, visibles sur tous les fonds.

## Étapes

Chaque étape se termine par `make tests` et une **validation par moi** avant la suivante.

1. **Contrat et extraction de Pastel** : `theme.ts`, `themeRegistry.ts`, dossier `pastel/` (couleurs, polices, formes, icônes, pilules, illustrations), composants branchés sur le thème actif. Aucun changement visible (captures avant / après identiques).
2. **Thème actif** : `themeId` dans `settingsStore`, application au lancement, rechargement, variantes (masquer « Apparence », forcer clair ou sombre). Testé avec un thème factice (copie de Pastel).
3. **Design de l'écran « Thèmes »** sur Claude Design → validation.
4. **Écran « Thèmes »** sans achat : ligne dans les réglages, cartes, application d'un thème, encart « Soutenez pilbo et débloquez des thèmes » (bouton vers une route vide pour l'instant), section debug « Débloquer tous les thèmes ».
5. **Design du thème Pixel** sur Claude Design (palette, polices, formes, icônes, pilules, illustrations) → validation.
6. **Intégration de Pixel**, validée écran par écran (comme la spec dark mode) : navigation et design-system, Aujourd'hui, Pilulier, Médicament, Stocks, Réglages, Onboarding.
7. **Design du thème Néon** → validation.
8. **Intégration de Néon**, validée écran par écran.
9. **Achat intégré, logique seule** : `expo-iap`, fichier `.storekit` (3 produits), achat, restauration, vérification au lancement, erreurs. L'interface d'achat attend que la section « À compléter » soit remplie.
10. **Documentation** : `docs/architecture.md` (ajouter un thème, utiliser le thème dans un composant), `CLAUDE.md` après validation.

## Tests

- Jest : registre (thèmes complets), résolution du thème et de la variante, déblocage de tous les thèmes payants par chacun des 3 achats, retour à Pastel si l'achat n'est plus valide, contrastes AA de chaque variante, logique d'achat (StoreKit mocké).
- Maestro : débloquer via le debug, changer de thème, vérifier que l'app reste utilisable.
- iPhone : vérification visuelle de chaque thème, VoiceOver sur l'écran « Thèmes », texte agrandi.

## À compléter

- **Écran « Soutenir pilbo »** : design (fait par moi), lien vers le design, contenu (aperçu des thèmes, 3 montants, texte de soutien, « Restaurer les achats », remerciement après l'achat, erreurs). Tant que cette section est vide, l'étape 9 s'arrête à la logique.

## Hors scope

- Vente réelle sur l'App Store (compte Apple Developer payant, produits dans App Store Connect) : spec à part.
- Variante sombre de Pixel et variante claire de Néon.
- Icône d'app par thème.
- Personnalisation d'un thème par l'utilisateur.
- Widget (il devra suivre le thème, spec à part).
- Notifications (rendues par iOS).
- Migration ou rétrocompatibilité.
