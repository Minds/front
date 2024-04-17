import { BehaviorSubject } from 'rxjs';

export let themeServiceMock = new (function () {
  this.isDark$ = new BehaviorSubject(false);
})();
