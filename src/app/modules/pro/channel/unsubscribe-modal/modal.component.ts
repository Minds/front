import { Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api/client';
import { Router } from '@angular/router';
import { ProChannelService } from '../channel.service';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'm-pro--unsubscribe-modal',
  templateUrl: 'modal.component.html',
})
export class ProUnsubscribeModalComponent {
  constructor(
    protected session: Session,
    private modalService: ModalService,
    protected client: Client,
    protected router: Router,
    protected channelService: ProChannelService
  ) {}

  close() {
    this.modalService.dismissAll();
  }

  async unsubscribe() {
    await this.channelService.unsubscribe();
    this.close();
  }

  get channelName() {
    return this.channelService.currentChannel.username;
  }

  setModalData() {}
}
