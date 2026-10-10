# Setup React Native and apple account

## Goal

The app should have everything ready for the first features:

* React Native project proprely setup.
* A simple hello world app.
* Expo local build working in the official iOS Simulator (`npx expo run:ios`).
* New apple dev free account created.
* Xcode properly setup and can run the app in a simulator.
* App can be deployed on my personnal iPhone.

Some steps will require my interactions, and should be step by step (clear and concise).

## Decisions

* Apple ID: a new dedicated Apple ID.
* Bundle identifier: `com.tentacode.pilbo`.
* Template: minimal, TypeScript strict with Expo Router.
* iPhone build: Debug by default, Release build documented as well.

## Out of scope

* Packages that will be necessary in the future will be installed later as needed: sqlite notably, prettier, esling, jest, and anything else. Focus is only on the build for this spec.