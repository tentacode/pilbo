# Onboarding

Le but de cette spec est d'intégrer les écrans d'onboarding dans l'app.

Ces écrans se trouvent dans Claude Design, dans la section "1 · Onboarding".

## Tâches

- [ ] Intégrer les 4 écrans, la "track" qui montre sur quel écran on est.
- [ ] L'affichage de l'onboarding est conditionné par un store Zustand persisté avec un booléen `onboardingDone`.
- [ ] Ce booléen est remis à false si on vide la base en debug depuis l'écran de settings. Il est remis à true si on réinitialise la base depuis l'écran de settings.
- [ ] Pour le bouton "Autoriser les notifications", il faut changer le comportement actuel pour que la popup système ne s'ouvre plus au lancement de l'app mais sur ce bouton. Il se déclenche au clic sur le bouton. On passe à l'étape suivante si on a activé les notifications OU si on clique sur plus tard. Ne pas valider les notifications depuis la popup reste sur cet écran.
- [ ] Il faut ajouter un bouton "Accepter les notifications" dans settings (pas en mode debug mais dans tous les cas). Ce bouton sera refait au propre quand on intégrera proprement les écrans de setting.
- [ ] Il faut ajouter un bouton "Refaire l'onboarding" dans settings (dans tous les cas).
- [ ] Le bouton "Créer ma première prise" redirige sur l'écran pilulier, qui montrera l'empty screen.
- [ ] Intégrer l'écran vide du pilulier.
- [ ] Le seed des données de test au lancement n'a lieu qu'au premier lancement, en debug.

## Décisions

### Stockage de `onboardingDone`

- Zustand avec le middleware `persist`, stockage `expo-sqlite/kv-store` (fourni par expo-sqlite : aucune dépendance native en plus, API synchrone, pas de flash d'onboarding au démarrage).
- Exception assumée à la règle « SQLite uniquement » de `CLAUDE.md` : un booléen d'UI n'a pas sa place dans le schéma SQL ni dans une requête à chaque lecture.

### Écrans

- Design : `onboarding-1.dc.html` à `onboarding-4.dc.html` (thème lavande), barre d'étapes = `pager` du design.
- Une seule route, l'étape est un state local. On avance uniquement par les boutons : pas de swipe, pas de retour.
- Transition entre étapes : implémenter 2 variantes (fondu, glissement horizontal), aucune animation si « Réduire les animations ». Arrêt pour que je teste et choisisse.
- « Créer ma première prise » : `onboardingDone = true`, puis Pilulier.

### Notifications

- Plus de demande de permission au lancement de l'app.
- « Autoriser les notifications » :
  - Jamais demandé : popup système. Autorisé → étape suivante. Refusé → reste sur l'écran.
  - Déjà autorisé : étape suivante directement.
  - Déjà refusé : ouvre les Réglages iOS. Au retour dans l'app, si autorisé → étape suivante.
- « Plus tard » : étape suivante.

### Réglages

- « Accepter les notifications » (hors debug, toujours) : même logique que l'onboarding. Masqué quand la permission est accordée (relu au focus et au retour au premier plan).
- « Refaire l'onboarding » (hors debug, toujours) : `onboardingDone = false`, données intactes.
- Debug : « Vider la base » → `onboardingDone = false`. « Réinitialiser la base » → `onboardingDone = true`.

### Seed au lancement

- Debug : seed uniquement au tout premier lancement après installation, et `onboardingDone = true` (l'onboarding ne s'affiche pas).
- Hors debug : jamais de seed.
- Plus de re-seed à chaque lancement quand la base est vide (le bouton « Réinitialiser la base » suffit).

### Pilulier vide

- Design `empty-pilulier.dc.html` : illustration, titre, texte.
- Boutons « Créer une prise » et « Ajouter un médicament hors planning » affichés, sans action pour l'instant.

### Tests

- Jest : store, écran d'onboarding, boutons de Réglages, Pilulier vide.
- Maestro : Réglages → « Refaire l'onboarding » → 4 étapes avec « Plus tard » → Pilulier.
