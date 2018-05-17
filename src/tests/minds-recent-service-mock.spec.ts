// TODO actually implement these mocks when necessary for testing
import { EventEmitter } from '@angular/core';

export let recentServiceMock = new function () {
  this.store = jasmine.createSpy('fire').and.stub();
  this.fetch = jasmine.createSpy('listen').and.stub();
  this.splice = jasmine.createSpy('unListen').and.stub();

};
