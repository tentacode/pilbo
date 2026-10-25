# Captures App Store

Gabarits des images App Store de Pilbo : fond, titre, sous-titre, pilules décoratives et contour d'iPhone. **L'écran du téléphone est vide** : il est rempli avec les captures de l'app.

## Fichiers

| Fichier         | Rôle                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| `slides.js`     | Configuration : textes FR/EN, fond, mise en page, pilules, nom de la capture |
| `template.html` | Gabarit d'une image (1320 × 2868), piloté par l'URL                          |
| `render.mjs`    | Génère les PNG avec Chrome en headless (aucune dépendance npm)               |
| `preview.html`  | Aperçu de toutes les images, à ouvrir dans un navigateur                     |
| `screenshots/`  | Captures de l'app : `screenshots/<langue>/<capture>`                         |
| `output/`       | Images finales : `output/<langue>/01-today.png`…                             |
| `fonts/`        | Young Serif et Atkinson Hyperlegible Next (licence OFL)                      |

## Format

- Taille : **1320 × 2868** (iPhone 6,9", le seul format obligatoire, Apple le réduit pour les autres tailles).
- Captures attendues : même taille, prises sur le simulateur **iPhone 17 Pro Max** (ou 16 Pro Max).
- L'île dynamique est dessinée par le gabarit, par-dessus la capture.

## Les 6 images

| #   | `id`        | Capture            | Écran à capturer                                                   | Apparence |
| --- | ----------- | ------------------ | ------------------------------------------------------------------ | --------- |
| 1   | `today`     | `01-today.png`     | Aujourd'hui : une prise validée, une en retard, une à venir        | Claire    |
| 2   | `reminders` | `02-reminders.png` | Modification d'une prise, réglage « Répéter le rappel toutes les » | Claire    |
| 3   | `pills`     | `03-pills.png`     | Personnalisation d'une pilule (forme, couleurs)                    | Claire    |
| 4   | `stocks`    | `04-stocks.png`    | Stocks, avec une alerte de stock bas                               | Claire    |
| 5   | `calendar`  | `05-calendar.png`  | Calendrier du mois, avec des jours remplis                         | Claire    |
| 6   | `privacy`   | `06-privacy.png`   | Aujourd'hui                                                        | Sombre    |

## Procédure (pour Claude Code)

1. Démarrer le simulateur iPhone 17 Pro Max et installer l'app avec `EXPO_PUBLIC_DEBUG_MODE=true` (données de test, pas d'onboarding).
2. Barre d'état propre :
   ```sh
   xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3
   ```
3. Pour chaque langue (`fr`, `en`, réglage « Langue » de l'app) et chaque image du tableau :
   - naviguer vers l'écran (Maestro MCP) ;
   - apparence : `xcrun simctl ui booted appearance light` (ou `dark` pour l'image 6) ;
   - capturer :
     ```sh
     xcrun simctl io booted screenshot store/screenshots/screenshots/fr/01-today.png
     ```
4. Générer les images :
   ```sh
   node store/screenshots/render.mjs              # toutes les langues, toutes les images
   node store/screenshots/render.mjs --lang en    # une langue
   node store/screenshots/render.mjs --slide today,stocks
   node store/screenshots/render.mjs --empty      # contours seuls, dans output-empty/
   ```
   Le script s'arrête et liste les captures manquantes. Chrome est cherché dans `/Applications`, sinon `CHROME_PATH=/chemin/vers/chrome`.
5. Vérifier le résultat dans `output/`, ou ouvrir `preview.html`.

## Modifier

Tout se fait dans `slides.js` :

- `headline` / `subtitle` : textes par langue. `\n` force un retour à la ligne. Le titre est réduit automatiquement s'il est trop large.
- `layout` : `text-top` (texte au-dessus du téléphone) ou `text-bottom` (en dessous).
- `background` : `lavender`, `rose`, `butter`, `turquoise` ou `night` (sombre).
- `pills` : `shape` (`round`, `capsule`, `bicolor`), `color` (`white`, `butter`, `rose`, `roseStrong`, `lavender`, `skyBlue`, `turquoise`), `x` / `y` (centre, en px), `size`, `rotate`.
- Ajouter une image : ajouter une entrée dans `slides` (l'ordre du tableau donne la numérotation).
