namespace SearchSteps {
  const { I, searchPage } = inject();

  Given('I am on the search page', () => {
    I.amOnPage(searchPage.searchURI);
  });

  When('I type the search term', async table => {
    I.seeElement(searchPage.searchField);
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      I.fillField(searchPage.searchField, row.searchTerm);
    }
    await Promise.all([
      I.pressKey('Enter'),
      I.waitForResponse(
        resp =>
          resp.url().includes('/api/v3/discovery/search') &&
          resp.status() === 200,
        30
      ),
    ]);
  });

  Then('I see search results', () => {
    I.seeElement(locate('m-discovery__search').withText('Top'));
    I.seeElement(locate('m-discovery__search').withText('Latest'));
    I.seeElement(locate('m-discovery__search').withText('Channels'));
    I.seeElement(locate('m-discovery__search').withText('Groups'));
    I.seeElement(searchPage.searchResults);
  });
}
