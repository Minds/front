/**
 * Created by Nicolas on 10/10/2017.
 */
import { EventEmitter } from '@angular/core';

export let sessionMock = new function () {
  this.isAdmin = () => {
      return true;
  };
};
