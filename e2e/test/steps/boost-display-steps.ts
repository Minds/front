import BoostRotatorComponent from '../components/boostRotatorComponent';

namespace BoostDisplaySteps {
  const boostRotatorComponent = new BoostRotatorComponent();

  Then('I should see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedEndpoint();
    boostRotatorComponent.shouldSeeBoostRotator(true);
  });

  Then('I should not see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedEndpoint();
    boostRotatorComponent.shouldSeeBoostRotator(false);
  });
}
