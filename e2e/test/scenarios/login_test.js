Feature('Login Tests');

Scenario('test login feature', ({ I }) => {
  I.amOnPage('https://minds.com/login/');
  I.seeElement('#username');
  I.fillField('#username', 'tanyatest');
  I.seeElement('#password');
  I.fillField('#password', 'Toast@123');
  I.click(locate('.button').withText('Login'));
  I.seeElement('[title="Home"]');
});
