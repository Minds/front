import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Boost partners notice - alerts users to the boost partners program
 * and gives them an easy way to learn more and/or change settings.
 */
@Component({
  selector: 'm-feedNotice--boostPartners',
  templateUrl: 'boost-partners-notice.component.html',
})
export class BoostPartnersNoticeComponent {
  @Input() public dismissible: boolean = true;

  constructor(private feedNotice: FeedNoticeService, private router: Router) {}

  /**
   * Called on primary option click.
   * Navigate to blog post and dismiss notice.
   * @param { MouseEvent } $event - click event.
   * @return { Promise<void> }
   */
  public async onPrimaryOptionClick(): Promise<void> {
    this.router.navigate([
      '/info/blog/introducing-boost-partners-program-1477787849246904328',
    ]);
    this.dismiss();
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
