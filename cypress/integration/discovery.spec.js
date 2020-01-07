context('Discovery', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.visit('/newsfeed/global/top')
      .location('pathname')
      .should('eq', '/newsfeed/global/top');
  });
  
  beforeEach(()=> {
    cy.preserveCookies();
  });

  it('should allow a user to post on the discovery page', () => {
    cy.post("test!!");
  });

  it('should be able to filter by hot', () => {
    cy.get(".m-sort-selector--algorithm-dropdown ul > li:contains('Hot')")
      .click()
      .should('have.class', 'm-dropdown--list--item--selected'); // selected class
    cy.url().should('include', '/hot');

  });

  it('should be able to filter by top', () => {
    cy.get(".m-sort-selector--algorithm-dropdown ul > li:contains('Top')")
      .click()
      .should('have.class', 'm-dropdown--list--item--selected'); // selected class
    cy.url().should('include', '/top');
  }); 

  it('should be able to filter by time in the top feed', () => {
    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get(".m-sort-selector--period-dropdown ul > li:contains('30d')").click();
    cy.url().should('include', '=30d');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get(".m-sort-selector--period-dropdown ul > li:contains('7d')").click();
    cy.url().should('include', '=7d');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get(".m-sort-selector--period-dropdown ul > li:contains('24h')").click();
    cy.url().should('include', '=24h');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get(".m-sort-selector--period-dropdown ul > li:contains('12h')").click();
    cy.url().should('include', '=12h');
  });

  it('should filter by latest', () => {
    cy.get(".m-sort-selector--algorithm-dropdown ul > li:contains('Latest')")
      .click()
      .should('have.class', 'm-dropdown--list--item--selected'); // selected class

    cy.url().should('include', '/latest');
  }); 

  it('should filter by image', () => {
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('photo')")
      .click();
    cy.url().should('include', '=images');
  }); 
  
  it('should filter by video', () => {
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('videocam')")
      .click();
    cy.url().should('include', '=videos');
  }); 
  
  it('should filter by blog', () => {
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('subject')")
      .click();
    cy.url().should('include', '=blog');
  }); 
  
  it('should filter by channels', () => {
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('people')")
      .click();
    cy.url().should('include', '=channels');
  }); 
  
  it('should filter by groups', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('group_work')")
      .click();
    cy.url().should('include', '=groups');
  }); 

  it('should filter by all', () => {
    cy.visit('/newsfeed/global/top?type=images');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get(".m-sort-selector--custom-type-dropdown ul > li:contains('all_inclusive')")
      .click();
    cy.url().should('not.include', '=images');
  });

  it('should allow the user to toggle nsfw', () => {
    cy.visit('/newsfeed/global/top?type=images');
    cy.get('m-topbar--navigation--options').click();
    cy.get('m-topbar--navigation--options label > span').click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Nudity')").click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Pornography')").click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Profanity')").click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Violence and Gore')").click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Race and Religion')").click();
    cy.get("m-topbar--navigation--options ul > m-nsfw-selector ul > li:contains('Other')").click();
  });  

  it('should allow the user to turn off single hashtag filter and view all posts', () => {
    cy.visit('/newsfeed/global/top');
    cy.get('m-hashtagssidebarselector__item')
      .first()
      .click();
  });
  
  it.skip('should allow the user to toggle a single hashtag and then toggle back to the initial feed', () => {
    cy.visit('/newsfeed/global/top');

    // get first label value
    cy.get('.m-hashtagsSidebarSelectorList__label').first().invoke('text').then((text) => {
      // repeat twice to capture full cycle.
      Cypress._.times(2, (i) => {

        // split hashtag off of label text
        let label = text.split('#')[1];

        // click switch 
        toggleFirstVisibilitySwitch();
        
        // check location name has updated
        cy.location('pathname')
          .should('eq', `/newsfeed/global/top;period=12h;hashtag=${label}`);

        // click switch 
        toggleFirstVisibilitySwitch();
        
        // check location name has updated
        cy.location('pathname')
          .should('eq', `/newsfeed/global/top;period=12h`);
      });
    });
  });

  // click first visibility switch 
  const toggleFirstVisibilitySwitch = () => {
      cy.get('m-hashtagssidebarselector__item')
        .first()
        .find('.m-hashtagsSidebarSelectorList__visibility > i')
        .click();
  }

})
