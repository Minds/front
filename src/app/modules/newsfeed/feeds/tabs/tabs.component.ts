import { Component } from '@angular/core';
import { FeedAlgorithm } from '../../../../common/services/feeds.service';

/*
 * Header tabs for newsfeed.
 */
@Component({
  selector: 'm-newsfeed__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class NewsfeedTabsComponent {
  /** Feed algorithm enum. */
  protected readonly feedAlgorithm: typeof FeedAlgorithm = FeedAlgorithm;
}
