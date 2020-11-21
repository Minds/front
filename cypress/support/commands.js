import 'cypress-file-upload';
import jwt from 'jsonwebtoken';

/**
 * @author Marcelo, Ben and Brian
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
  checkbox: '[data-cy=minds-accept-tos-input] [type=checkbox]',
  submitButton: 'm-button',
};

const settings = {
  deleteAccountButton:
    'm-button',
  deleteSubmitButton:
    'm-confirm-password--modal > div > form > div:nth-child(2) > button',
};
const nav = {
  hamburgerMenu:
    '.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > a',
  logoutButton: '.m-user-menu.m-dropdown > ul > li:nth-child(11) > a',
  byIndex: i => `.m-user-menu.m-dropdown > ul > li:nth-child(${i}) > a`,
};

const defaults = {
  email: 'test@minds.com',
};

const loginForm = {
  password: '[data-cy=data-minds-login-password-input]',
  username: '[data-cy=data-minds-login-username-input]',
  submit: '[data-cy=data-minds-login-button]',
};

const poster = {
  textArea: 'm-text-input--autocomplete-container textarea',
  postButton: '.m-posterActionBar__PostButton',
};

/**
 * Logs a user in.
 * @param { boolean } canary - Currently not required
 * @param { string } username - The username.
 * @param { string } password - The users password.
 * @returns void
 */
Cypress.Commands.add('login', (canary = false, username, password) => {
  cy.clearCookies();
  cy.setCookie('staging', '1'); // Run in staging mode. Note: does not impact review sites
  username = username ? username : Cypress.env().username;
  password = password ? password : Cypress.env().password;

  cy.server();

  // We need an XSRF token before login can work
  cy.route('POST', '/api/v2/mwa/pv').as('initXsrf');

  cy.visit('/login');

  cy.wait('@initXsrf', { timeout: 30000 });

  cy.route('POST', '/api/v1/authenticate').as('postLogin');

  cy.get(loginForm.username)
    .focus()
    .type(username);
  cy.get(loginForm.password)
    .focus()
    .type(password);

  cy.get(loginForm.submit)
    .click({ force: true })
    .wait('@postLogin')
    .then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    });
});

/**
 * Logs a user out of their session using the menu.
 *
 * @param organic - if true, log out organically through menu rather than URL.
 * @returns void
 */
Cypress.Commands.add('logout', () => {
  cy.visit('/logout')
    .location('pathname')
    .should('eq', `/login`);
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
Cypress.Commands.add(
  'newUser',
  (username = '', password = '', skipOnboarding = true) => {
    cy.server();

    // We need an XSRF token before login can work
    cy.route('POST', '/api/v2/mwa/pv').as('initXsrf');

    cy.visit('/register')
      .location('pathname')
      .should('eq', `/register`);

    cy.wait('@initXsrf', { timeout: 30000 });

    cy.setCookie('staging', '1');
    cy.server();
    cy.route('POST', '**/api/v1/register').as('registerPOST');

    cy.get(registerForm.username)
      .focus()
      .type(username);
    cy.get(registerForm.email)
      .focus()
      .type(defaults.email);
    cy.get(registerForm.password)
      .focus()
      .type(password);
    cy.wait(500); // give second password field chance to appear - not tied to a request.

    cy.get(registerForm.password2)
      .focus()
      .type(password);
    cy.get(registerForm.checkbox).click({ force: true });

    cy.completeCaptcha();

    //submit.
    cy.get(registerForm.submitButton)
      .click({ force: true })
      .wait('@registerPOST')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal('success');
      })
      .location('pathname')
      .should('eq', '/onboarding/notice');

    // skip onboarding
    if (skipOnboarding) {
      cy.contains("No thanks, I'll do it later").click();
    }
  }
);

Cypress.Commands.add('preserveCookies', () => {
  Cypress.Cookies.preserveOnce(
    'staging',
    'minds_sess',
    'mwa',
    'XSRF-TOKEN',
    'staging-features',
    'feature_flags_override'
  );
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
  cy.server();
  cy.route('POST', '**/api/v1/channel/**').as('deletePOST');

  cy.visit('/settings/other/deactivate-account')
    .location('pathname', { timeout: 30000 })
    .should('eq', `/settings/other/deactivate-account`);

  cy.get('.m-formInputCheckbox__custom').click();

  cy.get(settings.deleteAccountButton).click({ force: true })
});

/**
 * Uploads a file.
 * @param { string } selector - The selector.
 * @param { string } fileName - the file-name.
 * @param { string } type - the file-type.
 * @returns void
 */
Cypress.Commands.add('uploadFile', (selector, fileName, type = '') => {
  cy.fixture(fileName).then(content => {
    cy.log('Content', fileName);
    cy.get(selector).upload({
      fileContent: content,
      fileName: fileName,
      mimeType: type,
    });
  });
});

export const composer = {
  trigger: 'm-composer .m-composer__trigger',
  messageTextArea:
    'm-composer__modal > m-composer__base [data-cy="composer-textarea"]',
  postButton:
    'm-composer__modal > m-composer__base [data-cy="post-button"] [data-cy="button-default-action"]',
};

Cypress.Commands.add('openComposer', () => {
  cy.get(composer.trigger)
    .should('be.visible')
    .click();
});

/**
 * Creates a new post. Must be logged in.
 * !! Requires composer to be set in feature flag !!
 * @param { string } message - The message to be posted
 * @returns void
 */
Cypress.Commands.add('post', message => {
  cy.server();
  cy.route('POST', '**/v2/newsfeed**').as('postActivity');
  cy.openComposer();
  cy.get(composer.messageTextArea)
    .clear()
    .type(message);
  cy.get(composer.postButton).click();
  cy.wait('@postActivity').then(xhr => {
    expect(xhr.status).to.equal(200);
    expect(xhr.response.body.status).to.deep.equal('success');
  });
});

// highlights text. ensure the highlight text is unique to the page.
// Bkucera - https://github.com/cypress-io/cypress/issues/2839#issuecomment-447012818
Cypress.Commands.add('highlightText', (text) => {
  cy.contains(text).trigger('mousedown')
      .then(($el) => {
        const el = $el[0]
        const document = el.ownerDocument
        const range = document.createRange()
        range.selectNodeContents(el)
        document.getSelection().removeAllRanges(range)
        document.getSelection().addRange(range)
      }).trigger('mouseup');

  cy.document().trigger('selectionchange')
});

/**
 * Sets the feature flag cookie.
 * @param { Object } flags - JSON object containing flags to turn on
 * e.g. { dark mode:false, es-feeds: true }
 * @returns void
 */
Cypress.Commands.add('overrideFeatureFlags', flags => {
  var sharedKey = Cypress.env().shared_key;
  const token = jwt.sign({ data: flags }, sharedKey, {
    expiresIn: '5m',
  });

  cy.setCookie('feature_flags_override', token);
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

/**
 * Check if certain element is on viewport
 * @param {*} element
 */
Cypress.Commands.add('isInViewport', element => {
  cy.get(element).then($el => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
  });
});

/**
 * Check if certain element is on viewport
 * @param {*} element
 */
Cypress.Commands.add('isNotInViewport', element => {
  cy.get(element).then($el => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
  });
});

Cypress.Commands.add('completeCaptcha', () => {
  var sharedKey = Cypress.env().shared_key;
  const captcha = Date.now();
  const token = jwt.sign({ data: captcha }, sharedKey, {
    expiresIn: '5m',
  });

  cy.get('m-captcha input')
    .focus()
    .type(captcha);

  cy.setCookie('captcha_bypass', token);
});
