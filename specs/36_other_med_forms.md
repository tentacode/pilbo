# Autres formes : sachet, tube, sirop, gouttes

Tous les médicaments ne sont pas des pilules. On ajoute 4 formes, dessinées dans Claude Design (« Composants » › « Autres formes, variante penchée ») : sachet, tube (pommade, gel), sirop et gouttes.

Elles s'ajoutent aux formes existantes dans l'écran Apparence et s'affichent partout où une pilule s'affiche. Elles ont, comme les pilules, une taille et deux couleurs.

On expérimente aussi leur ajout dans le splash screen et l'icône, à valider avant de le garder.

## Décisions

### Dessin

- Variante penchée du design, vers la droite : sachet 15°, tube 40°, sirop 25°, gouttes 30°.
- Le sirop reste à niveau dans le flacon penché, avec sa vague. La goutte tombe droite sous la pipette.

### Couleurs

| Forme   | Couleur 1                         | Couleur 2                                  |
| ------- | --------------------------------- | ------------------------------------------ |
| Sachet  | centre                            | les deux bords dentelés                    |
| Tube    | tube (corps et sertissage)        | bouchon                                    |
| Sirop   | liquide                           | flacon et bouchon                          |
| Gouttes | liquide dans la pipette et goutte | pipette entière : poire, collerette, verre |

### Couleurs par défaut du sirop et des gouttes

- Choisir le sirop ou les gouttes sur un médicament à une seule couleur passe en « Deux couleurs » : la couleur reste celle du liquide, la couleur 2 devient blanche. Sinon un flacon ou une pipette de la couleur du liquide ferait bizarre.
- Le sélecteur de forme les prévisualise déjà ainsi.
- L'aléatoire tire aussi une couleur 2 blanche pour ces deux formes.

### Dosage et unité

- Aucune unité liée à la forme (sachet, application, ml, gouttes) : le dosage reste en champ libre.

### Splash screen et icône

- Expérience : les 4 formes rejoignent les pilules du fond (couleur 2 blanche pour le sirop et les gouttes).
- La gélule héros reste telle quelle.
- À valider sur les images générées avant de garder.
- Résultat : non retenu dans un premier temps, on garde le splash et l'icône d'origine.

### Données

- Aucune migration : le design est stocké en JSON, seul le type des formes s'élargit.
