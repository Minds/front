import { Component, OnInit } from '@angular/core';
import { NewsfeedForYouExperimentService } from '../../../experiments/sub-services/newsfeed-for-you-experiment.service';
import { FeedAlgorithm } from '../subscribed.component';
import { ExperimentsService } from '../../../experiments/experiments.service';

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

  /** Whether For You tab should be shown */
  protected shouldShowForYouTab: boolean = false;

  /** Whether Groups tab should be shown */
  protected shouldShowGroupsTab: boolean = false;

  constructor(
    private newsfeedForYouExperiment: NewsfeedForYouExperimentService,
    private experimentsService: ExperimentsService
  ) {}

  ngOnInit(): void {
    this.shouldShowForYouTab = this.newsfeedForYouExperiment.isActive();
    this.shouldShowGroupsTab = this.experimentsService.hasVariation(
      'minds-3990-group-feed'
    );
  }
}
