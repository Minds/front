import { of } from 'rxjs';

export let notificationsSettingsV2ServiceMock = new (function() {
  this.pushNotificationsEnabled$ = of(true);
})();
