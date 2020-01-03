import {
  Component,
  Output,
  Input,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'm-walletModal',
  templateUrl: './modal.component.html',
})
export class WalletModalComponent implements AfterViewInit, OnDestroy {
  public _showModal;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  // showModal: boolean = false;
  // @Input() showModal = false;
  @Input()
  public set showModal(val: boolean) {
    this._showModal = val;
    console.log('showmodal input', val);
    if (val) {
      this.show();
    }
  }

  // root;
  constructor() {}

  ngAfterViewInit() {
    // if (document && document.body) {
    //   document.body.classList.add('m-overlay-modal--shown--no-scroll');
    // }
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

  show() {
    console.log('show');
    if (document && document.body) {
      document.body.classList.add('m-overlay-modal--shown--no-scroll');
    }
  }

  // * MODAL DISMISSAL * --------------------------------------------------------------------------
  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    console.log('clickedbackdrop');
    if (this.showModal) {
      $event.preventDefault();
      $event.stopPropagation();
      this.clickedClose();
    }
  }

  // Don't dismiss modal if click somewhere other than backdrop
  clickedModal($event) {
    $event.stopPropagation();
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
