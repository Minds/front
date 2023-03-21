import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SlowFadeAnimation } from '../../../../../animations';
import { MindsUser } from '../../../../../interfaces/entities';
import { MutualSubscriptionsService } from '../../../../channels/v2/mutual-subscriptions/mutual-subscriptions.service';
import { InteractionsModalService } from '../../../interactions-modal/interactions-modal.service';

@Component({
  selector: 'm-activityFlag__mutualSubscriptions',
  templateUrl: './mutual-subscriptions.component.html',
  styleUrls: ['./mutual-subscriptions.component.ng.scss'],
  animations: [SlowFadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFlagMutualSubscriptionsComponent {
  /**
   * In progress state, used to aid the fade animation
   */
  inProgress$ = this.service.inProgress$;

  /**
   * Users to display in the avatars and name sections of the
   * aggregator
   */
  users$: Observable<MindsUser[]> = this.service.users$;

  /**
   * Total count of subscribers, including users to show in aggregator
   */
  totalCount$: Observable<number> = this.service.totalCount$;

  /**
   * The user we are checking for mutual subscriptions with
   */
  _user: MindsUser;

  constructor(
    private service: MutualSubscriptionsService,
    private interactionsModal: InteractionsModalService
  ) {}

  /**
   * When a new userGuid is set, fetch from the API
   */
  @Input() set user(user: MindsUser) {
    this._user = user;
    this.service.userGuid$.next(user.guid);
  }

  async onClick() {
    const userGuid = await this.service.userGuid$.pipe(take(1)).toPromise();
    this.interactionsModal.open('mutual-subscribers', userGuid);
  }
}
