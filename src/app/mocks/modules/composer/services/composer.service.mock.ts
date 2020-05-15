import { BehaviorSubject } from 'rxjs';

export let composerMockService = new (function() {
  this.tooManyTags$ = new BehaviorSubject(false);

  this.ngOnDestroy = function() {};
})();
