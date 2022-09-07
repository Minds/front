//import CommonPage from '../pages/commonPage';

namespace SearchSteps {
  const { I, searchPage } = inject();

  //const commonPage = new CommonPage();

  Given('I am on the search', () => {
    I.amOnPage(searchPage.searchURI);
  });

  When('I type the search term', table => {
    I.seeElement(searchPage.searchField);
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      I.fillField(searchPage.searchField, row.searchTerm);
    }
    I.pressKey('Enter');
  });

  Then('I see search results', table => {
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      I.seeInCurrentUrl(row.searchPath);
    }
    I.clearField(searchPage.searchField);
  });
}
