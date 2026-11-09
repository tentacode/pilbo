-include .env

.PHONY: help install start testflight version-bump artwork sounds doctor clean build-simulator build-device build-release check-device-id android-build-emulator android-build-device android-build-release check-android-device-id android-test-e2e check-android-emulator db-generate i18n-extract prettier lint typescript test-unit audit test-e2e tests

RUBY_BIN = /opt/homebrew/opt/ruby/bin

# The React Native Gradle plugin caches the autolinking config (including the package name) until the
# lockfile changes: it must be cleared when switching between the dev and prod variants
ANDROID_AUTOLINKING_CACHE = android/build/generated/autolinking

ANDROID_RELEASE_APK_DIRECTORY = android/app/build/outputs/apk/release

# expo run:android --device expects the model name shown by "adb devices -l", not the adb serial
ANDROID_DEVICE_NAME = $(shell adb devices -l | awk '$$1 == "$(ANDROID_DEVICE_ID)" { for (i = 2; i <= NF; i++) if ($$i ~ /^model:/) print substr($$i, 7) }')

# Maestro targets the first device it finds (the plugged-in phone included): pass the emulator explicitly
ANDROID_EMULATOR_ID = $(shell adb devices | awk '$$1 ~ /^emulator-/ && $$2 == "device" { print $$1; exit }')

# Colors
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Display this help message
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(CYAN)%-30s$(NC) %s\n", $$1, $$2}'

install: ## First time setup
	@command -v ccache > /dev/null || (echo "$(RED)ccache is missing, install it with: brew install ccache$(NC)" && exit 1)
	@test -x $(RUBY_BIN)/ruby || (echo "$(RED)Homebrew Ruby is missing, install it with: brew install ruby$(NC)" && exit 1)
	@test -n "$(ANDROID_HOME)" || (echo "$(RED)ANDROID_HOME is not set, see docs/android_build.md$(NC)" && exit 1)
	@command -v adb > /dev/null || (echo "$(RED)adb is missing, add \$$ANDROID_HOME/platform-tools to the PATH, see docs/android_build.md$(NC)" && exit 1)
	@"$(JAVA_HOME)/bin/java" -version 2>&1 | grep -q '"17\.' || (echo "$(RED)JAVA_HOME must point to Java 17, install it with: brew install --cask zulu@17, see docs/android_build.md$(NC)" && exit 1)
	pnpm install
	$(RUBY_BIN)/bundle install

start: ## Start Metro (Fast Refresh, no native rebuild)
	pnpm expo start --dev-client

doctor: ## Run expo-doctor
	npx expo-doctor

clean: ## Regenerate the native iOS and Android projects from scratch (APP_VARIANT=dev|prod, dev by default)
	APP_VARIANT=$(or $(APP_VARIANT),dev) pnpm expo prebuild --clean

build-simulator: ## Build and run "Pilbo Dev" in Debug on the simulator
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=dev pnpm expo run:ios

build-device: check-device-id ## Build and run "Pilbo Dev" in Debug on the iPhone (DEVICE_ID)
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=dev pnpm expo run:ios --device $(DEVICE_ID)

build-release: check-device-id ## Build and install "Pilbo" in Release on the iPhone (DEVICE_ID)
	APP_VARIANT=prod pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=prod pnpm expo run:ios --device $(DEVICE_ID) --configuration Release --no-bundler

android-build-emulator: ## Build and run "Pilbo Dev" in Debug on the Android emulator
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform android
	rm -rf $(ANDROID_AUTOLINKING_CACHE)
	APP_VARIANT=dev pnpm expo run:android

android-build-device: check-android-device-id ## Build and run "Pilbo Dev" in Debug on the Android phone (ANDROID_DEVICE_ID)
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform android
	rm -rf $(ANDROID_AUTOLINKING_CACHE)
	APP_VARIANT=dev pnpm expo run:android --device $(ANDROID_DEVICE_NAME)

android-build-release: check-android-device-id ## Build and install "Pilbo" in Release on the Android phone (ANDROID_DEVICE_ID), signed arm64 and universal APKs
	APP_VARIANT=prod pnpm expo prebuild --no-clean --platform android
	rm -rf $(ANDROID_AUTOLINKING_CACHE) $(ANDROID_RELEASE_APK_DIRECTORY)
	APP_VARIANT=prod pnpm expo run:android --device $(ANDROID_DEVICE_NAME) --variant release --no-bundler
	@echo "$(GREEN)APK arm64: $(CURDIR)/$(ANDROID_RELEASE_APK_DIRECTORY)/app-arm64-v8a-release.apk$(NC)"
	@echo "$(GREEN)APK universal: $(CURDIR)/$(ANDROID_RELEASE_APK_DIRECTORY)/app-universal-release.apk$(NC)"

testflight: ## Build "Pilbo" and send it to TestFlight (fastlane)
	PATH="$(RUBY_BIN):$$PATH" bundle exec fastlane ios beta

version-bump: ## Bump the app version in app.config.ts (TYPE=major|minor|patch)
	@node scripts/bumpVersion.mjs $(TYPE)

artwork: ## Generate the app icons and splash screens (SVG sources and PNG)
	@node scripts/generateArtwork.mjs

sounds: ## Generate the notification sounds
	@node scripts/generateSounds.mjs

check-device-id:
	@test -n "$(DEVICE_ID)" || (echo "$(RED)DEVICE_ID is missing in .env$(NC)" && exit 1)

check-android-emulator:
	@test -n "$(ANDROID_EMULATOR_ID)" || (echo "$(RED)No Android emulator is running (emulator -avd <name>)$(NC)" && exit 1)

check-android-device-id:
	@test -n "$(ANDROID_DEVICE_ID)" || (echo "$(RED)ANDROID_DEVICE_ID is missing in .env (adb devices)$(NC)" && exit 1)
	@test -n "$(ANDROID_DEVICE_NAME)" || (echo "$(RED)Android phone $(ANDROID_DEVICE_ID) is not connected (adb devices)$(NC)" && exit 1)

db-generate: ## Generate a SQLite migration from the Drizzle schema
	pnpm drizzle-kit generate

i18n-extract: ## Extract translation keys from the code to the locale files
	pnpm run i18n:extract

prettier: ## Fix prettier issues
	pnpm run prettier --log-level warn

lint: ## Run eslint checks
	pnpm run lint --fix

typescript: ## Run Typescript checks
	pnpm run typescript

test-unit: ## Run Jest unit tests
	pnpm run test

audit: ## Run pnpm audit
	pnpm audit

test-e2e: ## Run Maestro end to end tests (needs the app running on a simulator)
	maestro test e2e/

android-test-e2e: check-android-emulator ## Run Maestro end to end tests on the Android emulator (needs "Pilbo Dev" installed, emulator in French)
	maestro --device $(ANDROID_EMULATOR_ID) test e2e/

tests: ## Run all tests (without Maestro)
	pnpm run lint --fix && \
	echo "$(GREEN)eslint passed!$(NC)" && \
	pnpm run prettier --log-level warn && \
	echo "$(GREEN)prettier passed!$(NC)" && \
	pnpm run typescript && \
	echo "$(GREEN)typescript passed!$(NC)" && \
	pnpm run i18n:check && \
	echo "$(GREEN)translations passed!$(NC)" && \
	pnpm run test --silent && \
	echo "$(GREEN)unit tests passed!$(NC)" && \
	pnpm audit && \
	echo "$(GREEN)audit passed!$(NC)"
