import { Storage } from '../utils/storage';

namespace ActivitySteps {
  const { newsfeedPage, singleEntityPage, composerModalComponent } = inject();

  const storage = Storage.getInstance();

  Given(
    'I quote the activity with the storage text {string} and file names',
    async (storageKey: string, table: any) => {
      const storedText: string = storage.get(storageKey);
      await newsfeedPage.clickToQuoteActivityByText(storedText);
      composerModalComponent.typeInTextArea('Quote post');
      const tableByHeader = table.parse().hashes();
      const fileNames = tableByHeader.map(fileName => fileName.filename);

      if (fileNames.length) {
        await composerModalComponent.attachFiles(fileNames);
      }

      await composerModalComponent.clickPostAndAwait();
    }
  );

  When(
    'I click the parent media for the quote post in the {string} with storage text {string}',
    async (feedType: string, textStorageKey: string) => {
      const text: string = storage.get(textStorageKey);
      switch (feedType) {
        case 'newsfeed':
          newsfeedPage.hasActivityWithText(text);
          await newsfeedPage.clickOnParentMediaForQuotePostWithText(text);
          break;
        case 'single-entity-page':
          singleEntityPage.hasActivityWithText(text);
          await singleEntityPage.clickOnParentMediaForQuotePostWithText(text);
          break;
      }
    }
  );

  When(
    'I click the timestamp for the activity with the storage key {string} on {string}',
    async (textStorageKey: string, feedType: string) => {
      const text: string = storage.get(textStorageKey);
      switch (feedType) {
        case 'newsfeed':
          await newsfeedPage.clickTimestampForActivityWithText(text);
          break;
        case 'single-entity-page':
          await singleEntityPage.clickTimestampForActivityWithText(text);
          break;
      }
    }
  );

  Then('I should see the back button on the single entity page', () => {
    singleEntityPage.backButtonShouldBeVisible();
  });
}
