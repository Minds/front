import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { QRCodeComponent } from '../../../common/components/qr-code/qr-code.component';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

/**
 * Verify uniqueness modal root level component.
 */
@Component({
  selector: 'm-verify_uniqueness_modal',
  templateUrl: './verify-uniqueness-modal.component.html',
  styleUrls: ['verify-uniqueness-modal.component.ng.scss'],
  imports: [
    NgCommonModule,
    CommonModule,
    QRCodeComponent,
    ModalCloseButtonComponent,
  ],
})
export class VerifyUniquenessModalComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnInit(): void {}

  ngOnDestroy(): void {}

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  setModalData({ onCloseIntent }) {
    this.onDismissIntent = onCloseIntent || (() => {});
  }

  get qrLink() {
    return 'https://www.minds.com/in-app-verification';
  }
}
