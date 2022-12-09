import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { CounterChangeFadeIn } from '../../../animations';
import { ToasterService } from '../../services/toaster.service';

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
      <i
        class="material-icons"
        [class.inProgress]="session.getLoggedInUser() && inProgress"
        >thumb_down</i
      >
      <span
        class="minds-counter"
        *ngIf="object['thumbs:down:count'] > 0 && !iconOnly"
        [@counterChange]="object['thumbs:down:count']"
        data-cy="data-minds-thumbs-down-counter"
        >{{ object['thumbs:down:count'] | number }}</span
      >
    </a>
  `,
  styleUrls: [`thumbs-up.component.ng.scss`],
  animations: [CounterChangeFadeIn],
})
export class ThumbsDownButton implements DoCheck {
  changesDetected: boolean = false;
  object;

  @Input() iconOnly = false;

  /** @type { boolean } whether request is inProgress. */
  public inProgress: boolean = false;

  /**
   * Call to let parent functions know a thumb down event has happened
   */
  @Output('thumbsDownChange') thumbsDownChange$: EventEmitter<
    void
  > = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef,
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private authModal: AuthModalService,
    private toast: ToasterService
  ) {}

  set _object(value: any) {
    this.object = value;
    if (!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  async thumb(): Promise<void> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.cd.detectChanges();
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return;
    }

    try {
      await this.client.put('api/v1/thumbs/' + this.object.guid + '/down', {});
    } catch (e) {
      this.toast.error(e?.message ?? 'An unknown error has occurred');
    }

    this.inProgress = false;

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

    this.cd.detectChanges();

    this.thumbsDownChange$.next();
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
