import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { LazyComponent } from '../../../../common/services/modal-lazy-load.service';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
} from './multi-factor-auth-service';

/**
 * Multi-factor Authentication base component.
 * Gives user an input for SMS and TOTP codes and recovery.
 */
@Component({
  selector: 'm-multiFactorAuth',
  templateUrl: './multi-factor-auth.component.html',
  styleUrls: ['./multi-factor-auth.component.ng.scss'],
})
export class MultiFactorAuthBaseComponent implements LazyComponent {
  public readonly cdnAssetsUrl: string;

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { MultiFactorAuthType } authType - set auth type.
   */
  set opts({ onDismissIntent, onSaveIntent, authType }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
    this.service.activePanel$.next(authType);
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
   * Gets banner background source.
   * @returns {{backgroundImage: string}} - ngStyle CSS object to set background.
   */
  public getBannerSrc(): { backgroundImage: string } {
    return {
      backgroundImage: `url('${this.cdnAssetsUrl}assets/photos/banner2FA.jpg')`,
    };
  }
}
