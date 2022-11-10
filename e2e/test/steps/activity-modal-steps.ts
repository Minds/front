import { ActivityModalComponent } from '../components/activityModalComponent';

namespace ActivityModalSteps {
  const activityModal = new ActivityModalComponent();

  Before(() => {});

  Then('I should see the activity modal', () => {
    activityModal.shouldBeVisible();
  });

  After(() => {});
}
