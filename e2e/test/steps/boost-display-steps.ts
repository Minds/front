import { BoostRotatorComponent } from '../components/boostRotatorComponent';

namespace BoostDisplaySteps {
  const boostRotatorComponent = new BoostRotatorComponent();

  Before(() => {});

  When('I remind the boost featured in the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator();
    boostRotatorComponent.shouldSeeBoostRotator(true);
    boostRotatorComponent.toggleRemind();
  });

  When('I click to quote the boost featured in the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator();
    boostRotatorComponent.shouldSeeBoostRotator(true);
    boostRotatorComponent.openComposerForQuote();
  });

  Then('I should see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator();
    boostRotatorComponent.shouldSeeBoostRotator(true);
  });

  Then('I should not see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator();
    boostRotatorComponent.shouldSeeBoostRotator(false);
  });

  After(() => {});
}
