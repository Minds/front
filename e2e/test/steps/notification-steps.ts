import { NotificationsComponent } from '../components/notificationsComponent';

namespace NotificationSteps {
  const notificationsComponent = new NotificationsComponent();

  Before(() => {});

  When('I open my notifications', (): void => {
    notificationsComponent.openFlyout();
  });

  When('I click the first notification', (): void => {
    notificationsComponent.clickFirstNotification();
  });

  After(() => {});
}
