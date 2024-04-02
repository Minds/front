import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatPageLayoutComponent } from '../../layout/layout.component';
import { ChatRequestListComponent } from '../../request-list/request-list.component';

/**
 * Requests page for chat.
 */
@Component({
  selector: 'm-chat__requestsPage',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    RouterModule,
    ChatRequestListComponent,
    ChatPageLayoutComponent,
  ],
  standalone: true,
})
export class ChatRequestsPageComponent {}
