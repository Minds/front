import { FeedAlgorithm } from './../subscribed.component';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ExperimentsService } from '../../../experiments/experiments.service';

@Component({
  selector: 'm-feedHeader',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.ng.scss'],
})
export class FeedHeaderComponent {
  constructor(public experiments: ExperimentsService) {}

  @HostBinding('class.m-feedHeader--activityV2')
  get activityV2Feature(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }

  @Input()
  algorithm: FeedAlgorithm = 'latest';
}
