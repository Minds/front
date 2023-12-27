import { Injectable } from '@angular/core';

import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { GenericToggleValue } from '../../../common/components/toggle/toggle.component';
import { MultiTenantNetworkConfigService } from './config.service';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Manages whether nsfw reporting tools are enabled on tenant sites
 */
@Injectable({ providedIn: 'root' })
export class NsfwEnabledService {
  /** Subject to store whether config has been loaded. */
  public readonly nsfwEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private toaster: ToasterService,
    configs: ConfigsService
  ) {
    const nsfwEnabled = configs.get('nsfw_enabled') || true;
    this.nsfwEnabled$.next(nsfwEnabled);
  }

  /**
   * Toggles whether nsfw reporting tools are enabled
   *
   * @returns { Promise<void> }
   */
  public async toggle(newValue: GenericToggleValue): Promise<void> {
    const newVal = newValue === 'off' ? false : true;

    try {
      const success: boolean = await lastValueFrom(
        this.multiTenantConfigService.updateConfig({
          nsfwEnabled: newVal,
        })
      );

      if (!success) {
        throw new Error('An error occurred whilst saving');
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'An unknown error has occurred');
      return;
    }

    this.nsfwEnabled$.next(newVal);
  }
}
