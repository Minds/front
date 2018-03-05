import { NgZone } from '@angular/core';
import { Client } from './api';

export class ThirdPartyNetworksService {

  inProgress: boolean = false;

  private siteUrl: string = '';

  private status: any = {};
  private integrations: any;
  private statusReady: Promise<any>;

  static _(client: Client, zone: NgZone) {
    return new ThirdPartyNetworksService(client, zone);
  }

  constructor(private client: Client, private zone: NgZone) {
    this.siteUrl = window.Minds.site_url;
    this.integrations = window.Minds.thirdpartynetworks;
  }

  // General

  getStatus(refresh: boolean = false): Promise<any> {
    if (!this.statusReady || refresh) {
      this.statusReady = this.client.get('api/v1/thirdpartynetworks/status')
        .then((response: any) => {
          this.overrideStatus(response.thirdpartynetworks);
        });
    }

    return this.statusReady;
  }

  setStatusKey(network: string, value: any) {
    this.getStatus()
      .then(() => {
        this.status[network] = value;
      });
  }

  overrideStatus(statusResponse: any) {
    this.status = statusResponse;
  }

  // Connecting / Disconnecting

  connect(network) {
    switch (network) {
      case 'facebook':
        return this.connectFb();

      case 'twitter':
        return this.connectTw();
    }

    throw new Error('Unknown Third-Party Network');
  }

  disconnect(network) {
    switch (network) {
      case 'facebook':
        return this.removeFb();

      case 'twitter':
        return this.removeTw();
    }

    throw new Error('Unknown Third-Party Network');
  }

  // Helper methods

  getStatusKey(network: string, key: string = null): any {
    if (!this.status || !this.status[network]) {
      return null;
    }

    if (key === null) {
      return this.status[network];
    }

    return this.status[network][key] || null;
  }

  isConnected(network: string): boolean {
    return this.getStatusKey(network, 'connected');
  }

  getIntegrations(): any {
    return this.integrations;
  }

  hasIntegration(network: string): boolean {
    return this.integrations && this.integrations[network];
  }

  removeFbLogin(): Promise<any> {
    this.inProgress = true;

    return this.client.delete('api/v1/thirdpartynetworks/facebook/login')
      .then(() => {
        this.inProgress = false;

        if (window.Minds.user) {
          window.Minds.user.signup_method = 'ex-facebook';
        }
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  // === Individual Third-Party Network Integrations
  // @todo: Encapsulate and create classes!

  // Facebook

  private connectFb(): Promise<any> {
    this.inProgress = true;

    return new Promise((resolve, reject) => {
      window.onSuccessCallback = () => this.zone.run(() => {
        this.getStatus(true)
          .then(() => {
            resolve();
            this.inProgress = false;
          });
      });

      window.onErrorCallback = (reason) => this.zone.run(() => {
        this.inProgress = false;
        reject(reason);
      });

      window.open(
        `${this.siteUrl}api/v1/thirdpartynetworks/facebook/link?no_pages=1`,
        'Login with Facebook',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=600, height=400, top=100, left=100'
      );
    });
  }

  private removeFb(): Promise<any> {
    this.inProgress = true;

    return this.client.delete('api/v1/thirdpartynetworks/facebook')
      .then(() => {
        this.inProgress = false;
        this.setStatusKey('facebook', { connected: false });
      })
      .catch(e => {
        this.inProgress = false;
      });
  }


  // Twitter

  private connectTw(): Promise<any> {
    this.inProgress = true;

    return new Promise((resolve, reject) => {
      window.onSuccessCallback = () => this.zone.run(() => {
        this.getStatus(true)
          .then(() => {
            resolve();
            this.inProgress = false;
          });
      });

      window.onErrorCallback = (reason) => this.zone.run(() => {
        this.inProgress = false;
        reject(reason);
      });

      window.open(
        `${this.siteUrl}api/v1/thirdpartynetworks/twitter/link`,
        'Login with Twitter',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=600, height=400, top=100, left=100'
      );
    });
  }

  private removeTw(): Promise<any> {
    this.inProgress = true;

    return this.client.delete('api/v1/thirdpartynetworks/twitter')
      .then(() => {
        this.inProgress = false;
        this.setStatusKey('twitter', { connected: false });
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

}
