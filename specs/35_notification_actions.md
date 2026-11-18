# Actions rapides sur les rappels

Demande de Martin : valider une prise directement depuis la notification, sans ouvrir l'app, y compris depuis l'Apple Watch.

## Fonctionnement

Un appui long sur un rappel de prise (ou la notification dépliée sur Android) affiche deux boutons :

- « Je l'ai pris » : la prise est validée, comme le bouton du même nom dans « Aujourd'hui » (log, baisse du stock).
- « Ignorer » : la prise est notée « Ignorée », le stock ne change pas.

Après l'appui :

- La notification disparaît et l'app ne s'ouvre pas.
- Les rappels suivants de cette prise ne sonnent plus.
- Tout est replanifié comme après une validation dans l'app (rappels, badge, alertes de stock bas, lendemain), même si l'app était tuée et que l'utilisatrice ne l'ouvre jamais.
- Si la prise a déjà été validée ou ignorée entre-temps, rien n'est enregistré une deuxième fois.
- Un tap simple sur la notification ouvre toujours « Aujourd'hui », comme avant.

Les alertes de stock bas n'ont pas de boutons.

### Apple Watch

Pas d'app watchOS. Quand l'iPhone est verrouillé, iOS envoie les rappels sur la montre avec leurs boutons, et l'action s'exécute sur l'iPhone. Test réel via TestFlight (Martin).

### Écran verrouillé

L'action ne demande pas de déverrouiller (Face ID), sinon elle ne marcherait pas depuis la montre.

## Décisions techniques

### iOS (fait dans le prototype, validé sur iPhone)

- Catégorie de notification `intake-reminder` avec les deux actions, libellés i18n (namespace `notifications`), réenregistrée à chaque replanification (donc au changement de langue).
- Les rappels portent `intakeId` et `intakeDay` dans `data`.
- Patch `expo-notifications` : pour une action personnalisée, le `completionHandler` n'est appelé qu'une fois le JS terminé (`completeNotificationAction`), avec une tâche d'arrière-plan et une sécurité à 25 s.
- L'écoute des actions démarre hors React (`startReminderActionHandling` dans `_layout.tsx`), et relit la dernière réponse au démarrage (app lancée en arrière-plan).
- Migration de la base partagée (`migrateDatabase`), replanifications exécutées l'une après l'autre.
- Enregistrement de la validation mutualisé avec « Aujourd'hui » (`saveIntakeValidation`).

### Android (validé sur le Galaxy S9)

- Mêmes boutons, même comportement, y compris app tuée.
- `expo-notifications` lance une tâche `expo-task-manager` pour un bouton d'action quand l'app est en arrière-plan ou tuée : la tâche est déclarée au démarrage du JS, dans le point d'entrée `index.ts`.
- Patch `expo-notifications` : la notification disparaît dès l'appui sur un bouton.

### Documentation

- Section « Actions sur les rappels » dans `docs/notifications.md` (fonctionnement, patch, contraintes).

## Hors périmètre

- « Rappeler plus tard ».
- App Apple Watch (watchOS).
- Actions sur les alertes de stock bas.
- Annonce VoiceOver et retour haptique lors d'une action depuis la notification (l'app n'est pas affichée).

## Vérification

Checklist sur appareil, iOS puis Android : app en arrière-plan, app tuée (le badge disparaît sans ouvrir l'app, pas de nouveau rappel), « Ignorer », écran verrouillé, tap simple. `make tests` doit passer.
