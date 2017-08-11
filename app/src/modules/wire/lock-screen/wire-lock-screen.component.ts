import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { OverlayModalService } from "../../../services/ux/overlay-modal";
import { WireCreatorComponent } from "../creator/creator.component";

@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireLockScreenComponent implements AfterViewInit {

  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  @Input() preview: any;

  inProgress: boolean = false;

  constructor(private client: Client, public session: Session, private cd: ChangeDetectorRef, private overlayModal: OverlayModalService) {
  }

  ngAfterViewInit() {
  }

  unlock() {
    if (this.preview) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    this.client.get('api/v1/wire/threshold/' + this.entity.guid)
      .then((response: any) => {
        if (response.hasOwnProperty('activity')) {
          this.update.next(response.activity);
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

    if (!this.entity.ownerObj || !this.entity.ownerObj.merchant || !this.entity.ownerObj.merchant.exclusive || !this.entity.ownerObj.merchant.exclusive.background) {
      return null;
    }

    let image = window.Minds.cdn_url + 'fs/v1/paywall/preview/' + this.entity.ownerObj.guid + '/' + this.entity.ownerObj.merchant.exclusive.background;

    return `url(${image})`;
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}