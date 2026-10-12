# Pilbo, application mobile de gestion de médicaments

## Pitch

Pilbo (pour "Pill Box", et aussi une boutage par rapport à Bilbo Baggins), est une application de gestion de pillulier, pour l'instant sur iOS uniquement, totalement gratuite (à l'avenir on pourra acheter des cosmétiques).

Les principales fonctionnalités sont :

- Gestion des prises : à titre personnel, j'ai quatre moment où je dois prendre des médicaments, à chaque fois avec des médicaments différents. Pour m'aider je peux saisir des "prises" (wording à voir), par exemple une prise peut être "1 lithium 250mg et 1 lamictal 25mg" à 8h30, une autre prise "2 lithium 250mg et 1 lamictal 100mg" à 20h30. On peut définir une prise sur seulement certains jours (tous les jours sauf le weekend par exemple). Plus tard : les prises peuvent aussi avoir une récurrence plus souple, comme "une fois toutes les deux semaines".
- Notifications intelligentes : au lieu d'une alarrmes qu'on "snooze", on a des bips réguliers à l'heure d'une prise, par exemple toutes les 10 minutes (réglable par prise, défaut 10 minutes), les bips s'arrêtent quand on valide dans l'application, ou via un widget sur la home, qu'on a réellement pris le médicament. On peut aussi dans l'app dire "je ne prends pas le médicament sur cette prise" (il n'est pas décompté du stock).
- Possibilité de prendre certains médicaments "hors des prises", ex : anxiolytiques si besoin.
- Gestion des stocks : on peut aussi saisir des boites de médicaments (ou un nombre de médicaments) pour maintenir un état des stocks de ce qu'il nous reste. À chaque prise le stock diminue, et on a une alerte si le stock prévisionnel (en fonction des prises) d'un médicament sera épuisé, une semaine avant qu'il s'épuise (délai réglable par médicament, défaut une semaine).
- Personnalisation des pillules : l'utilisateur peut changer la fome, la taille et la couleur de chaque variante de médicament (ex : lithium 250mg, lamictal 25mg, lamictal 100mg) de façon poussée via un petit éditeur, ça permet de rendre l'expérience plus sympa, et aussi de voir en un coup d'oeil quels sont les médicaments concernés par une prise. Dans le futur on pourra debloquer des thèmes pour plus de customisation et soutenir l'application, par exemple : pixel art, pastel, neon, fantasy, etc.
- Bonus : pouvoir saisir des événements récurrents ne concernant pas les médicaments, exemple : prise de sang de lithiémie tout les mois, envoie une notification.

## Technologie

L'application est développée en React Native, pour l'instant seul une release iPhone est prévue.

L'application sera dès le départ disponible en Anglais et en Français, il faut prévoir l'internationalisation.

## Look & Feel

On ne veut PAS de look IA slop, généré par IA, ou autre.

Comme le thème sera dans le futur étendu à des variantes plus fun, il doit être suffisament générique, mais pas sans personalité.
