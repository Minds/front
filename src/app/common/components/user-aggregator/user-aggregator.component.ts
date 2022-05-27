import { Component, Input } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';

/**
 * Will display avatars, usernames and an "and X others" in a row.
 * e.g. "OOO @\user1, @\user2, @\user3 and 2 others".
 */
@Component({
  selector: 'm-userAggregator',
  templateUrl: './user-aggregator.component.html',
  styleUrls: ['./user-aggregator.component.ng.scss'],
})
export class UserAggregatorComponent {
  /**
   * List of users to use.
   * @type { MindsUser[] }
   */
  @Input() users: MindsUser[];

  /**
   * Override the total count so that you can only pass a few
   * hydrated users through and have an "and X others summary.
   * @type { number }
   */
  @Input() totalCount: number;

  /**
   * Amount of usernames to show.
   * @type { number }
   */
  @Input() usernameAmount: number = 2;

  /**
   * Amount of avatars to show.
   * @type { number }
   */
  @Input() avatarAmount: number = 3;
}
