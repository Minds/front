import { Component, OnInit } from '@angular/core';

/**
 * Modal that contains a form to add a
 * new credit/debit card to use with Minds Pay.
 * Contains a Stripe iframe
 */
@Component({
  selector: 'm-payments__newCardModal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['./new-card-modal.component.scss'],
})
export class NewCardModalComponent implements OnInit {
  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /**
   * Modal options
   * @param { any } opts - modal options.
   * @returns { void }
   */
  setModalData({ onComplete, onDismissIntent }: any): void {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  constructor() {}

  ngOnInit(): void {}

  onCardAdded(e: void) {
    this.onComplete(true);
  }

  goBack(e: MouseEvent) {
    this.onDismissIntent();
  }
}
