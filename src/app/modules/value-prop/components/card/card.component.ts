import { Component, Input } from '@angular/core';

/**
 * Value proposition card that is shown in different feed positions
 * to explain to new users what Minds is about.
 */
@Component({
  selector: 'm-valueProp__card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.ng.scss'],
})
export class ValuePropCardComponent {
  /** Title of card. */
  @Input() public title: string;

  /** Image url. */
  @Input() public imageUrl: string;

  /** Alt text of image. */
  @Input() public altText: string;

  /** Whether a top border should be shown. */
  @Input() public showBorderTop: boolean = false;
}
