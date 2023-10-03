import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Feed item that contains a button allowing user to explore a given tag
 * linking to it in search.
 */
@Component({
  selector: 'm-exploreTagFeedItem',
  templateUrl: './explore-tag-feed-item.component.html',
  styleUrls: ['./explore-tag-feed-item.component.ng.scss'],
})
export class ExploreTagFeedItemComponent {
  /** Tag that a user can explore. */
  @Input() public tag: string;
}
