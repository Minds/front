import { NewsfeedPage } from '../pages/newsfeedPage';

namespace NewsfeedSteps {
  const newsfeedPage = new NewsfeedPage();

  Before(() => {});

  Given('I am on the newsfeed', () => {
    newsfeedPage.navigateToByUrl();
  });

  After(() => {});
}
