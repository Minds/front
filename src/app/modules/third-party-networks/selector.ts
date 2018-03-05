import { Component, EventEmitter, ChangeDetectorRef  } from '@angular/core';

import { ThirdPartyNetworksService } from '../../services/third-party-networks';

@Component({
  moduleId: module.id,
  selector: 'minds-third-party-networks-selector',
  exportAs: 'thirdPartyNetworksSelector',
  templateUrl: 'selector.html',
})

export class ThirdPartyNetworksSelector {
  integrations: any;

  networks: string[] = [];
  state: any = {};

  opened: boolean = false;
  ready: boolean = false;
  inProgress: boolean = false;

  private networkIconsMap: any = {
    'facebook': 'facebook-official'
  };

  constructor(private thirdpartynetworks: ThirdPartyNetworksService) {
  }

  ngOnInit() {
    for (let network in this.thirdpartynetworks.getIntegrations()) {
      if (this.thirdpartynetworks.hasIntegration(network)) {
        this.networks.push(network);
        this.state[network] = false;
      }
    }
  }

  toggleOpened() {
    if (!this.ready) {
      this.inProgress = true;

      this.thirdpartynetworks.getStatus()
        .then(() => {
          this.inProgress = false;
          this.ready = true;
        })
        .catch(e => {
          console.error('[Third Party Networks/toggleOpened]', e);
          this.inProgress = false;
        });
    }

    this.opened = !this.opened;
  }

  toggleState(network: string) {
    if (this.inProgress || !this.ready) {
      return;
    }

    if (this.state[network]) {
      this.state[network] = false;
      return;
    }

    this.inProgress = true;
    if (!this.thirdpartynetworks.isConnected(network)) {
      this.thirdpartynetworks.connect(network)
        .then(() => {
          this.inProgress = false;
          this.state[network] = true;
        });

      return;
    }

    this.inProgress = false;
    this.state[network] = true;
  }

  inject(data: any) {
    for (let network in this.state) {
      if (this.state[network]) {
        data[network] = 1;
      }
    }

    return data;
  }

  getNetworkIconClass(network: string) {
    if (typeof this.networkIconsMap[network] !== 'undefined') {
      return this.networkIconsMap[network];
    }

    return network;
  }

}
