import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FeedNoticeService } from '../../services/feed-notice.service';

@Component({
  selector: 'm-feedNotice--supermindPending',
  templateUrl: 'supermind-pending-notice.component.html',
})
export class SupermindPendingNoticeComponent {
  @Input() public dismissible: boolean = false;

  constructor(private router: Router, private feedNotice: FeedNoticeService) {}

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public async onPrimaryOptionClick($event: MouseEvent): Promise<void> {
    this.router.navigate(['/supermind/inbox']);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('supermind-pending');
  }
}
