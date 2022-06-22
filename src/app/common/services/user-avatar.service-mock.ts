import { BehaviorSubject } from 'rxjs';
import userMock from '../../mocks/responses/user.mock';

export let userAvatarServiceMock = new (function() {
  this.src$ = new BehaviorSubject(userMock.avatar_url.large);
})();
