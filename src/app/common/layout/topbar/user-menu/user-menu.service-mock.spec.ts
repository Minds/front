import { BehaviorSubject } from 'rxjs';

export let userMenuServiceMock = new (function () {
  this.isOpen$ = new BehaviorSubject(false);
})();
