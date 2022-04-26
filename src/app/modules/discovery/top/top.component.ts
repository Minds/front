import { Component, HostBinding } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * Discovery top feed component.
 * Presents a default recommendations feed with discovery tabs.
 */
@Component({
  selector: 'm-discovery__top',
  styleUrls: ['top.component.ng.scss'],
  templateUrl: './top.component.html',
})
export class DiscoveryTopComponent {
  constructor(
    public featuresService: FeaturesService,
    private experiments: ExperimentsService
  ) {}
  @HostBinding('class.m-discovery__top--activityV2')
  get activityV2Feature(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }
}
