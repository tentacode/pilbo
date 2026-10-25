-include .env

.PHONY: help install start testflight version-bump doctor clean build-simulator build-device build-release check-device-id db-generate i18n-extract prettier lint typescript test-unit audit test-e2e tests

RUBY_BIN = /opt/homebrew/opt/ruby/bin

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
	pnpm install
	$(RUBY_BIN)/bundle install

start: ## Start Metro (Fast Refresh, no native rebuild)
	pnpm expo start --dev-client

doctor: ## Run expo-doctor
	npx expo-doctor

clean: ## Regenerate the native iOS project from scratch (APP_VARIANT=dev|prod, dev by default)
	APP_VARIANT=$(or $(APP_VARIANT),dev) pnpm expo prebuild --clean --platform ios

build-simulator: ## Build and run "Pilbo Dev" in Debug on the simulator
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=dev pnpm expo run:ios

build-device: check-device-id ## Build and run "Pilbo Dev" in Debug on the iPhone (DEVICE_ID)
	APP_VARIANT=dev pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=dev pnpm expo run:ios --device $(DEVICE_ID)

build-release: check-device-id ## Build and install "Pilbo" in Release on the iPhone (DEVICE_ID)
	APP_VARIANT=prod pnpm expo prebuild --no-clean --platform ios
	APP_VARIANT=prod pnpm expo run:ios --device $(DEVICE_ID) --configuration Release --no-bundler

testflight: ## Build "Pilbo" and send it to TestFlight (fastlane)
	PATH="$(RUBY_BIN):$$PATH" bundle exec fastlane ios beta

version-bump: ## Bump the app version in app.config.ts (TYPE=major|minor|patch)
	@node scripts/bumpVersion.mjs $(TYPE)

check-device-id:
	@test -n "$(DEVICE_ID)" || (echo "$(RED)DEVICE_ID is missing in .env$(NC)" && exit 1)

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
