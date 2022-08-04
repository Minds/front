# E2E testing on Minds Web
    
Playwright end-to-end test automation with CodeceptJS (Gherkin) and Browserstack.

## <u>Getting Started</u>

### <u>Key Integrations</u>:

* Playwright + CodeceptJS + BrowserStack
* Page Object Model
* Gherkin
* Gitlab CI
* Parallel execution
* Platform: Chrome, Firefox, Webkit

### <u>Dependencies</u>:

#### _Pre-requisites_: Install latest version of Node, web browsers and create environment variables.

#### _Node_: https://nodejs.org/en/download/

#### _Environment variables for Playwright Tests_:

E2E_DOMAIN, PLAYWRIGHT_USERNAME & PLAYWRIGHT_PASSWORD

#### _Environment variables for BrowserStack Connection_:

BROWSERSTACK_USERNAME & BROWSERSTACK_ACCESS_KEY

## <u>Run Command</u>:

### Run this command within the project to install all package.json dependencies:

```
yarn
```

### Run the command below to execute automation locally on a headless Chrome browser:

```
yarn run test:e2e:local
```

### Run the command below to execute automation on Browserstack on Chrome, Firefox & Webkit browsers in parallel:

```
yarn run test:e2e:real
```

*In case of errors, check screenshots saved under e2e/test/error-screenshots folder.

## <u>Helpful Links</u>
*For more on how to write tests in CodeceptJs + Gherkin click [here](https://codecept.io/bdd/)
*For more on how to user locators with CodeceptJS click [here](https://codecept.io/locators/#locator-builder)
*For more on using CodeceptJS UI click [here](https://codecept.io/ui/)
*For more on Playwright click [here](https://playwright.dev/)
