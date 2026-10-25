# Android

On veut rendre Pilbo compatible avec les téléphones Android, sans rien changer à la version iOS.

Il n'y a pas de design spécifique : on garde le design actuel, en utilisant les composants natifs Android là où iOS utilise des composants natifs iOS.

## Fonctionnement

### Version iOS identique

La version iOS ne doit pas changer, ni visuellement, ni dans son comportement.

- Le code propre à une plateforme passe par des fichiers séparés (`Component.ios.tsx` / `Component.android.tsx`) plutôt que par des conditions `Platform.OS` dispersées dans le code.
- Le code iOS existant n'est pas modifié, il est seulement renommé si besoin.
- Les tests Jest et Maestro iOS existants doivent continuer de passer.

### Configuration et build

- Section `android` dans `app.config.ts` : identifiant du package (`com.tentacode.pilbo`), icône adaptative, permissions.
- Les plugins iOS (`withoutPushEntitlement`, `withSqliteHeader`) ne doivent pas casser le build Android.
- Nouvelles commandes dans le `Makefile` : build sur émulateur, build sur téléphone, build Release (APK installable directement).
- `make clean` régénère les deux projets natifs.

### Composants propres à iOS

- **Sélecteur d'heure** (`IntakeTimeRow`, SwiftUI) : équivalent Android natif (Material).
- **Menu d'actions** d'un médicament (`useMedRowActionSheet`, `ActionSheetIOS`) : équivalent Android.
- **Modales** (`presentation: "modal"`) : elles s'affichent en plein écran sur Android, c'est acceptable.
- **Bouton retour** Android : il doit se comporter comme le geste de fermeture iOS, avec la modale « abandonner les modifications » si des changements ne sont pas enregistrés.

### Notifications

Les rappels et les alertes de stock doivent fonctionner comme sur iOS.

- Canal de notification Android, avec le son `beep.wav`.
- Permission de notification (Android 13 et plus), avec le même parcours que sur iOS (onboarding, réglages).
- Alarmes exactes (Android 12 et plus), pour que les rappels ne soient pas retardés par l'économie d'énergie.
- Les rappels doivent survivre au redémarrage du téléphone.
- La pastille sur l'icône dépend du fabricant : pas d'effort particulier si elle ne s'affiche pas.

### Affichage

- Affichage bord à bord : zones de sécurité, barre d'état, barre de navigation Android, clavier.
- Rendu visuel à vérifier écran par écran : ombres, polices, hauteurs de ligne, petits écrans.
- Retours haptiques : on garde `expo-haptics`, le rendu variera selon les téléphones.

### Accessibilité

Mêmes exigences que sur iOS (WCAG AA) :

- TalkBack (lecteur d'écran Android) sur tous les écrans.
- Taille de police système respectée sans casser les écrans.
- Réduction des animations respectée.

### Assurance qualité

- Jest : tests des comportements propres à Android (notifications, composants Android).
- Maestro : les flows `e2e/` passent aussi sur un émulateur Android (adaptés si besoin, par exemple pour les dialogues de permission).

## Hors scope

- Widget Android : à prévoir dans une spec séparée, comme le widget iOS (spec 24).
- Publication sur le Play Store.
- Design propre à Android (Material Design complet) : on garde le design de Pilbo.

## Questions ouvertes

- Test sur un vrai téléphone Android, ou émulateur uniquement ?
- Version minimale d'Android supportée ?
