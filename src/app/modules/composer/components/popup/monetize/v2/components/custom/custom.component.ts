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
  userGuid;
  form;
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
        validators: [Validators.required, Validators.min(0.01)],
      }),
      has_tokens: new FormControl(false),
    });

    if (this.service.isEditing$.getValue()) {
      this.setInitialState();
    }
    this.init = true;
  }

  /**
   * When editing a monetized post,
   * make form display current selection
   */
  setInitialState(): void {
    const monetization = this.service.monetization$.getValue();
    if (!monetization) {
      return;
    }
    const savedEntityData = this.service.entity.wire_threshold;
    if (savedEntityData) {
      this.enabled.setValue(true);
      this.usd.setValue(savedEntityData.usd);
      this.has_tokens.setValue(savedEntityData.has_tokens);
    }
  }

  /**
   * Save selected tier
   */
  async save(): Promise<void> {
    if (!this.canSave) {
      return;
    }

    if (!this.enabled.value) {
      this.service.monetization$.next({
        support_tier: null,
      });
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

        this.service.monetization$.next({
          support_tier: {
            urn: urn,
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
