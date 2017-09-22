import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session, SessionFactory } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WireCreatorComponent } from '../creator/creator.component';
import { SignupModalService } from '../../modals/signup/service';

@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireLockScreenComponent {

  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  @Input() preview: any;

  inProgress: boolean = false;

  session: Session = SessionFactory.build();

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private modal: SignupModalService
  ) { }

  unlock() {
    if (this.preview) {
      return;
    }

    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    this.inProgress = true;
    this.detectChanges();

    this.client.get('api/v1/wire/threshold/' + this.entity.guid)
      .then((response: any) => {
        if (response.hasOwnProperty('activity')) {
          this.update.next(response.activity);
          this.detectChanges();
        } else if (response.hasOwnProperty('entity')) {
          this.update.next(response.entity);
          this.detectChanges();
        } else {
          this.showWire();
        }
        this.inProgress = false;
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
        console.error('got error: ', e);
      });
  }

  showWire() {
    if (this.preview) {
      return;
    }

    this.overlayModal.create(WireCreatorComponent, this.entity, {
      onComplete: () => this.unlock(),
      default: this.entity.wire_threshold
    })
      .present();
  }

  getBackground() {
    if (!this.entity) {
      return;
    }

    if (this.entity._preview) {
      return `url(${this.entity.ownerObj.merchant.exclusive._backgroundPreview})`;
    }

    if (
      !this.entity.ownerObj
      || !this.entity.ownerObj.merchant
      || !this.entity.ownerObj.merchant.exclusive
      || !this.entity.ownerObj.merchant.exclusive.background
    ) {
      return null;
    }

    let image = window.Minds.cdn_url + 'fs/v1/paywall/preview/' + this.entity.ownerObj.guid + '/'
      + this.entity.ownerObj.merchant.exclusive.background;

    return `url(${image})`;
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
