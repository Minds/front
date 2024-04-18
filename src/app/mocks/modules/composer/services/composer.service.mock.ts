import { BehaviorSubject } from 'rxjs';

export let composerMockService = new (function () {
  this.tooManyTags$ = new BehaviorSubject(false);
  this.tags$ = new BehaviorSubject(null);
  this.accessId$ = new BehaviorSubject('0');
  this.license$ = new BehaviorSubject(null);
  this.monetization$ = new BehaviorSubject(null);

  this.ngOnDestroy = function () {};
})();
