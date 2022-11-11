namespace NotificationSteps {
  const { notificationsComponent } = inject();

  When('I open my notifications', (): void => {
    notificationsComponent.openFlyout();
  });

  When('I click the first notification', (): void => {
    notificationsComponent.clickFirstNotification();
  });
}
