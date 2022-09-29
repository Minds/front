# Running Playwright tests on Browserstack

Playwright end-to-end test automation with CodeceptJS (Gherkin) and Browserstack.

### Key Integrations

* Playwright + CodeceptJS + BrowserStack
* Page Object Model
* Gherkin
* Gitlab CI
* Parallel execution
* Platform: Chrome, Firefox, Webkit

### Dependencies

#### _Pre-requisites_: Install latest version of Node, web browsers and create environment variables.

#### _Node_: https://nodejs.org/en/download/

#### _Environment variables for Playwright Tests_

| Variable | Description |
| -------- | ----------- |
| E2E_DOMAIN | The URL you are testing against. eg: 'http://localhost:8080'. Do not include a trailing slash. |
| PLAYWRIGHT_USERNAME | The username of the default user you will test against |
| PLAYWRIGHT_PASSWORD | The password of the default user you will test against |
| BYPASS_SIGNING_KEY | The key to sign the bypass tokens with (optional?) |
| SUPERMIND_SENDER_USERNAME | The username of the supermind sender |
| SUPERMIND_SENDER_PASSWORD | The password of the supermind sender |


#### _Environment variables for BrowserStack Connection_

BROWSERSTACK_USERNAME & BROWSERSTACK_ACCESS_KEY

## Run Command

### Installing

```
cd e2e/test
yarn
```

### Running via CLI

```
yarn run test:e2e:local
```

### Running via CodeceptUI

```
yarn run test:e2e:local:ui
```

### Running via Browserstack on Chrome, Firefox & Webkit browsers in parallel

```
yarn run test:e2e:real
```

*In case of errors, check screenshots saved under e2e/test/error-screenshots folder.

## Creating New Tests
To create a new suite of tests:
- Create a Feature file (to define gherkin features and scenarios).
- Create a Steps file (to define individual Steps - Given/When/Then).
- Create a Page file (to define common functions and variables). 
- Ensure that all the files above are linked via codeceptjs config file.

## Helpful Links
- How to write tests in CodeceptJs + Gherkin click [here](https://codecept.io/bdd/)
- How to user locators with CodeceptJS click [here](https://codecept.io/locators/#locator-builder)
- CodeceptJS UI click [here](https://codecept.io/ui/)
 For more on Playwright click [here](https://playwright.dev/)

Reference Link: https://developers.minds.com/docs/guides/qa/
