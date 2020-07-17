/**
 * Simple text counter component that will display as
 * x / limit (e.g. 150 / 1500), and highlight red when exceeded.
 * External validation should still be done as
 * this will not set the maximum lengths of a text input.
 */
import { Component, Input } from '@angular/core';

export const maxLength: number = 1500;
export type PositionalBounds = { top: number; right: number };

@Component({
  selector: 'm-textCounter',
  template: `
    <div
      class="m-textCounter__limitContainer"
      [class.hidden]="content.length < hiddenThreshold"
      [class.m-textCounter--maxed]="content.length > maxLength"
      [ngStyle]="{
        top: position.top,
        right: position.right
      }"
    >
      <span class="m-textCounter__input">
        {{ content.length }}
      </span>
      <span class="m-textCounter__counter"> / {{ maxLength }}</span>
    </div>
  `,
})
export class TextCounterComponent {
  /**
   * Content to be counted.
   */
  @Input() content: string;

  /**
   * Component will be hidden when text length
   * is less than this value.
   */
  @Input() hiddenThreshold: number = 140;

  /**
   * Pass in to override default 1500 characters.
   */
  @Input() maxLength: number = maxLength;

  /**
   * Absolute positioning, set to override default 75 top, 25 right.
   */
  @Input() position: PositionalBounds = { top: 75, right: 25 };
}
