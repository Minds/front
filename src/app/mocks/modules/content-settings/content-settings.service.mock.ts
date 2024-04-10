import { BehaviorSubject } from 'rxjs';

export let contentSettingsServiceMock = new (function () {
  this.activeTab$ = new BehaviorSubject('tags');
})();
