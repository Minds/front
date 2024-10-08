import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { InteractionsModalService } from '../../../../modules/newsfeed/interactions-modal/interactions-modal.service';
import { SlowFadeAnimation } from '../../../../animations';
import { MindsUser } from '../../../../interfaces/entities';
import { MutualSubscriptionsService } from './mutual-subscriptions.service';

@Component({
  selector: 'm-channel__mutualSubscriptions',
  templateUrl: './mutual-subscriptions.component.html',
  styleUrls: ['./mutual-subscriptions.component.ng.scss'],
  animations: [SlowFadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutualSubscriptionsComponent {
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

  constructor(
    private service: MutualSubscriptionsService,
    private interactionsModal: InteractionsModalService
  ) {}

  /**
   * When a new userGuid is set, fetch from the API
   */
  @Input() set userGuid(userGuid: string) {
    this.service.userGuid$.next(userGuid);
  }

  async onClick() {
    const userGuid = await this.service.userGuid$.pipe(take(1)).toPromise();
    this.interactionsModal.open('mutual-subscribers', userGuid);
  }
}
