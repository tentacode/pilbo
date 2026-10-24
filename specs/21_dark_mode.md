# Dark mode

On veut un thème sombre. Par défaut, l'app suit le réglage iOS (clair / sombre). Un réglage dans l'app permet de forcer un thème, il a la priorité sur iOS (comme la langue).

Pas de design existant : les couleurs sombres sont proposées par Claude et validées par moi à l'exécution, écran par écran.

## Fonctionnement

### Réglage « Apparence »

- Dans les réglages, sous « Langue de l'app ».
- Contrôle segmenté à 2 options : « Clair », « Sombre » (comme `LanguageRow`).
- Tant que rien n'est choisi, l'app suit iOS et l'option correspondante est sélectionnée.
- Stocké dans `settingsStore` (`colorScheme: "light" | "dark" | null`, `null` = suit iOS), persisté comme la langue (pas de flash au démarrage).
- Pas de retour à « suivre iOS » une fois un thème choisi.
- Changement appliqué en live, sans redémarrage.
- Sans choix, un changement du réglage iOS (ou le mode auto du soir) s'applique en live.

### Thème

- `userInterfaceStyle: "automatic"` dans `app.config.ts`.
- Les tokens de couleur ont une version claire et une version sombre, avec les mêmes noms.
- Les composants lisent les couleurs via le thème courant (hook), plus via la constante statique.
- Barre de statut, clavier, sélecteur d'heure natif, `Alert` iOS : suivent le thème de l'app (même s'il est forcé).

### Couleurs sombres

- Fond violet très sombre (pas noir pur), texte lavande clair : on garde l'identité « lavande ».
- Les couleurs pastel (rose, beurre, turquoise, lavande) deviennent des teintes sombres désaturées pour les fonds, et restent claires pour les accents.
- États (pris, en retard, ignoré, stock bas, alerte) : même code couleur, adapté au fond sombre.
- Contraste AA vérifié sur chaque paire texte / fond (test Jest sur les tokens, avec `utils/color.ts`).

### Ce qui ne change pas

- Couleurs des médicaments (`pillSwatches`, `customColorWheel`, couleur personnalisée) : ce sont les vraies couleurs des pilules, identiques dans les deux thèmes. Un contour garantit leur visibilité sur fond sombre.
- Illustrations : mêmes dessins, traits et couleurs adaptés via les tokens si besoin.

## Validation écran par écran

Chaque écran est une étape du plan : passage au thème + couleurs sombres, puis **validation par moi** (captures simulateur) avant de passer au suivant.

1. Tokens et thème (palette sombre complète, réglage « Apparence »)
2. Navigation (onglets) et design-system
3. Aujourd'hui (+ jour passé, calendrier)
4. Pilulier, édition d'une prise
5. Médicament, apparence du médicament, choix d'un médicament
6. Stocks, édition d'un stock
7. Réglages
8. Onboarding, « Pas une application médicale », écran d'erreur

## Tests

- Jest : résolution du thème (choix app > système), réglage « Apparence », contrastes AA des tokens sombres.
- Maestro : un flow court (passer en « Sombre » dans les réglages, vérifier que l'app reste utilisable).
- iPhone : vérification visuelle, VoiceOver sur le réglage, texte agrandi.

## Documentation

- `docs/architecture.md` : comment utiliser les couleurs du thème dans un composant.
- `CLAUDE.md` (après validation) : règle « couleurs via le thème, jamais la constante statique ».

## Hors scope

- Thèmes personnalisés ou couleur d'accent au choix.
- Icône d'app sombre (iOS 18).
- Widget (spec à part, il devra suivre le thème iOS).
- Notifications (rendues par iOS).
- Migration ou rétrocompatibilité.
