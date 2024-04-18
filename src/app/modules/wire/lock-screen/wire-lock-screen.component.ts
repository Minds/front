import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { WireModalService } from '../wire-modal.service';
import getActivityContentType from '../../../helpers/activity-content-type';
import { WireEventType } from '../v2/wire-v2.service';
import { WirePaymentHandlersService } from '../wire-payment-handlers.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';

/**
 * Blocks access to paywalled activities for users who haven't paid
 *
 * See it in a paywalled activity
 */
export type PaywallType = 'plus' | 'tier' | 'custom';
@Component({
  moduleId: module.id,
  selector: 'm-wire--lock-screen',
  templateUrl: 'wire-lock-screen.component.html',
  styleUrls: ['wire-lock-screen.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WireLockScreenComponent implements OnInit {
  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  @Input() preview: any;
  @Input() mediaHeight: number | null = null;
  @Input() minimalMode: boolean = false;
  @Input() hideText: boolean = false;

  init: boolean = false;
  showSubmittedInfo: boolean = false;
  inProgress: boolean = false;
  contentType: string;
  hasTeaser: boolean = false;
  tierName: string | null;
  isCustom: boolean = false;

  readonly plusSupportTierUrn: string;

  constructor(
    public session: Session,
    private client: Client,
    private cd: ChangeDetectorRef,
    private wireModal: WireModalService,
    private configs: ConfigsService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private authModal: AuthModalService
  ) {
    this.plusSupportTierUrn = configs.get('plus')['support_tier_urn'];
  }

  ngOnInit() {
    if (!this.entity) {
      return;
    }

    this.contentType = getActivityContentType(this.entity);
    if (this.contentType === 'video' || this.contentType === 'rich-embed') {
      this.hasTeaser = true;
    }

    if (this.mediaHeight) {
      if (this.mediaHeight === 0) {
        this.mediaHeight = 410;
      }
    }

    if (
      this.entity.wire_threshold &&
      this.entity.wire_threshold.support_tier &&
      !this.entity.wire_threshold.support_tier.public
    ) {
      this.isCustom = true;
    }

    this.init = true;

    this.detectChanges();
  }

  async unlock(): Promise<void> {
    if (this.preview) {
      return;
    }

    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) return null;
    }

    if (this.inProgress) return;

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
          this.showModal();
        }
        this.inProgress = false;
        this.detectChanges();
      })
      .catch((e) => {
        this.inProgress = false;
        this.detectChanges();

        if (
          e.errorId === 'Minds::Core::Wire::Paywall::PaywallUserNotPaid' ||
          e.errorId === 'Minds::Core::Router::Exceptions::UnauthorizedException'
        ) {
          this.showModal();
        } else {
          console.error('got error: ', e);
        }
      });
  }

  showModal(): void {
    if (this.isPlus) {
      this.showUpgradeModal();
    } else {
      this.showWire();
    }
  }

  async showWire() {
    if (this.preview) {
      return;
    }

    const payEvent = await this.wireModal.present(this.entity, {
      //default: this.entity.wire_threshold,
      supportTier: this.entity.wire_threshold.support_tier,
    });

    if (payEvent.type === WireEventType.Completed) {
      // this.wireSubmitted();
      this.unlock(); // TODO: check onchain wires don't get stuck in a loop?
    }
  }

  async showUpgradeModal(): Promise<void> {
    const wireEvent = await this.wireModal.present(
      await this.wirePaymentHandlers.get('plus'),
      {
        default: {
          type: 'money',
          upgradeType: 'plus',
        },
        sourceEntity: this.entity,
      }
    );
    if (wireEvent.type === WireEventType.Completed) {
      this.unlock();
    }
  }

  wireSubmitted() {
    this.showSubmittedInfo = true;
    this.detectChanges();
  }

  isOwner() {
    return this.entity.ownerObj.guid === this.session.getLoggedInUser().guid;
  }

  get isPlus(): boolean {
    return (
      this.entity.wire_threshold.support_tier?.urn === this.plusSupportTierUrn
    );
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
