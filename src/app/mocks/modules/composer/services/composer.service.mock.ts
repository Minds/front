import { BehaviorSubject } from 'rxjs';

export let composerMockService = new (function() {
  this.tooManyTags$ = new BehaviorSubject(false);
  this.tags$ = new BehaviorSubject(null);

  this.ngOnDestroy = function() {};
})();
