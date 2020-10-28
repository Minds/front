import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { RemindComposerModalComponent } from '../../../modals/remind-composer-v2/reminder-composer.component';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../../../services/ux/stackable-modal.service';

@Component({
  selector: 'minds-button-remind',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a (click)="remind()" [ngClass]="{ selected: reminded }">
      <i class="material-icons">repeat</i>
      <span class="minds-counter" *ngIf="!iconOnly && counter > 0">{{
        counter | number
      }}</span>
    </a>
  `,
})
export class RemindButton {
  object;
  showModal: boolean = false;
  message: string = '';
  remindOpen: boolean = false;
  counter: number = 0;
  reminded: boolean = false;

  @Input()
  iconOnly?: boolean = false;

  constructor(
    public overlayModal: OverlayModalService,
    public session: Session,
    public client: Client,
    private authModal: AuthModalService,
    private cd: ChangeDetectorRef,
    private stackableModal: StackableModalService
  ) {}

  set _object(value: any) {
    this.object = value;
    this.counter = this.object.reminds;
    this.reminded = !!this.object.reminded;
  }

  async remind(): Promise<boolean> {
    if (this.object.reminded) return false;

    if (!this.session.isLoggedIn()) {
      await this.authModal.open();
    }

    this.remindOpen = true;

    const stackableModalEvent: StackableModalEvent = await this.stackableModal
      .present(RemindComposerModalComponent, this.object, {
        class: 'm-overlayModal--remind',
      })
      .toPromise();
    if (stackableModalEvent.state === StackableModalState.Dismissed) {
      this.remindOpen = false;
      this.counter = this.object.reminds;
      this.reminded = this.object.reminded;
      this.detectChanges();
    }
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
