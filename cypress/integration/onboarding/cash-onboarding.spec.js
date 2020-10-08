import generateRandomId from "../../support/utilities";

context('Cash Onboarding', () => {

  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;

  const sidenavWalletButton = '[data-cy=data-minds-sidebar-nav-wallet]';
  const settingsTab = '[data-cy=data-minds-wallet-settings]';
  const addBankButton = '[data-cy=cash-onboarding-add-bank-button]';

  const bankForm = {
    country: '[data-cy=cash-onboarding-input-country] select',
    firstName: '[data-cy=cash-onboarding-input-firstName]',
    lastName: '[data-cy=cash-onboarding-input-lastName]',
    dobDropdowns: '[data-cy=cash-onboarding-dob-dropdowns]',
    phoneInput: '[data-cy=cash-onboarding-input-phone]',
    idNum: '[data-cy=cash-onboarding-input-id-num]',
    address1: '[data-cy=cash-onboarding-input-address1]',
    city: '[data-cy=cash-onboarding-input-city]',
    state: '[data-cy=cash-onboarding-input-state]',
    postal: '[data-cy=cash-onboarding-input-postal]',
    termsCheckbox: '[data-cy=cash-onboarding-input-terms-checkbox]',
    updateInfoButton: '[data-cy=cash-onboarding-update-information]',
    error: '[data-cy=cash-onboarding-error]'
  }

  before(()=> {
    cy.clearCookies();
  });

  beforeEach(()=> {
    cy.newUser(username, password);
    cy.server();
    cy.route('PUT', '**/api/v2/wallet/usd/account').as('putAccount')
  });

  afterEach(()=> {
    cy.deleteUser();
  });

  it('should allow Indian users to onboard', () => {
    openCashOnboardingPage();

    cy.get(bankForm.country).select('India');
    cy.get(bankForm.firstName).type('Minds');
    cy.get(bankForm.lastName).type('Tester');

    cy.get(`${bankForm.dobDropdowns} select`)
      .eq(0)
      .select('1970');
    cy.get(`${bankForm.dobDropdowns} select`)
      .eq(1)
      .select('January');
    cy.get(`${bankForm.dobDropdowns} select`)
      .eq(2)
      .select('1');

    cy.get(`${bankForm.phoneInput} input`).type("0123456789");

    cy.get(bankForm.idNum).type('0123456789');
    
    
    cy.get(bankForm.address1).type('123 fake street');
    cy.get(bankForm.city).type('city')
    cy.get(bankForm.state).type('state')
    cy.get(bankForm.postal).type('123')
    cy.get(bankForm.termsCheckbox).click();

    // TODO: Stub stripe response.
    cy.get(bankForm.updateInfoButton).click()
      .wait('@putAccount')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('error');
      });
  
    // error should be displayed.
    cy.get(bankForm.error).contains(/\w+/);
  });

  const openCashOnboardingPage = () => {
    cy.get(sidenavWalletButton)
      .click()
      .location('href')
      .should('contain', 'wallet/canary/cash/earnings');

    cy.get(settingsTab)
      .click()
      .location('href')
      .should('contain', 'wallet/canary/cash/settings');

    cy.get(addBankButton).click();
  }
});
