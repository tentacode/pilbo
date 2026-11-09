fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build Pilbo and send it to TestFlight

---

## Android

### android bundle

```sh
[bundle exec] fastlane android bundle
```

Build the Pilbo Android App Bundle without uploading it (BUILD_NUMBER=…)

### android beta

```sh
[bundle exec] fastlane android beta
```

Build Pilbo and send it to the Play Store closed test (TRACK=internal for the internal test)

---

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
