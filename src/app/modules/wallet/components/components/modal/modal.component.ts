import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Modal used in the wallet.
 * It wraps around forms so the modals in the wallet look consistent.
 *
 */
@Component({
  selector: 'm-walletModal',
  templateUrl: './modal.component.html',
})
export class WalletModalComponent implements OnDestroy {
  showModalTimeout: any = null;
  justOpened = true;
  modalWasClicked = false;
  public _showModal = false;
  @Input()
  public set showModal(val: boolean) {
    this._showModal = val;
    val ? this.show() : this.close();
  }
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  show() {
    if (document && document.body) {
      this.justOpened = true;
      document.body.classList.add('m-overlay-modal--shown--no-scroll');

      if (isPlatformBrowser(this.platformId)) {
        // Prevent dismissal of modal when it's just been opened
        this.showModalTimeout = setTimeout(() => {
          this.justOpened = false;
        }, 20);
      }
    }
  }

  // * MODAL DISMISSAL * --------------------------------------------------------------------------
  // Dismiss modal when backdrop is clicked and modal is open
  @HostListener('document:click', ['$event'])
  clickedBackdrop($event) {
    if (this._showModal && !this.justOpened && !this.modalWasClicked) {
      $event.preventDefault();
      $event.stopPropagation();
      this.close();
    }
    this.modalWasClicked = false;
  }

  // Don't dismiss modal if click somewhere other than backdrop
  clickedModal($event) {
    // $event.stopPropagation();
    this.modalWasClicked = true;
  }

  close() {
    document.body.classList.remove('m-overlay-modal--shown--no-scroll');
    this.closeModal.emit();
  }
  ngOnDestroy() {
    if (this.showModalTimeout) {
      clearTimeout(this.showModalTimeout);
    }
    this.close();
  }
}
