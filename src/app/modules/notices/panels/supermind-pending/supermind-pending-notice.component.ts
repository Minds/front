import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-feedNotice--supermindPending',
  templateUrl: 'supermind-pending-notice.component.html',
})
export class SupermindPendingNoticeComponent {
  constructor(private router: Router) {}

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public async onPrimaryOptionClick($event: MouseEvent): Promise<void> {
    this.router.navigate(['/supermind/inbox']);
  }
}
