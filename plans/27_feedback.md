# Réglages : section « Votre avis » (bug / idée)

## Contexte

Permettre aux testeurs de signaler un bug ou de proposer une idée depuis les réglages. Chaque bouton ouvre simplement un e-mail (`mailto:pilbo@tentacode.dev`) avec un sujet pré-rempli. Pas de spec dédiée : le plan sera enregistré dans `plans/27_feedback.md` une fois validé.

## Choix d'UI

Deux lignes dans une nouvelle section **« Votre avis »**, placée juste avant « À propos » (pas de modale : un tap de moins, et le même style que « Revoir la présentation ») :

- « J'ai trouvé un bug » → sujet `Pilbo : j'ai trouvé un bug`
- « J'ai une idée » → sujet `Pilbo : j'ai une idée`

Chaque ligne : `SettingsRow` avec chevron, `accessibilityRole="button"`, `accessibilityHint` « Ouvre un e-mail à l'équipe Pilbo » (texte déjà existant dans `common`).

## Étapes

- [x] 1. Mutualiser la construction du mailto
  - Nouveau `src/shared/mail/openMail.ts` : `supportEmail`, `buildMailUrl(subject, body?)` et `openMail(subject, body?)` (`Linking.openURL(...).catch(() => {})`).
  - `src/shared/error-handling/utils/contactSupport.ts` réutilise `buildMailUrl` / `openMail` (comportement et tests inchangés).
  - Test Jest `openMail.spec.ts` (encodage du sujet, corps optionnel).
- [x] 2. Section réglages
  - `src/features/settings/components/FeedbackSection.tsx` : `SettingsSection` titre « Votre avis » + `ReportBugRow` et `SuggestIdeaRow` (ou un seul `FeedbackRow` paramétré par `label` / `subject` si plus simple).
  - Ajout dans `SettingsScreen.tsx` avant `<AboutSection />`.
- [x] 3. i18n : `make i18n-extract`, traductions anglaises dans le namespace `settings` (« Your feedback », « I found a bug », « I have an idea », sujets « Pilbo: I found a bug » / « Pilbo: I have an idea »).
- [x] 4. Tests : `FeedbackSection.spec.tsx` (titre de section, chaque bouton appelle `Linking.openURL` avec le bon mailto, version anglaise).
- [ ] 5. `make tests` au vert, puis vérification visuelle sur simulateur (petit écran + grande taille de texte).
  - Lint, Prettier, TypeScript, Jest OK ; l'audit échoue sur des dépendances existantes (`node-forge`…), sans lien avec ce changement.
  - Petit écran OK (iPhone 13 mini, iOS 17.4), taps sans plantage. Reste : grande taille de texte, VoiceOver, ouverture réelle de Mail sur iPhone.

## Vérification

- `make tests`.
- Simulateur « Pilbo Dev » : la section apparaît, chaque ligne ouvre Mail (ou rien sans compte Mail, sans crash), VoiceOver lit libellé + rôle + indice.
