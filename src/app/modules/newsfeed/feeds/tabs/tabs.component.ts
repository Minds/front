import { Component, OnInit } from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { FeedAlgorithm } from '../../../../common/services/feeds.service';

/*
 * Header tabs for newsfeed.
 */
@Component({
  selector: 'm-newsfeed__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class NewsfeedTabsComponent implements OnInit {
  /** Feed algorithm enum. */
  protected readonly feedAlgorithm: typeof FeedAlgorithm = FeedAlgorithm;

  /** Whether Groups tab should be shown */
  protected shouldShowGroupsTab: boolean = false;

  constructor(private experimentsService: ExperimentsService) {}

  ngOnInit(): void {
    this.shouldShowGroupsTab = this.experimentsService.hasVariation(
      'minds-3990-group-feed'
    );
  }
}
