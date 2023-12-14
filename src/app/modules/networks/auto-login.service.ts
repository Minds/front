import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../../common/api/api.service';
import { lastValueFrom } from 'rxjs';
import { ToasterService } from '../../common/services/toaster.service';
import { DOCUMENT } from '@angular/common';

/** Response when getting login URL data. */
type LoginUrlResponse = {
  login_url: string;
  jwt_token: string;
};

/**
 * Auto login service to log a tenant admin into their network.
 */
@Injectable()
export class AutoLoginService {
  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Opens a login link from a new tab
   * @param { number } tenantId - the tenant id to login to.
   * @returns { Promise<void> }
   */
  public async login(tenantId: number): Promise<void> {
    const getLoginUrlResponse: LoginUrlResponse = await lastValueFrom(
      this.api.get<LoginUrlResponse>(
        'api/v3/multi-tenant/auto-login/login-url',
        {
          tenant_id: tenantId,
        }
      )
    );

    if (!getLoginUrlResponse?.login_url || !getLoginUrlResponse?.jwt_token) {
      this.toaster.error('Unable to login to network');
      return;
    }

    await this.openNetworkUrl(
      getLoginUrlResponse.login_url,
      getLoginUrlResponse.jwt_token
    );
  }

  /**
   * Opens a url in a new tab with a jwt token.
   * @param { string } url - the url to open in a new tab.
   * @param { string } jwtToken - the jwt token to send to the url.
   * @returns { Promise<void> }
   */
  private async openNetworkUrl(url: string, jwtToken: string): Promise<void> {
    // create form to submit jwt token to URL as a POST request.
    const form = this.document.createElement('form');
    form.method = 'POST';
    form.target = '_blank';
    form.action = url;

    const input = this.document.createElement('input');
    input.type = 'hidden';
    input.name = 'jwt_token';
    input.value = jwtToken;
    form.append(input);

    this.document.body.appendChild(form);
    form.submit();
    this.document.body.removeChild(form);
  }
}
