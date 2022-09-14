import { CommonPage } from '../pages/commonPage';

namespace PermawebSteps {
  const { I, permawebPage } = inject();
  const commonPage = new CommonPage();

  When('I am on the permaweb page', () => {
    I.amOnPage(permawebPage.permawebURI);
  });

  Then('I can post an activity with permaweb', () => {
    commonPage.openSidebarComposer();
    permawebPage.newPostWithPermaweb();
  });
}
