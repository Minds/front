import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

/**
 * Request list for chat.
 */
@Component({
  selector: 'm-chat__requestList',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  standalone: true,
})
export class ChatRequestListComponent {
  constructor(private router: Router) {}

  /**
   * Handles back icon click.
   * @returns { void }
   */
  protected onBackIconClick(): void {
    this.router.navigateByUrl('/chat/rooms');
  }
}
