
// UX Elements
const channelEditButton = ".m-channel--edit-button-wrapper button > span:contains('Edit')"
const channelNameInput = ".m-channel--name--editor > input"
const channelDescriptionTextArea = ".mdl-card__supporting-text > textarea"
const channelSaveButton = ".m-channel--edit-button-wrapper button > span:contains('Save')"

context.only('Edit Channel Profile', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });
  
  beforeEach(()=> {
    cy.preserveCookies();
  });
  

  it('should be able to edit simple fields', () => {
    
    cy.visit(`/${Cypress.env().username}`);
    cy.get(channelEditButton)
      .click();

    // edit channel name
    cy.get(channelNameInput).clear().type('The Lion Tamer');

    // edit channel description
    cy.get(channelDescriptionTextArea).clear().type('A channel that tames all the lions.');

    // submit changes
    cy.get(channelSaveButton)
    .click();
  });
});