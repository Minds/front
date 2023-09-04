import { Component, Input } from '@angular/core';

/**
 * A generic, compact feed item with a projected button
 */
@Component({
  selector: 'm-exploreFeedItem',
  templateUrl: './explore-feed-item.component.html',
  styleUrls: ['./explore-feed-item.component.ng.scss'],
})
export class ExploreFeedItemComponent {
  /**
   * Material icon id of the icon presented on the far left
   */
  @Input() iconId: string = 'explore';

  /**
   * The primary explanatory text about where the button will go
   */
  @Input() titleText: string = '';
}
