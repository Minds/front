import { Component } from '@angular/core';
import { IProviderUserOptions } from '../../../lib/web3modal';
import { Web3ModalService } from '../../services/web3-modal.service';

@Component({
  selector: 'm-web3-modal',
  templateUrl: 'web3-modal.component.html',
  styleUrls: ['./web3-modal.component.scss'],
})
export class Web3Modal {
  open: boolean = false;
  providers: IProviderUserOptions[];

  constructor(private service: Web3ModalService) {
    this.service.shouldOpen.subscribe({
      next: open => {
        this.open = open;
      },
    });

    this.providers = this.service.userOptions;
  }

  close() {
    this.service.close();
  }
}
