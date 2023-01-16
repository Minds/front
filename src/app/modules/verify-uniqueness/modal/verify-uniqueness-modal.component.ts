import { Component, OnDestroy, OnInit } from '@angular/core';

/**
 * Verify uniqueness modal root level component.
 */
@Component({
  selector: 'm-verify_uniqueness_modal',
  templateUrl: './verify-uniqueness-modal.component.html',
  styleUrls: ['verify-uniqueness-modal.component.ng.scss'],
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
