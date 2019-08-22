// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Staging requires cookie to be set
Cypress.Cookies.defaults({
  whitelist: 'staging'
});

Cypress.Commands.add('login', (canary) => {
  cy.setCookie('staging', "1"); // Run in stagin mode. Note: does not impact review sites

  cy.visit('/login');

  cy.get('.m-btn--login').click();

  cy.get('minds-form-login .m-login-box .mdl-cell:first-child input').type(Cypress.env().username);
  cy.get('minds-form-login .m-login-box .mdl-cell:last-child input').type(Cypress.env().password);

  cy.get('minds-form-login .m-btn--login').click();
});

Cypress.Commands.add('uploadFile', (selector, fileName, type = '') => {
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, 'base64').then((content) => {
      const el = subject[0];
      const blob = b64toBlob(content, type);
      cy.window().then((win) => {
        const testFile = new win.File([blob], fileName, { type });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;

        // return cy.wrap(subject).trigger('change', {force: true});
      });
    });
  });
  // cy.get(selector).trigger('change', { force: true });
});

Cypress.Commands.add('post', (message) => {
  cy.get('m-text-input--autocomplete-container textarea').type(message);
  cy.get('.m-posterActionBar__PostButton').click();
});

function b64toBlob(b64Data, contentType, sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  blob.lastModifiedDate = new Date();
  return blob;
}
