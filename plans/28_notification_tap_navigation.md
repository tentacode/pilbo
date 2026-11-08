# Ouvrir le bon écran au tap sur une notification

## Réponse courte

Oui, c'est possible, et ça reste un petit changement :

- les deux types de notification se distinguent déjà par leur identifiant (`reminder-…` / `low-stock-…`), donc rien à changer dans la programmation ;
- `Screen` accepte déjà une `ref` sur sa `ScrollView`, donc on peut la remonter en haut.

## Contexte

- Aujourd'hui, `useOpenTodayOnNotification` (`src/features/notifications/hooks/useOpenTodayOnNotification.ts`, appelé dans `src/app/(tabs)/_layout.tsx`) fait `router.navigate("/today")` pour **toutes** les notifications.
- Si l'écran est déjà affiché, rien ne se passe : pas de scroll, et un jour passé affiché (navigation par jour) le reste.
- Une alerte de stock ouvre « Aujourd'hui » au lieu de « Médicaments ».
- Bug noté dans `specs/TODO_vrac.md` (pas de spec dédiée).

## Comportement visé

| Notification                    | Onglet      | Effets                                                                                                       |
| ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| Rappel de prise (`reminder-…`)  | Aujourd'hui | retour à la racine de l'onglet (ferme le calendrier s'il est ouvert), retour au jour courant, scroll en haut |
| Alerte de stock (`low-stock-…`) | Médicaments | retour à la racine de l'onglet (ferme la fiche d'un médicament), scroll en haut                              |

- Scroll animé, sauf si « Réduire les animations » est activé (`useReduceMotion`).
- Hors périmètre : les modales ouvertes au premier plan (édition de prise, etc.) gardent le comportement actuel.

## Étapes

- [x] 1. **Onglet d'une notification** : `src/features/notifications/utils/notificationTab.ts`
  - Constantes de préfixe partagées (`REMINDER_IDENTIFIER_PREFIX`, `LOW_STOCK_IDENTIFIER_PREFIX`), utilisées par `planReminders.ts` et `planLowStockAlerts.ts`.
  - `notificationTab(identifier): "today" | "meds"` (défaut : `"today"`).
  - Test Jest.
- [x] 2. **Demande de réinitialisation d'onglet** : petit store Zustand `src/shared/navigation/tabResetStore.ts` (état UI partagé entre le layout des onglets et les écrans, cas prévu par CLAUDE.md).
  - `requestCounts: { today: number; meds: number }` + `requestTabReset(tab)`.
  - Test Jest.
- [x] 3. **Hook côté écran** : `src/shared/navigation/useTabReset.ts`
  - `useTabReset(tab, onReset?)` : renvoie une ref de `ScrollView` ; à chaque demande, dépile la pile de l'onglet (`StackActions.popToTop()` si besoin), fait `scrollTo({ y: 0, animated: !reduceMotion })`, puis appelle `onReset`.
  - `router.navigate` seul ne dépile pas (il empilerait un doublon de l'écran racine), d'où le dépilement par l'écran.
  - `TodayScreen` : `onReset` = `dayNavigation.showDate(dayNavigation.today)`. `MedsScreen` : sans `onReset`.
  - Tests Jest du hook + test « revient à aujourd'hui » dans `TodayScreen.spec.tsx`.
- [x] 4. **Handler de notification** : `useOpenTodayOnNotification` renommé en `useOpenTabOnNotification`.
  - `notificationTab(identifier)` → `router.navigate("/today" | "/meds")` + `requestTabReset(tab)`.
  - Test Jest (mock `expo-notifications` / `expo-router`).
- [x] 5. **Doc** : section « Tap sur une notification » dans `docs/notifications.md`.
- [x] 6. **`make tests`** passe.
- [ ] 7. **Vérification manuelle** (iPhone + Galaxy S9) avec de vraies notifications :
  - rappel, app au premier plan sur « Aujourd'hui » scrollé en bas → remonte en haut ;
  - rappel avec un jour passé affiché, ou le calendrier ouvert → jour courant, en haut ;
  - alerte de stock depuis un autre onglet, et depuis la fiche d'un médicament → « Médicaments », en haut ;
  - app en arrière-plan, puis app tuée (ouverture à froid) : si rien ne se passe à froid, ajouter `Notifications.getLastNotificationResponse()` au montage ;
  - « Réduire les animations » activé → scroll sans animation.

## Fichiers touchés

- `src/features/notifications/hooks/useOpenTabOnNotification.ts` (renommé)
- `src/features/notifications/utils/notificationTab.ts` (nouveau), `planReminders.ts`, `planLowStockAlerts.ts`
- `src/shared/navigation/tabResetStore.ts`, `useTabReset.ts` (nouveaux)
- `src/features/today/TodayScreen.tsx`, `src/features/meds/MedsScreen.tsx`, `src/app/(tabs)/_layout.tsx`
- `docs/notifications.md`
