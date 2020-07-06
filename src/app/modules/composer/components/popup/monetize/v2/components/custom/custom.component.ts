import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ApiService } from '../../../../../../../../common/api/api.service';
import { ComposerService } from '../../../../../../services/composer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Client } from '../../../../../../../../services/api';
import { FormToastService } from '../../../../../../../../common/services/form-toast.service';

@Component({
  selector: 'm-composer__monetizeV2__custom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom.component.html',
})
export class ComposerMonetizeV2CustomComponent implements OnInit {
  userGuid: string;
  form: FormGroup;
  init: boolean = false;
  inProgress: boolean = false;

  /**
   * Signal event emitter to parent
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected api: ApiService,
    private service: ComposerService,
    protected cd: ChangeDetectorRef,
    private client: Client,
    private toasterService: FormToastService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      enabled: new FormControl(false),
      usd: new FormControl('', {
        validators: [Validators.required, Validators.min(1)],
      }),
      has_tokens: new FormControl(false),
    });
    this.setInitialState();
    this.init = true;
  }

  /**
   * When editing a monetized post,
   * make form display current selection
   */
  setInitialState(): void {
    if (!this.service.monetization$.getValue()) {
      return;
    }

    // if custom on first load of monetization popup,
    // populate form from saved entity
    if (this.service.entity && this.service.entity.wire_threshold) {
      if (
        this.service.entity.wire_threshold.support_tier &&
        !this.service.entity.wire_threshold.support_tier.public
      ) {
        const customTier = this.service.entity.wire_threshold.support_tier;
        this.populateForm(true, customTier.usd, customTier.has_tokens);
      }
    }

    // if changes have been made & saved since first load,
    // populate form from pendingMonetization

    if (this.service.pendingMonetization$.getValue()) {
      const pendingMonetization = this.service.pendingMonetization$.getValue();
      if (pendingMonetization && pendingMonetization.type === 'custom') {
        const customTier = pendingMonetization.support_tier;
        this.populateForm(true, customTier.usd, customTier.has_tokens);
      }
    }
  }

  /**
   * Set form values
   * @param enabled
   * @param usd
   * @param has_tokens
   */
  populateForm(enabled: boolean, usd: number, has_tokens: boolean) {
    this.enabled.setValue(enabled);
    this.usd.setValue(usd);
    this.has_tokens.setValue(has_tokens);
  }

  /**
   * Save selected tier
   */
  async save(): Promise<void> {
    if (!this.canSave) {
      return;
    }

    if (!this.enabled.value) {
      this.service.pendingMonetization$.next(null);
      this.dismissIntent.emit();
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    const opts = {
      has_usd: true,
      usd: this.usd.value,
      has_tokens: this.has_tokens.value,
    };

    /**
     * Create a new custom support tier
     */
    try {
      const response = <any>(
        await this.client.post('api/v3/wire/supporttiers/custom', opts)
      );

      /**
       * Associate newly-created custom tier with this activity
       */
      if (response.support_tier) {
        const urn = response.support_tier.urn;

        this.service.pendingMonetization$.next({
          type: 'custom',
          support_tier: {
            urn: urn,
            usd: this.usd.value,
            has_tokens: this.has_tokens.value,
          },
        });
      }
      this.dismissIntent.emit();
    } catch (e) {
      this.toasterService.error(e);
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  get canSave() {
    /**
     * No need to enforce validation on USD amount when disabled
     */
    return this.form.valid || !this.enabled.value;
  }

  /**
   * Shorthand access to Form Controls
   */
  get enabled() {
    return this.form.get('enabled');
  }

  get usd() {
    return this.form.get('usd');
  }

  get has_tokens() {
    return this.form.get('has_tokens');
  }

  /**
   * Triggers manual change detection
   */
  protected detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
