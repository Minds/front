// TODO actually implement these mocks when necessary for testing
import { EventEmitter } from '@angular/core';

export let scrollServiceMock = new (function () {
  this.listen = jasmine.createSpy('listen').and.stub();
  this.unListen = jasmine.createSpy('unListen').and.stub();
  this.listenForView = jasmine.createSpy('listenForView').and.callFake(() => {
    return new EventEmitter<any>();
  });

  this.viewEmitter = new EventEmitter<any>();
})();
