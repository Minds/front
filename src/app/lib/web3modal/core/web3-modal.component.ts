import { Component } from '@angular/core';
import { Web3ModalService } from './web3-modal.service';

@Component({
  selector: 'm-web3-modal',
  templateUrl: 'web3-modal.component.html',
})
export class Web3Modal {
  open: boolean = false;
  providers: any;

  constructor(private service: Web3ModalService) {
    this.service.shouldOpen.subscribe({
      next: open => {
        this.open = open;
      },
    });
  }

  ngOnInit() {
    this.providers = this.service.userOptions;
  }

  close() {
    this.service.close();
  }
}
