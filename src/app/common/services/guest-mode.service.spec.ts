import { BehaviorSubject } from 'rxjs';

export let guestServiceMock = new (function() {
  this.isGuest$ = new BehaviorSubject(false);
})();
