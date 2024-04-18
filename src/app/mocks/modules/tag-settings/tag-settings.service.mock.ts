import { BehaviorSubject } from 'rxjs';

export let tagSettingsServiceMock = new (function () {
  this.submitRequested$ = new BehaviorSubject('tags');
})();
