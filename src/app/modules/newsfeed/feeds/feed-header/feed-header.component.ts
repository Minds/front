import { FeedAlgorithm } from './../subscribed.component';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';

@Component({
  selector: 'm-feedHeader',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.ng.scss'],
})
export class FeedHeaderComponent {
  constructor(
    public experiments: ExperimentsService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {}

  @HostBinding('class.m-feedHeader--activityV2')
  get activityV2Feature(): boolean {
    return this.activityV2Experiment.isActive();
  }

  @Input()
  algorithm: FeedAlgorithm = 'latest';
}
