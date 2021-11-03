import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { LazyComponent } from '../../../common/services/modal-lazy-load.service';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
  MultiFactorRootPanel,
} from './services/multi-factor-auth-service';

/**
 * Multi-factor Authentication base component.
 * Gives user an input for SMS and TOTP codes and recovery.
 */
@Component({
  selector: 'm-multiFactorAuth',
  host: {
    '[class.m-multiFactorAuth--embedded]': 'embedded',
  },
  templateUrl: './multi-factor-auth.component.html',
  styleUrls: ['./multi-factor-auth.component.ng.scss'],
})
export class MultiFactorAuthBaseComponent implements LazyComponent {
  public readonly cdnAssetsUrl: string;

  /**
   * Embedded mode - component shown with no header banner and title.
   */
  @Input() embedded = false;

  /**
   * Set auth type (totp or sms)
   */
  @Input() set authType(type: MultiFactorRootPanel) {
    this.service.activePanel$.next(type);
  }

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { MultiFactorAuthType } authType - set auth type.
   */
  set opts({ onDismissIntent, onSaveIntent, authType }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
    this.authType = authType;
  }

  /**
   * Gets active panel from service.
   * @returns { BehaviorSubject<MultiFactorPanel> } - active panel from service.
   */
  get activePanel$(): BehaviorSubject<MultiFactorPanel> {
    return this.service.activePanel$;
  }

  constructor(
    private service: MultiFactorAuthService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: () => void = () => {};

  /**
   * Gets banner background source.
   * @returns {{backgroundImage: string}} - ngStyle CSS object to set background.
   */
  public getBannerSrc(): { backgroundImage: string } {
    return {
      backgroundImage: `url('${this.cdnAssetsUrl}assets/photos/banner2FA.jpg')`,
    };
  }
}
