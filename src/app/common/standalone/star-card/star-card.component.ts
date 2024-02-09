import { Component, Input } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

/**
 * Rounded card with a title, description and stars in the top left
 * and bottom right corner.
 */
@Component({
  selector: 'm-starCard',
  imports: [NgCommonModule],
  templateUrl: './star-card.component.html',
  styleUrls: ['./star-card.component.ng.scss'],
  standalone: true,
})
export class StarCardComponent {
  /** Title of the card. */
  @Input() title: string;

  /** Description of the card. */
  @Input() description: string;
}
