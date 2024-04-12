import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Feed notice directing users to boost their channel.
 */
@Component({
  selector: 'm-feedNotice--boostChannel',
  templateUrl: 'boost-channel-notice.component.html',
})
export class BoostChannelNoticeComponent implements OnInit, OnDestroy {
  @Input() public dismissible: boolean = true;

  private boostModalCompletionSubscription: Subscription;

  constructor(
    private feedNotice: FeedNoticeService,
    private boostModal: BoostModalV2LazyService,
    private session: Session
  ) {}

  ngOnInit(): void {
    this.boostModalCompletionSubscription =
      this.boostModal.onComplete$.subscribe((completed: boolean) => {
        this.onDismissClick();
      });
  }

  ngOnDestroy(): void {
    this.boostModalCompletionSubscription?.unsubscribe();
  }

  /**
   * Called on primary option click. Opens boost modal.
   * @return { void }
   */
  public onPrimaryOptionClick(): void {
    this.boostModal.open(this.session.getLoggedInUser());
  }

  /**
   * Called on secondary option click. Opens boost marketing page in a new tab.
   * @return { void }
   */
  public onSecondaryOptionClick(): void {
    window.open('/boost', '_blank');
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public onDismissClick(): void {
    this.feedNotice.dismiss('boost-channel');
  }
}
