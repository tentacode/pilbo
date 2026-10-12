# Écran d'erreur générique

## Contexte

`DatabaseErrorScreen` est spécifique à la base. On veut un écran d'erreur réutilisable (message par défaut surchargeable, CTA « Contactez-nous » vers `pilbo@tentacode.dev`), branché aussi sur un ErrorBoundary global, testable depuis Réglages. On fixe le ton de l'app dans `CLAUDE.md`.

Plan à part : `plans/06_error_handling.md` (pas de spec associée, demande directe).

## Choix

- **Dossier** : `src/shared/error-handling/` (kebab-case pour les dossiers multi-mots, documenté dans `docs/architecture.md`).
- **Bouton** : nouveau `design-system/components/Button/`, calqué sur `.btn` du design Claude (bouton principal) :
  - fond `ink`, texte blanc, gras 17, hauteur min. 52 pt, padding horizontal 22, rayon `round`, icône optionnelle non incluse.
  - appui : fond `#211E46` + `scale(0.96)` (scale désactivé si Reduce Motion).
  - Retour haptique léger à l'appui : `expo-haptics` (`Haptics.impactAsync(Light)`), dans `Button` donc pour tous les boutons.
- **ErrorBoundary** : convention Expo Router, `export { ErrorBoundary } ...` dans `src/app/_layout.tsx` → capture les erreurs de rendu de toutes les routes.
- **Bouton de test (Réglages)** : un appui passe un state à `true`, le rendu lance une exception (un boundary ne capte pas les erreurs dans un `onPress`). Affiché seulement en `__DEV__`.
- **Mail** : `Linking.openURL("mailto:...")`, sujet pré-rempli, détail technique dans le corps, `catch` silencieux si pas d'app Mail.

## Textes

- Titre par défaut : « Oups, petit contretemps »
- Message par défaut : « Quelque chose ne s'est pas passé comme prévu. Fermez puis relancez l'app, et vérifiez si c'est corrigé. »
- Aide : « Si le problème persiste, écrivez-nous. »
- CTA : « Contactez-nous »
- Override base : titre « Données indisponibles », message « Vos données n'ont pas pu être chargées. Essayez de fermer puis relancer Pilbo. »
- Bouton de test : « Simuler une erreur »

## Étapes

- [x] `npx expo install expo-haptics` (module natif : rebuild nécessaire).
- [x] Tokens : `colors.inkPressed` (`#211E46`), `sizes.buttonMinimumHeight` (52), `spacing.buttonHorizontal` (22), `pressedScale` (0.96). Tone `onInk` dans `Text.styles.ts`.
- [x] `design-system/hooks/useReduceMotion.ts` : `AccessibilityInfo.isReduceMotionEnabled` + écoute `reduceMotionChanged`.
- [x] `design-system/components/Button/Button.tsx` + `.styles.ts` : props `label`, `onPress`, `accessibilityHint?` ; `accessibilityRole="button"`, `minHeight` (Dynamic Type). Test `Button.spec.tsx`.
- [x] `shared/error-handling/utils/contactSupport.ts` : construit et ouvre le `mailto:`. Test unitaire de l'URL.
- [x] `shared/error-handling/ErrorScreen.tsx` + `.styles.ts` : props `title?`, `message?`, `details?` ; titre `accessibilityRole="header"`, message, détail (`help`/`secondary`), aide, `Button` « Contactez-nous ».
- [x] `shared/error-handling/ErrorBoundary.tsx` : signature Expo Router (`ErrorBoundaryProps`), rend `ErrorScreen` avec `details={error.message}`.
- [x] `ErrorScreen.spec.tsx` : textes par défaut, overrides, appui CTA → `Linking.openURL` avec le bon `mailto:`.
- [x] `src/app/_layout.tsx` : `export { ErrorBoundary } from "@/shared/error-handling/ErrorBoundary";`
- [x] `shared/database/DatabaseErrorScreen.tsx` : wrapper fin de `ErrorScreen` (overrides). Suppression de `DatabaseErrorScreen.styles.ts`.
- [x] `features/settings/components/CrashTestButton.tsx` (+ test) et ajout dans `SettingsScreen` en `__DEV__`.
- [x] `docs/architecture.md` : `shared/error-handling/` dans l'arborescence, kebab-case pour les dossiers multi-mots.
- [x] `CLAUDE.md` : section « Ton de l'app » : entre sympa et corpo, vouvoiement, phrases courtes et légères, suggestions plutôt qu'ordres (« Essayez de… »), pas de jargon technique dans les messages principaux.
- [x] `make tests` passe.
- [ ] Tu vérifies sur iPhone (`make build-device`) : Réglages → « Simuler une erreur », écran, VoiceOver, Dynamic Type, appui (Reduce Motion on/off), vibration légère à l'appui, ouverture de Mail.
