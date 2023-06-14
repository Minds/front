import { Component, OnInit } from '@angular/core';
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
  /** Whether Groups tab should be shown */
  protected shouldShowGroupsTab: boolean = false;

  constructor(private experimentsService: ExperimentsService) {}

  ngOnInit(): void {
    this.shouldShowGroupsTab = this.experimentsService.hasVariation(
      'minds-3990-group-feed'
    );
  }
}
