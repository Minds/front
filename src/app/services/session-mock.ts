import { EventEmitter } from '@angular/core';
import userMock from '../mocks/responses/user.mock';

export let sessionMock = new (function () {
  this.user = userMock;
  this.loggedIn = true;
  this.isAdmin = () => {
    return this.user.admin;
  };

  this.userEmitter = new EventEmitter<any>();

  this.loggedInEmitter = new EventEmitter<any>();

  this.getLoggedInUser = () => {
    return this.user;
  };

  this.isLoggedIn = () => {
    return this.loggedIn;
  };
})();
