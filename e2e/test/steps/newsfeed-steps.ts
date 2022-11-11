namespace NewsfeedSteps {
  const { newsfeedPage } = inject();

  Given('I am on the newsfeed', () => {
    newsfeedPage.navigateToByUrl();
  });
}
