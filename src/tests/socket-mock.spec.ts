import { EventEmitter } from '@angular/core';

export let socketMock = new (function () {
  this.subscribe = jasmine.createSpy('subscribe').and.stub();

  this.emit = jasmine.createSpy('emit').and.stub();
})();
