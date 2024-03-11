import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

/**
 * Pending requests widget for chat.
 */
@Component({
  selector: 'm-chatPendingRequests__widget',
  styleUrls: ['./pending-requests-widget.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, RouterModule],
  standalone: true,
  template: `
    <div
      *ngIf="hasPendingRequests"
      class="m-chatPendingRequestsWidget__container"
      (click)="onPendingRequestsWidgetClick()"
    >
      <div class="m-chatPendingRequestsWidget__containerLeft">
        <i class="material-icons">sms</i>
      </div>
      <div class="m-chatPendingRequestsWidget__containerRight">
        <p class="m-chatPendingRequestsWidget__title">Chat requests</p>
        <p class="m-chatPendingRequestsWidget__requestCount">
          X pending requests
        </p>
      </div>
    </div>
  `,
})
export class ChatPendingRequestsWidgetComponent {
  // TODO: Replace with dynamic and real value.
  protected hasPendingRequests: boolean = false;

  constructor(private router: Router) {}

  /**
   * Handle on pending requests widget click.
   * @returns { void }
   */
  protected onPendingRequestsWidgetClick(): void {
    this.router.navigateByUrl('/chat/requests');
  }
}
