import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProService } from '../../../../../../../pro/pro.service';
import { WirePaymentHandlersService } from '../../../../../../../wire/wire-payment-handlers.service';
import { WireModalService } from '../../../../../../../wire/wire-modal.service';
import { WireEventType } from '../../../../../../../wire/v2/wire-v2.service';
import { Session } from '../../../../../../../../services/session';
import { PopupService } from '../../../../popup.service';
import { WireCreatorComponent } from '../../../../../../../wire/v2/creator/wire-creator.component';
import {
  StackableModalService,
  StackableModalState,
  StackableModalEvent,
} from '../../../../../../../../services/ux/stackable-modal.service';
import { ComposerService } from '../../../../../../services/composer.service';
import { ConfigsService } from '../../../../../../../../common/services/configs.service';
import { DialogService } from '../../../../../../../../common/services/confirm-leave-dialog.service';

export type PlusPostExpiry = 172800 | null;

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
   * Terms & Conditions accepted state
   */
  termsAccepted: boolean = false;

  /**
   * Seconds after which paywall is disabled
   */
  expires: PlusPostExpiry = this.twoDays;

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
    private configs: ConfigsService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private cd: ChangeDetectorRef,
    private stackableModal: StackableModalService,
    private session: Session,
    private dialogService: DialogService
  ) {
    this.plusSupportTierUrn =
      configs.get('plus').support_tier_urn || 'urn:support-tier:plus';
  }

  ngOnInit(): void {
    const monetization = this.service.monetization$.value;

    if (monetization && monetization.support_tier) {
      this.termsAccepted =
        monetization.support_tier.urn === this.plusSupportTierUrn;
      const expires = monetization.support_tier.expires;
      if (expires !== this.twoDays) {
        this.expires = null;
      }
    }
    this.setup();
  }

  setup(): void {
    this.isPro = this.session.getLoggedInUser().pro;

    this.detectChanges();
    setTimeout(() => this.detectChanges(), 1);
  }

  setExpires(expires: PlusPostExpiry): void {
    if (this.isEditingPlus) {
      return;
    }
    this.expires = expires;
  }

  async openProUpgradeModal(): Promise<void> {
    const proGuid = await this.wirePaymentHandlers.get('pro');
    let completed = false;

    const stackableModalEvent: StackableModalEvent = await this.stackableModal
      .present(WireCreatorComponent, proGuid, {
        wrapperClass: 'm-modalV2__wrapper',
        default: {
          type: 'money',
          upgradeType: 'pro',
        },
        onComplete: wire => {
          completed = true;
          this.isPro = true;
        },
      })
      .toPromise();
    if (stackableModalEvent.state === StackableModalState.Dismissed) {
      this.isPro = completed;
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

    if (
      !this.dialogService.confirm(
        "Are you sure? Once a post enters the Plus pool, you can't edit its monetization settings."
      )
    ) {
      return;
    }

    const support_tier: any = {
      urn: this.plusSupportTierUrn,
    };

    if (this.expires) {
      support_tier['expires'] = this.expires;
    }

    this.service.monetization$.next({
      support_tier: support_tier,
    });
    this.dismissIntent.emit();
  }

  get canSave(): boolean {
    return !this.isEditingPlus && this.termsAccepted;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
