/**
 * Created by Nicolas on 10/10/2017.
 */

export let sessionMock = new function () {
  this.user = {
    guid: '1000',
    admin: true,
    plus: false,
    disabled_boost: false,
    username: 'test',
    show_boosts: true,
  };
  this.loggedIn = true;
  this.isAdmin = () => {
      return this.user.admin;
  };

  this.getLoggedInUser = () => {
    return this.user;
  };

  this.isLoggedIn = (fn) => {
    return this.loggedIn;
  };

  this.login = jasmine.createSpy('login');

  this.logout = jasmine.createSpy('logout');
};
