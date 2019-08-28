context('Discovery', () => {
  beforeEach(() => {
    cy.login(true);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/newsfeed/subscriptions`);
  });
  
  it('should allow a user to post on the discovery page', () => {
    cy.visit('/newsfeed/global/top');
    cy.post("test!!");
  });

  it('should be able to filter by hot', () => {
    cy.visit('/newsfeed/global/top');
    cy.get('.m-sort-selector--algorithm-dropdown ul > li:nth-child(1)')
      .click()
      .should('have.css', 'color', 'rgb(70, 144, 223)'); // selected color
    cy.url().should('include', '/hot');

  });

  it('should be able to filter by top', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--algorithm-dropdown ul > li:nth-child(2)')
      .click()
      .should('have.css', 'color', 'rgb(70, 144, 223)'); // selected color
    cy.url().should('include', '/top');
  }); 

  it('should be able to filter by time in the top feed', () => {
    cy.visit('/newsfeed/global/top');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get('.m-sort-selector--period-dropdown ul > li:nth-child(5)').click();
    cy.url().should('include', '=1y');


    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get('.m-sort-selector--period-dropdown ul > li:nth-child(4)').click();
    cy.url().should('include', '=30d');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get('.m-sort-selector--period-dropdown ul > li:nth-child(3)').click();
    cy.url().should('include', '=7d');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get('.m-sort-selector--period-dropdown ul > li:nth-child(2)').click();
    cy.url().should('include', '=24h');

    cy.get('.m-sort-selector--period-dropdown').click();
    cy.get('.m-sort-selector--period-dropdown ul > li:nth-child(1)').click();
    cy.url().should('include', '=12h');
  });

  it('should filter by latest', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--algorithm-dropdown ul > li:nth-child(3)')
      .click()
      .should('have.css', 'color', 'rgb(70, 144, 223)'); // selected color

    cy.url().should('include', '/latest');
  }); 

  it('should filter by image', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(2)').click();
    cy.url().should('include', '=images');
  }); 
  
  it('should filter by video', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(3)').click();
    cy.url().should('include', '=videos');
  }); 
  
  it('should filter by blog', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(4)').click();
    cy.url().should('include', '=blog');
  }); 
  
  it('should filter by channels', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(5)').click();
    cy.url().should('include', '=channels');
  }); 
  
  it('should filter by groups', () => {
    cy.visit('/newsfeed/global/hot');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(6)').click();
    cy.url().should('include', '=groups');
  }); 

  it('should filter by all', () => {
    cy.visit('/newsfeed/global/top?type=images');
    cy.get('.m-sort-selector--custom-type-dropdown').click();
    cy.get('.m-sort-selector--custom-type-dropdown ul > li:nth-child(1)').click();
    cy.url().should('not.include', '=images');
  });

  it('should allow the user to toggle nsfw', () => {
    cy.visit('/newsfeed/global/top?type=images');
    cy.get('m-topbar--navigation--options').click();
    cy.get('m-topbar--navigation--options label > span').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(1)').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(2)').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(3)').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(4)').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(5)').click();
    cy.get('m-topbar--navigation--options ul > m-nsfw-selector ul > li:nth-child(6)').click();
  });  

  it('should allow the user to filter by a single hashtag', () => {
    cy.get('.m-hashtagsSidebarSelector__list > ul > li:nth-child(1) .m-hashtagsSidebarSelectorList__visibility > i')
      .click(); // Will fail on non-configured users
  });

  it('should allow the user to turn off single hashtag filter and view all posts', () => {
    cy.get('.m-hashtagsSidebarSelector__list > ul > li:nth-child(1) .m-hashtagsSidebarSelectorList__visibility > i')
      .click();
  })
})