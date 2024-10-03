import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { ConfigsService } from './configs.service';

@Injectable()
export class SsoService {
  constructor(
    protected client: Client,
    protected session: Session,
    private configs: ConfigsService
  ) {
    this.listen();
  }

  listen() {
    this.session.isLoggedIn((is: boolean) => {
      if (is) {
        this.auth();
      }
    });
  }

  async connect() {
    try {
      const connect: any = await this.client.postRaw(
        `${this.configs.get('site_url')}api/v2/sso/connect`
      );

      if (connect && connect.token && connect.status === 'success') {
        const authorization: any = await this.client.post(
          'api/v2/sso/authorize',
          {
            token: connect.token,
          }
        );

        if (authorization && authorization.user) {
          this.session.inject(authorization.user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async auth() {
    try {
      const connect: any = await this.client.post('api/v2/sso/connect');

      if (connect && connect.token && connect.status === 'success') {
        await this.client.postRaw(
          `${this.configs.get('site_url')}api/v2/sso/authorize`,
          {
            token: connect.token,
          }
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
