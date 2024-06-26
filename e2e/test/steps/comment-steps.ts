import { SupermindBannerFragment } from '../fragments/supermindBanner';

namespace CommentSteps {
  const { activityComponent } = inject();
  const supermindBannerFragment = new SupermindBannerFragment();

  When(
    'I enter {string} in the comment poster input',
    (commentText: string = 'foo') => {
      activityComponent.enterTextInCommentPoster(commentText);
    }
  );

  Then('I wait for the upgrade comment supermind banner to appear', () => {
    supermindBannerFragment.waitForUpgradeCommentSupermindBanner();
  });
}
