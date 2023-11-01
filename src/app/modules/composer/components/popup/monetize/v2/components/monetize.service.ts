import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../../../wire/v2/support-tiers.service';

@Injectable()
export class ComposerMonetizeV2Service {
  supportTiers$: Observable<SupportTier[]> = this.supportTiersService.list$;
  loaded$: Observable<boolean> = this.supportTiersService.loaded$;

  constructor(private supportTiersService: SupportTiersService) {}

  async loadSupportTiers(userGuid: string): Promise<void> {
    this.supportTiersService.setEntityGuid(userGuid);
  }
}
