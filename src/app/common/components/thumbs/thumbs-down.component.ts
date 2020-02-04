import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'minds-button-thumbs-down',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      (click)="thumb()"
      [ngClass]="{ selected: has() }"
      data-cy="data-minds-thumbs-down-button"
    >
      <img
        class="m-buttonsThumbsDown__icon"
        [src]="cdn_assets_url + 'assets/icons/downvote.svg'"
      />
      <span
        class="minds-counter"
        *ngIf="object['thumbs:down:count'] > 0"
        data-cy="data-minds-thumbs-down-counter"
      >
        {{ object['thumbs:down:count'] | number }}
      </span>
    </a>
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `,
  ],
})
export class ThumbsDownButton implements DoCheck {
  changesDetected: boolean = false;
  object;
  showModal: boolean = false;
  cdn_assets_url: string;

  constructor(
    private cd: ChangeDetectorRef,
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private modal: SignupModalService,
    private configs: ConfigsService
  ) {
    this.cdn_assets_url = this.configs.get('cdn_assets_url');
  }

  set _object(value: any) {
    this.object = value;
    if (!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  thumb() {
    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel to vote').open();
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/down', {});
    if (!this.has()) {
      //this.object['thumbs:down:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:down:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:down:count']++;
    } else {
      for (let key in this.object['thumbs:down:user_guids']) {
        if (
          this.object['thumbs:down:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:down:user_guids'][key];
      }
      this.object['thumbs:down:count']--;
    }
  }

  has() {
    for (var guid of this.object['thumbs:down:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }

  ngDoCheck() {
    this.changesDetected = false;
    if (this.object['thumbs:down:count'] != this.object['thumbs:up:down:old']) {
      this.object['thumbs:down:count:old'] = this.object['thumbs:down:count'];
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }
}
