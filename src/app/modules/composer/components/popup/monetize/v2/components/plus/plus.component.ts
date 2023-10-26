import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { WirePaymentHandlersService } from '../../../../../../../wire/wire-payment-handlers.service';
import { Session } from '../../../../../../../../services/session';
import { WireCreatorComponent } from '../../../../../../../wire/v2/creator/wire-creator.component';
import { ComposerService } from '../../../../../../services/composer.service';
import { ConfigsService } from '../../../../../../../../common/services/configs.service';
import { DialogService } from '../../../../../../../../common/services/confirm-leave-dialog.service';
import { ModalService } from '../../../../../../../../services/ux/modal.service';

export type PlusPostExpiry = number | null;

/**
 * Allows users to monetize a post by joining the Minds+ pool.
 * If the user is not already a Minds+ user, they are prompted to upgrade
 */
@Component({
  selector: 'm-composer__monetizeV2__plus',
  templateUrl: './plus.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComposerMonetizeV2PlusComponent implements OnInit {
  readonly plusSupportTierUrn: string;

  readonly twoDays = 172800; // in seconds

  /**
   * If the user is Pro
   */
  isPro: boolean;

  /**
   * If the user is Plus
   */
  isPlus: boolean;

  /**
   * Terms & Conditions accepted state
   */
  termsAccepted: boolean = false;

  /**
   * Seconds after which paywall is disabled
   */
  expires: PlusPostExpiry = null;

  /**
   * Whether an existing post with a
   * plus paywall is being edited
   */
  @Input() isEditingPlus: boolean = false;

  /**
   * Signal event emitter to parent
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private service: ComposerService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    private session: Session,
    private dialogService: DialogService,
    configs: ConfigsService
  ) {
    this.plusSupportTierUrn =
      configs.get('plus').support_tier_urn || 'urn:support-tier:plus';
  }

  ngOnInit(): void {
    const monetization =
      this.service.pendingMonetization$.getValue() ||
      this.service.monetization$.getValue();

    if (monetization && monetization.support_tier) {
      this.termsAccepted =
        monetization.support_tier.urn === this.plusSupportTierUrn;

      this.expires = monetization.support_tier.expires;

      if (this.expires && this.expires !== this.twoDays) {
        this.expires = null;
      }
    }
    this.setup();
  }

  setup(): void {
    this.isPro = this.session.getLoggedInUser().pro;
    this.isPlus = this.session.getLoggedInUser().plus;

    this.detectChanges();
    setTimeout(() => this.detectChanges(), 1);
  }

  setExpires(expires: PlusPostExpiry): void {
    if (this.isEditingPlus) {
      return;
    }
    this.expires = expires;
  }

  async openPlusUpgradeModal(): Promise<void> {
    const plusEntity = await this.wirePaymentHandlers.get('plus');
    let completed = false;

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: plusEntity,
        default: {
          type: 'money',
          upgradeType: 'plus',
        },
        onComplete: wire => {
          completed = true;
          this.isPlus = true;
          this.detectChanges();
          modal.close(wire);
        },
      },
    });

    const result = await modal.result;

    if (!result) {
      this.isPlus = completed;
    }
  }

  onTermsChange(value): void {
    if (value) {
      this.termsAccepted = true;
    } else {
      this.termsAccepted = false;
    }
  }

  /**
   * Emits the internal state to the composer service and attempts to dismiss the modal
   */
  save(): void {
    if (!this.canSave) {
      return;
    }

    if (!this.termsAccepted) {
      this.service.pendingMonetization$.next(null);
      this.dismissIntent.emit();
      return;
    }

    const support_tier: any = {
      urn: this.plusSupportTierUrn,
    };

    if (this.expires) {
      support_tier['expires'] = this.expires;
    }

    this.service.pendingMonetization$.next({
      type: 'plus',
      name: 'Minds+',
      support_tier: support_tier,
    });
    this.dismissIntent.emit();
  }

  get canSave(): boolean {
    return !this.isEditingPlus;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
