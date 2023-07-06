import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../../../../wire/v2/support-tiers.service';
import { Session } from '../../../../../../../../services/session';
import { ApiService } from '../../../../../../../../common/api/api.service';
import { Subscription } from 'rxjs';
import { ComposerService } from '../../../../../../services/composer.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ComposerMonetizeV2Service } from '../monetize.service';

/**
 * Radio button form of membership tiers a user may select
 * when monetizing their post, along with a link to
 * manage their existing memberships
 */
@Component({
  selector: 'm-composer__monetizeV2__memberships',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memberships.component.html',
})
export class ComposerMonetizeV2MembershipsComponent
  implements OnInit, OnDestroy {
  hasSupportTiers: boolean = false;
  supportTiers: SupportTier[] = [];
  plusTierUrn: string = '';
  form;
  init: boolean = false;

  supportTiersSubscription: Subscription;

  /**
   * Signal event emitter to parent
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private session: Session,
    protected api: ApiService,
    private service: ComposerService,
    private supportTiersService: SupportTiersService,
    protected cd: ChangeDetectorRef,
    protected monetizeService: ComposerMonetizeV2Service
  ) {}

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      urn: new UntypedFormControl('none'),
    });

    this.supportTiersSubscription = this.monetizeService.supportTiers$.subscribe(
      tiers => {
        if (tiers) {
          this.supportTiers = tiers;
          this.filterMembershipTiers(this.supportTiers);
        } else {
          this.supportTiers = [];
          this.hasSupportTiers = false;
          this.init = true;
          this.detectChanges();
        }

        this.setInitialState();
      }
    );
  }

  /**
   * When editing a monetized post,
   * make form display current selection
   */
  setInitialState(): void {
    const monetization =
      this.service.pendingMonetization$.getValue() ||
      this.service.monetization$.getValue();

    if (!monetization) {
      this.urn.setValue('none');
      return;
    }
    if (monetization.support_tier && monetization.support_tier.urn) {
      const savedTier = this.supportTiers.find(
        tier => tier.urn === monetization.support_tier.urn
      );
      if (savedTier) {
        this.urn.setValue(savedTier.urn);
      } else {
        this.urn.setValue('none');
      }
    }
    this.detectChanges();
  }

  ngOnDestroy(): void {
    this.supportTiersSubscription.unsubscribe();
  }

  /**
   * Filter out custom tiers and plus tier
   */
  filterMembershipTiers(tiers: SupportTier[]): void {
    tiers = tiers.filter(
      support_tier =>
        support_tier.public === true && support_tier.urn !== this.plusTierUrn
    );

    if (tiers.length > 0) {
      this.supportTiers = tiers;
      this.hasSupportTiers = true;
      this.urn.setValue(this.supportTiers[0].urn);
    } else {
      this.hasSupportTiers = false;
    }
    this.init = true;
    this.detectChanges();
  }

  /**
   * Save selected tier
   */
  save(): void {
    if (this.urn.value === 'none') {
      this.service.pendingMonetization$.next(null);
    } else {
      this.service.pendingMonetization$.next({
        type: 'membership',
        support_tier: {
          urn: this.urn.value,
        },
      });
    }
    this.detectChanges();
    this.dismissIntent.emit();
  }

  /**
   * Shorthand access to Form Control
   */
  get urn() {
    return this.form.get('urn');
  }

  /**
   * Triggers manual change detection
   */
  protected detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
