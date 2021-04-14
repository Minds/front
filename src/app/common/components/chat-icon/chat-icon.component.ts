import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-chatIcon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.ng.scss'],
})
export class ChatIconComponent implements OnInit {
  readonly chatUrl: string;
  inProgress = false;
  unread: number = 0;

  @Input() floating: boolean = false;

  constructor(
    protected client: Client,
    protected session: Session,
    protected configs: ConfigsService
  ) {
    this.chatUrl = this.configs.get('matrix')?.chat_url;
  }

  ngOnInit(): void {
    if (this.session.getLoggedInUser()) {
      this.getTotalUnread();
    }
  }

  async getTotalUnread() {
    this.inProgress = true;

    try {
      const response: any = await this.client.get('api/v3/matrix/total-unread');
      this.unread = response.total_unread;
    } catch (e) {}

    this.inProgress = false;
  }
}
