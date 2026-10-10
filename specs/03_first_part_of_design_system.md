# First part of design system

Each step (checkbox) has to be validated by me before going to the next one.

Now that we have the project setup, and the proof of concept of the notifications, I want to try to implement a part of the design made with Claude Design.

The link to the design is: [https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83](https://claude.ai/artifact/XS8vsH5VfDXuFXDyP5VrV4#page-dcb81aee8d83)

- [x] We should discuss and define the proper architecture
- [ ] We should organize the existing code (even if there is not much) on the new architecture
- [ ] First, I would like to have an app icon based on the variation "Icône · Tas D, gros plan" in Claude Design.
- Then I would like to implement the first screen, which will be the pill box "Pilulier · Liste des prises" in Claude Design, in steps:
  - [ ] The menu bar with all the icons.
  - [ ] Each tab of the menu bar will have its own screen (but they will only have a title, and the rest blank at first).
  - [ ] The pill box screen design will be implemented as in the design. Each component will live in its own file.
  - [ ] Then the static "intakes" and "meds" will be replaced with fixtures, as listed below: just static typed JSON (no database for now, no notification scheduling for now)
        * [ ] We want to update the CLAUDE.md or make a docs/architecture.md (and link it in CLAUDE.md) to make sure the architecture is respected.

## Architecture of the project

This is the first time we code anything really in the project.

While the architecture is up for debate, I definitely want to keep the "feature" organisation. You can give me your inputs and suggestions.

```
.env // if we can, we will use env vars for some specific options (like Apple Team ID or SENTRY_DSN for example)
.env.dist
src/
    /app // for screens and routing only
    /config // ts
    /design-system // everything that's generic
        tokens.ts // colors, spacing, fonts, etc.
        /components/
            /Button
                RoundButton.tsx
                RoundButton.styles.ts
            /Heading
                LevelOneHeading.tsx
                Heading.styles.ts // if need to share with every heading (should be an exception)
            /Card
                Card.tsx // not sure we need a card component because every card is a bit specific
                Card.styles.ts
            // etc.
    /features // not one per screen, but one per feature
        /pillbox
            PillboxScreen.tsx
            PillboxScreen.styles.ts
            IntakeList.tsx
            IntakeList.styles.ts
            IntakeCard.tsx
            IntakeCard.styles.ts
            // etc.
        /daily-intakes
        /stocks
        /settings
        /notifications // it's too big a deal to be in shared, it's really a feature of the app
        /authentication // if there was one, there would be a feature (but there isn't)
        // etc.
    /shared // everything that's shared, layout, third party integration, etc.
```

## TypeScript for intakes and meds (suggestion)

```javascript
interface PillDesign {
    path: string, // path to the SVG? is this the best practice?
}

interface Med {
    name: string, // Lamictal
    dose: string, // 120mg, 1g, can be flexible, do you have another recommendation for the key name?
    design: PillDesign, // path to the SVG?
}

interface MedQuantity {
    med: Med;
    quantity: number;
}

interface Intake {
    time: string; // 8:20, maybe there is a better type available
    daysOfTheWeek: string[]; // or Day[] and create a type
    medsQuantities: MedQuantity[];
}
```

## Pill Box Fixtures

Meds (all different pill design, except Lamictal):

- Lithium 250mg
- Quviviq 50mg
- Lamictal 50mg -> same design for the pill, but smaller
- Lamictal 100mg -> same design for the pill, but bigger
- Prégabaline 50mg

Intakes:

- 8h20 : 1x Lithium 250mg + 1x Lamictal 50mg
- 12h20 : 1x Lithium 250mg
- 20h20 : 2x Lithium 250mg
- 22h00 : 1x Lamictal 100mg + 1x Quviviq 50mg + 1x Prégabaline 50mg
