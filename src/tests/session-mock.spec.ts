/**
 * Created by Nicolas on 10/10/2017.
 */
import { EventEmitter } from '@angular/core';

export let sessionMock = new (function() {
  this.user = {
    guid: '1000',
    type: 'user',
    admin: true,
    is_admin: true,
    plus: false,
    pro: false,
    disabled_boost: false,
    username: 'test',
    name: 'test',
    show_boosts: true,
    hide_share_buttons: false,
    dismissed_notices: [],
  };
  this.loggedIn = true;
  this.isAdmin = () => {
    return this.user.admin;
  };

  this.userEmitter = new EventEmitter<any>();

  this.loggedinEmitter = new EventEmitter<any>();

  this.getLoggedInUser = () => {
    return this.user;
  };

  this.isLoggedIn = () => {
    return this.loggedIn;
  };

  this.inject = jasmine.createSpy('inject');
  this.login = jasmine.createSpy('login');
  this.logout = jasmine.createSpy('logout');
})();
