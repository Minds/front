/**
 * Created by Nicolas on 10/10/2017.
 */
import { EventEmitter } from '@angular/core';

export let sessionMock = new function () {
  this.isAdmin = () => {
      return true;
  };

  this.getLoggedInUser = () => {
    return {
      guid: '1000',
    }
  };

  this.isLoggedIn = (fn) => {
    return true;
  };

  this.login = () => { }

  this.logout = () => { }
};
