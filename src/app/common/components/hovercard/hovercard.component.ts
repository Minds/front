import { Component, Input, OnInit } from '@angular/core';

/**
 * A trigger for a publisher card popup
 *
 * Wrap this around any element that refers to a publisher.
 * When users hover over that element, a popup will appear
 * with detailed information about that publisher
 */
@Component({
  selector: 'm-hovercard',
  templateUrl: './hovercard.component.html',
  styleUrls: ['./hovercard.component.ng.scss'],
})
export class HovercardComponent {
  @Input() publisher: any;
  @Input() offset: Array<number>;

  shown: boolean = false;

  // Only calculate float-ui positioning changes when float-ui is visible
  floatUiOnShown() {
    this.shown = true;
  }

  floatUiOnHidden() {
    this.shown = false;
  }
}
