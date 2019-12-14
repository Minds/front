import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'm-walletModal',
  templateUrl: './modal.component.html',
})
export class WalletModalComponent implements AfterViewInit, OnDestroy {
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  // root;
  constructor() {}

  ngAfterViewInit() {
    if (document && document.body) {
      document.body.classList.add('m-overlay-modal--shown--no-scroll');
    }

    // if (!this.root && document && document.body) {
    //   this.root = document.body;
    // }
    // if (this.root) {
    //   this.root.classList.add('m-overlay-modal--shown');
    //   // document.body.classList.add('m-overlay-modal--shown--no-scroll');
    // }
  }
  ngOnDestroy() {
    document.body.classList.remove('m-overlay-modal--shown--no-scroll');
  }

  clickedClose() {
    document.body.classList.remove('m-overlay-modal--shown--no-scroll');

    // if (this.root) {
    //   this.root.classList.remove('m-overlay-modal--shown');
    //   document.body.classList.remove('m-overlay-modal--shown--no-scroll');
    // }
    this.closeModal.emit();
  }
}
