/**
 * Created by Nicolas on 10/10/2017.
 */
import { EventEmitter } from '@angular/core';

export let sessionMock = new (function() {
  this.user = {
    guid: '1000',
    admin: true,
    is_admin: true,
    plus: false,
    disabled_boost: false,
    username: 'test',
    show_boosts: true,
    hide_share_buttons: false,
  };
  this.loggedIn = true;
  this.isAdmin = () => {
    return this.user.admin;
  };

  this.userEmitter = new EventEmitter<any>();

  this.getLoggedInUser = () => {
    return this.user;
  };

  this.isLoggedIn = () => {
    return this.loggedIn;
  };

  this.login = jasmine.createSpy('login');

  this.logout = jasmine.createSpy('logout');
})();
