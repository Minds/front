import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ActivityEntity } from '../activity.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ApiService } from '../../../../common/api/api.service';
import { Observable, Subscription, catchError, take, EMPTY } from 'rxjs';

/**
 * Notice that appears after a user clicks an
 * explicit downvote button and that post is
 * removed from the feed
 */
@Component({
  selector: 'm-activity__downvoteNotice',
  templateUrl: './downvote-notice.component.html',
  styleUrls: ['./downvote-notice.component.ng.scss'],
})
export class ActivityDownvoteNoticeComponent implements OnDestroy {
  constructor(
    private toast: ToasterService,
    private api: ApiService
  ) {}
  @Input() entity: ActivityEntity;

  // Used to remove a downvoted item from the feed.
  @Output() onUndo: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  inProgress: boolean = false;
  /**
   * When the user clicks the undo button,
   * remove the downvote and
   * add the post back to the feed
   */
  async undo($event) {
    this.inProgress = true;

    this.subscriptions.push(
      this.api
        .put('api/v1/thumbs/' + this.entity.guid + '/down', {})
        .pipe(
          take(1),
          catchError((e) => this.handleError(e))
        )
        .subscribe(() => {
          this.onUndo.emit($event);
          this.inProgress = false;
        })
    );
  }

  /**
   * Handles error.
   * @param e error.
   * @returns { Observable<null> } returns EMPTY.
   */
  private handleError(e): Observable<null> {
    this.inProgress = false;

    console.error(e);
    this.toast.error(e.message ?? 'An error occurred retrieving your settings');
    return EMPTY;
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
