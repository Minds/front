import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  HostBinding,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { SignupModalService } from '../../modals/signup/service';
import { ConfigsService } from '../../../common/services/configs.service';
import { WireModalService } from '../wire-modal.service';
import getActivityContentType from '../../../helpers/activity-content-type';
import { FeaturesService } from '../../../services/features.service';
import { WireEventType } from '../v2/wire-v2.service';

export type PaywallType = 'plus' | 'tier' | 'custom';
@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WireLockScreenComponent implements OnInit {
  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  @Input() preview: any;
  @Input() mediaHeight: number | null = null;
  @Input() showLegacyPaywall: boolean = true;

  init: boolean = false;
  showSubmittedInfo: boolean = false;
  inProgress: boolean = false;
  contentType: string;
  hasTeaser: boolean = false;
  paywallType: PaywallType = 'custom';
  tierName: string | null;
  messageTopOffset: string = '50px';

  @HostBinding('class.m-wire--lock-screen-2020')
  isPaywall2020: boolean = false;

  constructor(
    public session: Session,
    private client: Client,
    private cd: ChangeDetectorRef,
    private wireModal: WireModalService,
    private signupModal: SignupModalService,
    private configs: ConfigsService,
    private featuresService: FeaturesService
  ) {}

  ngOnInit() {
    if (!this.entity) {
      return;
    }
    this.contentType = getActivityContentType(this.entity);
    if (this.contentType === 'video' || this.contentType === 'rich-embed') {
      this.hasTeaser = true;
    }

    if (this.featuresService.has('paywall-2020') && !this.showLegacyPaywall) {
      this.isPaywall2020 = true;
      this.getPaywallType();
      if (this.mediaHeight) {
        if (this.mediaHeight === 0) {
          this.mediaHeight = 410;
        }
        this.messageTopOffset = `${this.mediaHeight / 2}px`;
      }
      this.init = true;
    }

    this.detectChanges();
  }

  // This is temporary until we get this.entity.support_tier. And it should be in the activity service
  getPaywallType(): void {
    // this.paywallType = 'plus';
    // this.paywallType = 'tier';
    this.paywallType = 'custom';
  }

  unlock() {
    if (this.preview) {
      return;
    }

    if (!this.session.isLoggedIn()) {
      this.signupModal.open();

      return;
    }

    this.showSubmittedInfo = false;
    this.inProgress = true;
    this.detectChanges();

    this.client
      .get('api/v1/wire/threshold/' + this.entity.guid)
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

  async showWire() {
    if (this.preview) {
      return;
    }

    await this.wireModal
      .present(this.entity, {
        default: this.entity.wire_threshold,
      })
      .subscribe(payEvent => {
        if (payEvent.type === WireEventType.Completed) {
          this.wireSubmitted();
        }
      });
    // .toPromise();
    // this.wireSubmitted();
  }

  wireSubmitted() {
    this.showSubmittedInfo = true;
    this.detectChanges();
  }

  isOwner() {
    return this.entity.ownerObj.guid === this.session.getLoggedInUser().guid;
  }

  /**
   * legacy (not paywall-2020)
   */
  getBackground() {
    if (!this.entity) {
      return;
    }

    if (this.entity._preview) {
      return `url(${this.entity.ownerObj.merchant.exclusive._backgroundPreview})`;
    }

    if (
      !this.entity.ownerObj ||
      !this.entity.ownerObj.merchant ||
      !this.entity.ownerObj.merchant.exclusive ||
      !this.entity.ownerObj.merchant.exclusive.background
    ) {
      return null;
    }

    let image =
      this.configs.get('cdn_assets_url') +
      'fs/v1/paywall/preview/' +
      this.entity.ownerObj.guid +
      '/' +
      this.entity.ownerObj.merchant.exclusive.background;

    return `url(${image})`;
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
