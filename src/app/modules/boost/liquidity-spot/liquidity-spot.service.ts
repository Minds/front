import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { MindsUser } from '../../../interfaces/entities';

@Injectable()
export class LiquiditySpotService {
  entity$: Subject<MindsUser> = new Subject();

  constructor(protected api: ApiService) {}

  /**
   * Loads an entity (for now these are always channels) from the boost liquidity spot
   */
  async load(): Promise<void> {
    const response = await this.api
      .get('api/v3/boost/liquidity-spot')
      .toPromise();
    this.entity$.next(response.entity);
  }
}
