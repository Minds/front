import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  OnChanges,
  Input,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';

@Component({
  selector: 'minds-button-thumbs-up',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      (click)="thumb()"
      [ngClass]="{ selected: has() }"
      data-cy="data-minds-thumbs-up-button"
    >
      <i class="material-icons">thumb_up</i>
      <span
        class="minds-counter"
        *ngIf="object['thumbs:up:count'] > 0 && !iconOnly"
        data-cy="data-minds-thumbs-up-counter"
        >{{ object['thumbs:up:count'] | number }}</span
      >
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
export class ThumbsUpButton implements DoCheck, OnChanges {
  changesDetected: boolean = false;
  object = {
    guid: null,
    owner_guid: null,
    'thumbs:up:user_guids': [],
  };

  @Input() iconOnly = false;

  constructor(
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private authModal: AuthModalService,
    private cd: ChangeDetectorRef
  ) {}

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    if (!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  async thumb(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/up', {});
    if (!this.has()) {
      //this.object['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:up:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:up:count']++;
    } else {
      for (let key in this.object['thumbs:up:user_guids']) {
        if (
          this.object['thumbs:up:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
    }
  }

  has() {
    for (var guid of this.object['thumbs:up:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }

  ngOnChanges(changes) {}

  ngDoCheck() {
    this.changesDetected = false;
    if (this.object['thumbs:up:count'] != this.object['thumbs:up:count:old']) {
      this.object['thumbs:up:count:old'] = this.object['thumbs:up:count'];
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }
}
