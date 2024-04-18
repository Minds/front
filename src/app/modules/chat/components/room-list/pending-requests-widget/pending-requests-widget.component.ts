import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TotalChatRoomInviteRequestsService } from '../../../services/total-chat-room-invite-requests.service';
import { Observable } from 'rxjs';

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
      *ngIf="totalRequests$ | async as totalRequests"
      class="m-chatPendingRequestsWidget__container"
      (click)="onPendingRequestsWidgetClick()"
    >
      <div class="m-chatPendingRequestsWidget__containerLeft">
        <i class="material-icons">sms</i>
      </div>
      <div class="m-chatPendingRequestsWidget__containerRight">
        <p class="m-chatPendingRequestsWidget__title">Chat requests</p>
        <p class="m-chatPendingRequestsWidget__requestCount">
          {{ totalRequests }} pending requests
        </p>
      </div>
    </div>
  `,
})
export class ChatPendingRequestsWidgetComponent {
  /** Total chat requests from service. */
  protected totalRequests$: Observable<number> =
    this.totalChatRequestsService.totalRequests$;

  constructor(
    private router: Router,
    private totalChatRequestsService: TotalChatRoomInviteRequestsService
  ) {}

  /**
   * Handle on pending requests widget click.
   * @returns { void }
   */
  protected onPendingRequestsWidgetClick(): void {
    this.router.navigateByUrl('/chat/requests');
  }
}
