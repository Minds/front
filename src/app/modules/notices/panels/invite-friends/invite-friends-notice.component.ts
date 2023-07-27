import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ReferralUrlService } from '../../../../common/services/referral-url.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Invite your friends notice - alerts users to the referral program
 * and gives them an easy way to copy their referral link or learn more.
 */
@Component({
  selector: 'm-feedNotice--inviteFriends',
  templateUrl: 'invite-friends-notice.component.html',
})
export class InviteFriendsNoticeComponent extends AbstractSubscriberComponent {
  @Input() public dismissible: boolean = true;

  constructor(
    private feedNotice: FeedNoticeService,
    private referralUrl: ReferralUrlService,
    private toast: ToasterService,
    private router: Router
  ) {
    super();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { Promise<void> }
   */
  public async onPrimaryOptionClick(): Promise<void> {
    try {
      const referralUrl: string = this.referralUrl.get();

      if (!referralUrl) {
        throw new Error('Unable to get a referral URL');
      }

      await navigator.clipboard.writeText(referralUrl);
      this.toast.success('Invite link copied to clipboard');
    } catch (e) {
      console.error(e);
      this.toast.error('There was a problem getting your referral URL');
    }
  }

  /**
   * Called on secondary option click. Navigate to learn more.
   * @returns { void }
   */
  public onSecondaryOptionClick(): void {
    this.router.navigate(['/settings/affiliates-program']);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('invite-friends');
  }
}
