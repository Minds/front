import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api/api.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AutoLoginService {
  constructor(private api: ApiService) {}

  /**
   * Opens a login link from a new tab
   * @param tenantId
   */
  async login(tenantId: number): Promise<void> {
    const res: any = await lastValueFrom(
      this.api.post('api/v3/multi-tenant/auto-login/generate', {
        tenant_id: tenantId,
      })
    );

    window.open(res.login_url);
  }
}
