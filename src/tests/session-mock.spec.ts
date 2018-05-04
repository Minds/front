/**
 * Created by Nicolas on 10/10/2017.
 */
import { EventEmitter } from '@angular/core';

export let sessionMock = new function () {
  this.user = {guid : '1000'};
  this.loggedIn = true;
  this.isAdmin = () => {
      return true;
  };

  this.getLoggedInUser = () => {
    return this.user;
  };

  this.isLoggedIn = (fn) => {
    return this.loggedIn;
  };

  this.login = () => { };

  this.logout = () => { }
};
