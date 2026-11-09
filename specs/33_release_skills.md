# Skills de préparation des livraisons

Préparer une bêta (TestFlight ou Play Store) demande plusieurs vérifications et des textes à rédiger : on en fait des skills Claude Code dans `.claude/skills/`, à côté de `review-spec-and-plan`.

## Principe : un brouillon à éditer

Dès qu'il y a du texte à écrire, le skill ne modifie pas directement les fichiers sources : il génère un brouillon.

- Un seul fichier, `release_draft.md` à la racine, ignoré par git.
- Formaté comme `checklist_android_fastlane.md` :
  - une section par texte ;
  - le texte en entier, FR et EN, dans des blocs ```text ;
  - le lien vers le fichier cible ;
  - le nombre de caractères et la limite (ex. 500 pour les notes « À tester »).
- J'édite le brouillon, puis je dis au skill que c'est bon. Il relit le brouillon, vérifie les limites et reporte les textes dans les fichiers sources.
- Rien n'est reporté ni envoyé avant ma validation.
- Après le report, le brouillon reste tel quel. La prochaine livraison l'écrase.

## `/prepare-release`

Le skill principal, qui fait les vérifications avant `make testflight` / `make android-beta`. Il ne lance jamais l'envoi.

Arguments : la plateforme (`ios`, `android` ou les deux), et une option `listing` pour vérifier la fiche des stores et le site.

### Étapes

1. **Point de départ** : le dernier tag git de livraison. Les tags viendront plus tard. En attendant, le skill me demande le commit de départ.
2. **Vérifications** :
   - `make tests`, puis les e2e (`make test-e2e`, `make android-test-e2e`) ;
   - la migration en cours conserve les données des testeurs (règle de `CLAUDE.md`) ;
   - `make i18n-extract` ne laisse pas de traduction manquante ;
   - proposer un `make version-bump` si les changements le justifient.
3. **Notes « À tester »** : comme `/beta-notes`.
4. **Option `listing`** : comparer avec les fonctionnalités livrées depuis le point de départ :
   - la fiche Play Store (`fastlane/metadata/android/<langue>/`) ;
   - la description TestFlight (`fastlane/beta_app_info/description/`) ;
   - les pages du site (`website/`), dont la date de la politique de confidentialité si elle change.

   Les textes à modifier vont dans le brouillon. Ce qui est déjà juste n'y figure pas.

5. **Captures**, à chaque livraison : refaire les captures FR et EN, et les montrer dans le brouillon (images markdown, avant / après) pour que je les vérifie.
6. **Validation du brouillon**, puis report dans les fichiers sources.
7. **Récapitulatif**, sans rien lancer :
   - les commandes d'envoi à lancer ;
   - le rappel `INTERNET` / `make clean` pour revenir à « Pilbo Dev » après un build « Pilbo » ;
   - le tag à poser (par moi, pas d'opération git par Claude).

## `/beta-notes`

Appelable seul, pour ne refaire que les notes « À tester ».

- Rédigées à partir des commits depuis le point de départ (même règle que `/prepare-release`), dans le ton de l'app.
- Ajoutées au brouillon, puis reportées après validation dans `fastlane/what_to_test/fr-FR.txt` et `en-US.txt` (500 caractères maximum).

## Captures des stores

Les scripts de capture, aujourd'hui temporaires, passent dans le repo (ex. `scripts/screenshots/`, avec une cible `make`).

- Les captures se font sur l'émulateur, pour avoir une taille d'écran fixe. C'est une exception à la règle « tester sur le téléphone ».
- Données de test anonymisées, horloge figée (20:24), barre d'état propre.
- Android seulement pour l'instant : `fastlane/metadata/android/<langue>/images/phoneScreenshots/`. Les captures iOS viendront avec l'App Store.

## Hors périmètre

- Les notes de version de production et la publication sur l'App Store (voir la spec 28 pour le Play Store).
- Les captures iOS.
- Les envois eux-mêmes : ils restent des commandes `make`, lancées par moi.
