import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { SignupModalService } from '../../../modals/signup/service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { RemindComposerModalComponent } from '../../../modals/remind-composer-v2/reminder-composer.component';

@Component({
  selector: 'minds-button-remind',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a (click)="remind()" [ngClass]="{ selected: reminded }">
      <i class="material-icons">repeat</i>
      <span class="minds-counter" *ngIf="counter > 0">{{
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

  constructor(
    public overlayModal: OverlayModalService,
    public session: Session,
    public client: Client,
    private modal: SignupModalService,
    private cd: ChangeDetectorRef
  ) {}

  set _object(value: any) {
    this.object = value;
    this.counter = this.object.reminds;
    this.reminded = !!this.object.reminded;
  }

  remind() {
    if (this.object.reminded) return false;

    if (!this.session.isLoggedIn()) {
      this.modal.open();
      return false;
    }

    this.remindOpen = true;
    this.overlayModal
      .create(RemindComposerModalComponent, this.object, {
        class: 'm-overlayModal--remind',
      })
      .onDidDismiss(() => {
        this.remindOpen = false;
        this.counter = this.object.reminds;
        this.reminded = this.object.reminded;
        this.detectChanges();
      })
      .present();
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
