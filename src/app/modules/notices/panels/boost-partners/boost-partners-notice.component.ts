import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Boost partners notice - alerts users to the boost partners program
 * and gives them an easy way to learn more and/or change settings.
 */
@Component({
  selector: 'm-feedNotice--boostPartners',
  templateUrl: 'boost-partners-notice.component.html',
})
export class BoostPartnersNoticeComponent extends AbstractSubscriberComponent {
  constructor(private feedNotice: FeedNoticeService, private router: Router) {
    super();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { Promise<void> }
   */
  public async onPrimaryOptionClick(): Promise<void> {
    this.router.navigate([
      '/info/blog/introducing-boost-partners-program-1477787849246904328',
    ]);
  }

  /**
   * Called on secondary option click. Navigate to boosted content settings.
   * @returns { void }
   */
  public onSecondaryOptionClick(): void {
    this.router.navigate(['/settings/account/boosted-content']);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('boost-partners');
  }
}
