namespace SettingsSteps {
  const { I, settingsPage } = inject();

  Given('I am on the settings page', () => {
    I.amOnPage(settingsPage.settingsURI);
  });

  When('I am on the accounts settings page', () => {
    I.seeElement(locate('a').withText('Account'));
    I.click(locate('a').withText('Account'));
  });

  When('I am on the pro settings page', () => {
    I.seeElement(locate('a').withText('Pro'));
    I.click(locate('a').withText('Pro'));
  });

  When('I am on the security settings page', () => {
    I.seeElement(locate('a').withText('Security'));
    I.click(locate('a').withText('Security'));
  });

  When('I am on the payments settings page', () => {
    I.seeElement(locate('a').withText('Payments'));
    I.click(locate('a').withText('Payments'));
  });

  When('I am on the other settings page', () => {
    I.seeElement(locate('a').withText('Other'));
    I.click(locate('a').withText('Other'));
  });

  Then('I see top nested settings menus', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Account'));
    I.seeElement(locate('a').withText('Pro'));
    I.seeElement(locate('a').withText('Security'));
    I.seeElement(locate('a').withText('Payments'));
    I.seeElement(locate('a').withText('Other'));
  });

  Then('I see account submenus within settings', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Profile'));
    I.seeElement(locate('a').withText('Email Address'));
    I.seeElement(locate('a').withText('Language'));
    I.seeElement(locate('a').withText('Password'));
    I.seeElement(locate('a').withText('Boosted Content'));
    I.seeElement(locate('a').withText('NSFW Content'));
    I.seeElement(locate('a').withText('Share Buttons'));
    I.seeElement(locate('a').withText('Autoplay Videos'));
    I.seeElement(locate('a').withText('Messenger'));
    I.seeElement(locate('a').withText('Push Notifications'));
    I.seeElement(locate('a').withText('Email Notifications'));
    I.seeElement(locate('a').withText('Upgrade to Pro'));
    I.seeElement(locate('a').withText('Upgrade to Plus'));
  });

  Then('I see pro submenus within settings', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Payouts'));
  });

  Then('I see security submenus within settings', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Two-factor Authentication'));
    I.seeElement(locate('a').withText('Sessions'));
  });

  Then('I see payments submenus within settings', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Payment Methods'));
    I.seeElement(locate('a').withText('Recurring Payments'));
  });

  Then('I see other submenus within settings', () => {
    I.seeElement(settingsPage.settingsHeader);
    I.seeElement(locate('a').withText('Wallet'));
    I.seeElement(locate('a').withText('Reported Content'));
    I.seeElement(locate('a').withText('Blocked Channels'));
    I.seeElement(locate('a').withText('Subscription Tier Management'));
    I.seeElement(locate('a').withText('Youtube'));
    I.seeElement(locate('a').withText('Deactivate Account'));
    I.seeElement(locate('a').withText('Delete Account'));
  });
}
