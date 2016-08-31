import { Component, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { ThirdPartyNetworksService } from '../../services/third-party-networks';

@Component({
  selector: 'minds-third-party-networks-selector',
  exportAs: 'thirdPartyNetworksSelector',
  directives: [ CORE_DIRECTIVES ],
  templateUrl: 'src/components/third-party-networks/selector.html',
})

export class ThirdPartyNetworksSelector {
  integrations: any;
  
  networks: string[] = [];
  state: any = {};

  opened: boolean = false;
  ready: boolean = false;

  private networkIconsMap: any = {
    'facebook': 'facebook-official'
  }

  constructor(private thirdpartynetworks: ThirdPartyNetworksService) {
  }

  ngOnInit() {
    for (let network in this.thirdpartynetworks.getIntegrations()) {
      if (this.thirdpartynetworks.hasIntegration(network)) {
        this.networks.push(network);
        this.state[network] = false;
      }
    }

    this.thirdpartynetworks.getStatus()
      .then(() => {
        this.ready = true;
      });
  }

  toggleState(network: string) {
    if (!this.thirdpartynetworks.isConnected(network)) {
      this.thirdpartynetworks.connect(network)
        .then(() => {
          this.state[network] = true;
        });
      
      return;
    }

    this.state[network] = !this.state[network]; 
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
