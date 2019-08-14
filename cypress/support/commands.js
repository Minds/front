/**
 * @author Ben and Marcelo
 * @create date 2019-08-09 22:54:02
 * @modify date 2019-08-09 22:54:02
 * @desc Custom commands for access through cy.[cmd]();
 *  
 * For more comprehensive examples of custom
 * commands please read more here:
 * https://on.cypress.io/custom-commands
 *
 * -- This is a parent command --
 * Cypress.Commands.add('login', (email, password) => { ... })
 
 * -- This is a child command --
 * Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
 
 * -- This is a dual command --
 * Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
 
 * -- This is will overwrite an existing command --
 * Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
 */


const onboarding = {
  welcomeText: 'Welcome to Minds',
  welcomeTextContainer: 'm-onboarding--topics > div > h2:nth-child(1)',
  nextButton: '.m-channelOnboarding__next',
};

//Login and register
const registerForm = {
  username: 'minds-form-register #username',
  email: 'minds-form-register #email',
  password: 'minds-form-register #password',
  password2: 'minds-form-register #password2',
  checkbox: 'minds-form-register label:nth-child(2) .mdl-ripple--center',
  submitButton: 'minds-form-register .mdl-card__actions button',
};

const settings = {
  deleteAccountButton: 'm-settings--disable-channel > div:nth-child(2) > div > button',
  deleteSubmitButton: 'm-confirm-password--modal > div > form > div:nth-child(2) > button',
};
const nav = {
  hamburgerMenu: '.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > a',
  logoutButton: '.m-user-menu.m-dropdown > ul > li:nth-child(11) > a',
  byIndex: (i) => `.m-user-menu.m-dropdown > ul > li:nth-child(${i}) > a`,
};

const defaults = {
  email: 'test@minds.com',
}

const loginForm = {
  wrapper: '.m-v2-topbar__Container__LoginWrapper > a',
  username: 'minds-form-login .m-login-box .mdl-cell:first-child input',
  password: 'minds-form-login .m-login-box .mdl-cell:last-child input',
  mLogin: '.m-login',
  submit: 'minds-form-login .m-btn--login',
}

const poster = {
  textArea: 'm-text-input--autocomplete-container textarea',
  postButton: '.m-posterActionBar__PostButton',
}

// Staging requires cookie to be set
Cypress.Cookies.defaults({
  whitelist: 'staging',
});


/**
 * Logs a user in.
 * @param { boolean } canary - Currently not required
 * @param { string } username - The username.
 * @param { string } password - The users password.
 * @returns void
 */
Cypress.Commands.add('login', (canary = false, username, password) => {
  username =  username ? username : Cypress.env().username;
  password =  password ? password : Cypress.env().password;

  cy.setCookie('staging', '1'); // Run in staging mode. Note: does not impact review sites
  cy.visit('/login');

  cy.get(loginForm.wrapper).click();
  cy.location('pathname').should('eq', '/login');

  // it should have a login form
  cy.get(loginForm.mLogin).should('be.visible');

  cy.get(loginForm.username).focus().type(username);
  cy.get(loginForm.password).focus().type(password);

  cy.get(loginForm.submit).click({ force: true });

  // cy.wfait(2000);
  cy.location('pathname', { timeout: 10000 })
    .should('eq', '/newsfeed/subscriptions');
});


/**
 * Logs a user out of their session using the menu.
 * @returns void
 */
Cypress.Commands.add('logout', () => {
  cy.get(nav.hamburgerMenu).click();
  cy.get(nav.logoutButton).click();  
});


/**
 * Register a user, be sure to delete the user following this.
 * 
 * ! LOG-OUT PRIOR TO CALLING !
 * 
 * @param { string } username - The username. Note that the requested username will NOT be freed up upon deletion
 * @param { string } password - The users password.
 * @returns void
 */
Cypress.Commands.add('newUser', (username = '', password = '') => {
  cy.visit('/login');
    
  cy.location('pathname', { timeout: 30000 })
    .should('eq', `/login`);
  
  cy.get(registerForm.username).focus().type(username);
  cy.get(registerForm.email).focus().type(defaults.email);
  cy.get(registerForm.password).focus().type(password);
  cy.wait(500);

  cy.get(registerForm.password2).focus().type(password);
  cy.get(registerForm.checkbox).click();
  cy.wait(500);

  //submit.
  cy.get(registerForm.submitButton).click();
  cy.wait(5000);

  //onboarding modal shown.
  cy.get(onboarding.welcomeTextContainer)
    .contains(onboarding.welcomeText);
  
  //skip onboarding.
  cy.get(onboarding.nextButton).click()
  cy.get(onboarding.nextButton).click()
  cy.get(onboarding.nextButton).click()
  cy.get(onboarding.nextButton).click()
});


/**
 * Deletes a user. Use carefully on sandbox or you may lose your favorite test account.
 * 
 * ! LOG-IN PRIOR TO CALLING !
 * 
 * @param { string } username - The username. TODO: when both params provided log the user in too
 * @param { string } password - The password.
 * @returns void
 */
Cypress.Commands.add('deleteUser', (username, password) => {
  cy.log(`waited`);

  cy.visit('/settings/disable');
  cy.location('pathname', { timeout: 30000 })
    .should('eq', `/settings/disable`);
  cy.wait(2000);
cy.log(`waited`);
  cy.get(settings.deleteAccountButton).click({ force: true });
  cy.get('#password').focus().type(password);
  cy.get(settings.deleteSubmitButton).click({ force: true });
});


/**
 * Uploads a file.
 * @param { string } selector - The selector.
 * @param { string } fileName - the file-name.
 * @param { string } type - the file-type.
 * @returns void
 */
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


/**
 * Creates a new post. Must be logged in.
 * @param { string } message - The message to be posted
 * @returns void
 */
Cypress.Commands.add('post', (message) => {
  cy.get(poster.textArea).type(message);
  cy.get(poster.postButton).click();
});


/**
 * Converts base64 to blob format
 * @param { string } b64Data - The base64 data.
 * @param { string } contentType - The type of content.
 * @param { number } sliceSize - The size of the slice.
 * @returns void
 */
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
