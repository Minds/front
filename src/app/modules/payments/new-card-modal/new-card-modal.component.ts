import { Component, OnInit } from '@angular/core';

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
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  set opts({ onComplete, onDismissIntent }) {
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
