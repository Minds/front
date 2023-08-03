# Running Playwright tests on Browserstack

Playwright end-to-end test automation with CodeceptJS (Gherkin) and Browserstack.

### Key Integrations

* Playwright + CodeceptJS + BrowserStack
* Page Object Models
* Gherkin
* Gitlab CI
* Parallel execution
* Platform: Chrome, Firefox, Webkit

### Dependencies

#### _Pre-requisites_: Install latest version of Node (or use NVM), web browsers and create environment variables

#### _Environment variables for Playwright Tests_

| Variable | Description |
| -------- | ----------- |
| E2E_DOMAIN | The URL you are testing against. eg: 'http://localhost:8080'. Do not include a trailing slash. |
| BROWSERSTACK_USERNAME | Optional username for Browserstack integration |
| BROWSERSTACK_ACCESS_KEY | Optional access key for Browserstack integration |
| BYPASS_SIGNING_KEY | The key to sign the bypass tokens with |
| PLAYWRIGHT_USERNAME | The username of the default user you will test against |
| PLAYWRIGHT_PASSWORD | The password of the default user you will test against |
| PLAYWRIGHT_SECONDARY_USERNAME | The username of the default secondary user you will test against |
| PLAYWRIGHT_SECONDARY_PASSWORD | The password of the default secondary user you will test against |
| SUPERMIND_SENDER_USERNAME | The username of a dedicated user to act as a supermind sender |
| SUPERMIND_SENDER_PASSWORD | The password of a dedicated user to act as a supermind sender |
| SUPERMIND_SETTINGS_USERNAME | Username of a dedicated user for testing Supermind Settings |
| SUPERMIND_SETTINGS_PASSWORD | Password of a dedicated user for testing Supermind Settings |
| SUPERMIND_FILTER_TEST_USERNAME | Username of a dedicated user for testing Supermind Console filters |
| SUPERMIND_FILTER_TEST_USERNAME | Password of a dedicated user for testing Supermind Console filters |
| PLAYWRIGHT_EXISTING_ACTIVITY_GUID | Guid for an activity that we know to exist (i.e. has a working SEP) |
| PLAYWRIGHT_USER_WRONG_AUDIENCE_REJECTED_BOOST_GUID | GUID of a boost rejected for wrong audience owned by the main test user |
| PLAYWRIGHT_USER_OWNED_GROUP_GUID | Guid of a group owner by main test user |

## Run Command

### Installing

```sh
cd e2e/test

nvm use # if you want to quickly upgrade your node version and use NVM

npm install
```

### Running via CLI

```sh
npm run test:e2e:local
```

### Running via CodeceptUI

```sh
npm run test:e2e:local:ui
```

### Running via Browserstack on Chrome, Firefox & Webkit browsers in parallel

```sh
npm run test:e2e:real
```

*In case of errors, check screenshots saved under e2e/test/error-screenshots folder.

## Creating New Tests
To create a new suite of tests:
- If necessary, create a Feature file (to define gherkin features and scenarios).
- If necessary, create a Steps file (to define individual Steps - Given/When/Then).
- If necessary, create a Page file (to define common functions and variables).
- Ensure that Pages and Fragments are references in ALL Codeceptjs config files in the include section.
- If creating new pages and fragments, run `npm run def` after adding them to your config files to generate your types.

## Helpful Links
- How to write tests in CodeceptJs + Gherkin click [here](https://codecept.io/bdd/)
- How to user locators with CodeceptJS click [here](https://codecept.io/locators/#locator-builder)
- CodeceptJS UI click [here](https://codecept.io/ui/)
 For more on Playwright click [here](https://playwright.dev/)

Reference Link: https://developers.minds.com/docs/guides/qa/
