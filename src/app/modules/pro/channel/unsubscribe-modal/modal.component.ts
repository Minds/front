import { Component, Input, OnInit } from '@angular/core';
import { Session } from "../../../../services/session";
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MindsUser } from "../../../../interfaces/entities";
import { Client } from "../../../../services/api/client";
import { Router } from '@angular/router';
import { ProChannelService } from '../channel.service';

@Component({
  selector: 'm-pro--unsubscribe-modal',
  templateUrl: 'modal.component.html'
})

export class ProUnsubscribeModalComponent implements OnInit {
  protected channel: MindsUser;

  @Input('channel') set data(data) {
    this.channel = data;
  }

  constructor(
    protected session: Session,
    private overlayModal: OverlayModalService,
    protected client: Client,
    protected router: Router,
    protected channelService: ProChannelService,
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.overlayModal.dismiss();
  }

  async unsubscribe() {
    await this.channelService.unsubscribe();
    this.close();
  }

  get channelName() {
    return this.channel.username;
  }

  
}
