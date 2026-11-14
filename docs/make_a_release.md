# Faire une version publique

Publier sur l'App Store et en production sur le Play Store un build déjà testé en bêta.

Pas encore fait : publication App Store (spec 25) et accès à la production du Play Store (spec 28, après 14 jours de test fermé avec 12 testeurs). Ce document sera complété à la première publication.

## 1. Partir d'une bêta

- [ ] Suivre `docs/make_a_beta.md` jusqu'au bout : on publie un build déjà envoyé en bêta, jamais un nouveau build.
- [ ] Le build a été utilisé quelques jours par les testeurs, sans bug bloquant.

## 2. Textes

- [ ] Notes de version (« Nouveautés »), FR et EN, pour les utilisateurs : les notes « À tester » s'adressent aux testeurs et ne conviennent pas.
- [ ] Fiches des stores et site (`website/`) à jour avec les nouvelles fonctionnalités, comme pour la bêta.

## 3. Publier

iOS (App Store Connect) :

- [ ] Nouvelle version de l'app, avec le numéro de `app.config.ts`.
- [ ] Choisir le build TestFlight, remplir les notes de version, soumettre à la revue d'Apple.
- [ ] Après acceptation : publier la version (sortie manuelle).

Android (Play Console) :

- [ ] Test fermé → promouvoir la version en production.
- [ ] Remplacer les notes de version par celles du point 2, puis envoyer en revue.

## 4. Après la publication

- [ ] Mise à jour installée depuis les stores sur l'iPhone et le S9 : les données sont conservées.
- [ ] Ce qui est publié est figé : migration, format des réglages persistés.
