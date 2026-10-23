# Paramètres

On veut intégrer l'écran des paramètres dans l'app.

L'écran de référence pour le design de l'écran réglage est dans Claude Design, sous "4 · Stock et réglages" et "Réglages" : https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83

On vérifie si d'autres écrans référencent les paramètres, et si besoin on renvoie vers l'écran paramètres (vérifié : aucun, rien à faire).

## Différents paramètres

### Notifications

Si les notifications sont déjà autorisées, on affiche une coche. Sinon, la ligne redirige vers la popup système ou vers les réglages de l'app dans iOS (voir Décisions).

### Intervalle par défaut

Les intervalles sont les mêmes que ceux de l'ajout d'un médicament dans une prise.

### Stock

Ne sert à rien pour l'instant, mais on l'intègre quand même. Les valeurs vont de 1 à 30 jours, 7 jours par défaut.

### Langue

Ne sert à rien pour l'instant, mais on l'intègre quand même. Le réglage est dans l'app, pas dans les Réglages d'iOS comme l'indique le design.

Par défaut, on prend la langue du système si c'est le français ou l'anglais, sinon l'anglais.

Plus tard on ajoutera l'internationalisation : le changement de langue devra être instantané quand on modifie ce réglage.

Proof of concept : le titre de l'écran passe de « Réglages » à « Settings », sans lib i18n (on l'ajoutera quand on mettra réellement l'internationalisation en place).

### Vos données

Tel quel.

### À propos

Tel quel. Le lien « Pilbo n'est pas une application médicale » affiche l'écran de l'onboarding, mais sans les points de progression, avec seulement la possibilité de revenir aux réglages.

### Mode debug (pas présent dans le design)

Quand on appuie 10 fois sur la version, on passe en mode debug. C'est le mode qui permet aujourd'hui de vider la base ou de recharger les fixtures.

En mode debug, une section « Debug » apparaît sous « À propos ». Elle ressemble aux autres sections : titre en dehors de la card, boutons dans la card :

- « Supprimer les données » : affiche maintenant une modale d'avertissement avant de supprimer réellement les données.
- « Réinitialiser avec des données de test » : affiche aussi une modale.
- « Simuler une erreur ».

Quand on appuie à nouveau 10 fois sur la version, on sort du mode debug.

Le mode debug ne persiste pas : c'est un state local.

## Décisions

### Stockage

- Intervalle par défaut, stock bas et langue : store Zustand `persist` avec `expo-sqlite/kv-store`, méthodes **sync** (même mécanisme que `onboardingDone`). Pas de table SQLite.

### Notifications

- Autorisées : valeur « ✓ Autorisées », ligne non cliquable.
- Non autorisées : toute la ligne est cliquable, valeur « Activer » + chevron. Elle appelle `request()` de `useNotificationPermission` :
  - permission jamais demandée : popup système ;
  - refusée : ouverture de la page Pilbo dans les Réglages iOS (`Linking.openSettings()`).

### Intervalle par défaut

- `SegmentedControl` 5 / 10 / 15 / 30 min directement dans la ligne (pas de chevron, pas de sous-écran). Valeur par défaut : 10 min.
- Remplace la constante utilisée pour les nouvelles prises (`NEW_INTAKE_REMINDER_INTERVAL_MINUTES` dans `features/pillbox/utils/intakeDraft.ts`).
- Les prises existantes ne changent pas. Texte d'aide du design : « Utilisé pour les nouvelles prises. Chaque prise peut avoir le sien. »

### Stock bas

- `Stepper` existant directement dans la ligne, de 1 à 30 jours, 7 par défaut. Il n'est utilisé nulle part ailleurs pour l'instant.

### Langue

- `SegmentedControl` « Français | English » directement dans la ligne. On ne reprend pas le texte d'aide « S'ouvre dans les Réglages d'iOS ».
- Valeur stockée : `"fr" | "en" | null`. Avec `null` (jamais choisie), la langue suit iOS à chaque lancement (`expo-localization`, à installer) : fr ou en, sinon en. Dès que l'utilisateur choisit, la langue est figée.
- POC : seul le titre de l'écran change (« Réglages » ↔ « Settings »), instantanément. L'onglet garde « Réglages ».

### À propos

- « Revoir la présentation » remplace l'actuel « Refaire l'onboarding » (même comportement : réaffiche l'onboarding).
- « Pilbo n'est pas une application médicale » : nouvelle route de la Stack racine, en push, sans tab bar. On y affiche le contenu de l'étape 3 de l'onboarding, sans points de progression. On revient avec un bouton Retour en haut ou le swipe iOS.
- Version affichée au format « version (build) », ex. « 1.0.0 (1) », via `expo-application`.

### Mode debug

- 10 appuis sur la ligne « Version ». Le compteur repart à 0 après 2 s sans appui.
- Au 10e appui : vibration légère + annonce VoiceOver (« Mode debug activé » / « Mode debug désactivé »).
- La ligne « Version » n'est pas annoncée comme un bouton (fonction cachée).
- State local à l'écran, non persisté.
- Section « Debug » :
  - « Supprimer les données » : modale `Dialog` de confirmation, puis vidage de la base et réaffichage de l'onboarding (comportement actuel de « Vider la base »).
  - « Réinitialiser avec des données de test » : modale `Dialog` de confirmation, puis fixtures chargées et onboarding marqué comme fait (comportement actuel de « Réinitialiser la base »).
  - « Simuler une erreur » : sans modale, affiche l'écran d'erreur. Disponible aussi en Release (servira à tester Sentry plus tard).
- `EXPO_PUBLIC_DEBUG_MODE` est conservée, mais ne sert plus qu'au premier lancement (seed des fixtures + onboarding marqué comme fait, pour les tests e2e). Elle n'a plus aucun effet sur l'écran Réglages.

### Autres écrans

- Aucun écran ne renvoie vers les Réglages : rien à faire.

### Assurance qualité

- Tests Jest : store des réglages, composants de l'écran, compteur du mode debug, modales de confirmation.
- E2E : adapter `e2e/onboarding.yaml` (« Revoir la présentation ») et ajouter `e2e/settings.yaml` (modification des réglages, écran « pas une application médicale », activation et désactivation du mode debug).
