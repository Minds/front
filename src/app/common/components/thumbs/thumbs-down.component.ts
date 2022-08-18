import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { CounterChangeFadeIn } from '../../../animations';

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
      <i class="material-icons">thumb_down</i>
      <span
        class="minds-counter"
        *ngIf="object['thumbs:down:count'] > 0 && !iconOnly"
        [@counterChange]="object['thumbs:down:count']"
        data-cy="data-minds-thumbs-down-counter"
        >{{ object['thumbs:down:count'] | number }}</span
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
  animations: [CounterChangeFadeIn],
})
export class ThumbsDownButton implements DoCheck {
  changesDetected: boolean = false;
  object;

  @Input() iconOnly = false;

  constructor(
    private cd: ChangeDetectorRef,
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private authModal: AuthModalService
  ) {}

  set _object(value: any) {
    this.object = value;
    if (!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  async thumb(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
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

  ngOnChanges(changes) {}

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
