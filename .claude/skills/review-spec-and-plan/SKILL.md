---
description: Relit une spec du dossier specs/ à partir de son numéro, pose des questions, réécrit la spec après validation, puis écrit un plan d'implémentation dans plans/. Exemple d'appel : /review-spec-and-plan 05
argument-hint: [numero-spec]
disable-model-invocation: true
---

# Revue de spec et plan

Numéro de spec demandé : `$0`

Tout est écrit en français (questions, spec, plan), comme indiqué dans `CLAUDE.md`.

## Étape 1 : trouver la spec

- Cherche le fichier correspondant à `specs/$0_*.md`.
- Si le numéro n'a qu'un chiffre (ex. `5`), essaie aussi avec un zéro devant (`05`).
- Si aucun numéro n'est fourni, on cherche si il y a un numéro au début de la branche git, sinon on pause la question. Ne devine pas.

## Étape 2 : relire

- Lis la spec en entier.
- Lis `CLAUDE.md` (stack, contraintes iOS, hors scope, conventions) et `docs/architecture.md`.
- Lis aussi ce qui l'entoure quand c'est utile : les specs qu'elle référence, les specs de numéro précédent dont elle dépend, les specs `draft_*` liées, et le code existant concerné.
- Regarde le dernier fichier existant (avant celui demandé, ex: le fichier 04_* si on est sur la spec 05) de `plans/` (s'il y en a) pour reprendre leur ton.

## Étape 3 : poser les questions, puis S'ARRÊTER

Pose une seule question par message (outil AskUserQuestion), et attends ma réponse avant la suivante.

Ne demande pas ce que la spec, `CLAUDE.md` ou la mémoire tranchent déjà, sauf si il y a une fort ambiguité, ou un soupçon de doc non à jour.

Sujets à couvrir :

- validation des questions posées dans la spec
- choix techniques à trancher
- pertinence de choix techniques (n'hésite pas à demander, mais suis mes choix)
- ambiguïtés et incompréhensions
- informations manquantes
- contradictions (internes ou avec d'autres specs / le code)
- cas limites et gestion d'erreurs
- besoins spécifiques en assurance qualité

Une fois toutes les questions terminées, résume-moi les modifications prévues de la spec. Ne modifie pas la spec tant que je n'ai pas validé.

Si mes réponses soulèvent de nouvelles questions, ou si je ne valide pas ton résumé, pose-les avant de continuer, resoumets le résumé et redemande validation. Passe à l'étape suivante uniquement quand je valide explicitement.

## Étape 4 : réécrire la spec

- Réécris le fichier de spec en place (même chemin), en français (traduis-la si besoin).
- Garde la structure de la spec d'origine autant que possible, y compris les cases à cocher.
- Ajoute ou complète une section `## Décisions` avec tout ce qui a été tranché. C'est le seul endroit où les décisions sont écrites.
- N'ajoute rien qui n'ait pas été discuté ou validé.
- Après l'écriture, donne un résumé court des changements, puis demande validation avant de passer au plan.

## Étape 5 : écrire le plan

- Écris le plan dans `plans/` avec le même nom de fichier que la spec (ex. `specs/05_sqlite_init.md` → `plans/05_sqlite_init.md`).
- Si le fichier de plan existe déjà, demande avant de l'écraser.
- N'implémente rien : le travail s'arrête au plan. L'implémentation se fera dans une autre discussion, le plan doit donc être exhaustif et autonome (fichiers et docs utiles cités).
- Ne recopie pas les décisions : renvoie à la spec.

Gabarit :

```markdown
# Spec NN — Titre

## Contexte

Objectif en 2-3 lignes. Spec et décisions : `specs/NN_nom.md`.

## Étape 1 — …

- Action concrète.
  - [ ] Peux avoir
  - [ ] Plusieurs sous actions
- [ ] Tu vérifies sur l'iPhone. (seulement si utile)

## Étape N — Fin

- [ ] `make tests` passe.
- [ ] Proposer une mise à jour de `CLAUDE.md` / docs si besoin (après ta validation seulement).
```

- Pas d'arrêt par défaut entre les étapes. Ajoute un arrêt explicite (« Je m'arrête et j'attends ta validation. ») uniquement là où la spec en demande un.
- Termine en donnant le chemin du plan, et rappelle que l'implémentation se fait dans une nouvelle discussion.
