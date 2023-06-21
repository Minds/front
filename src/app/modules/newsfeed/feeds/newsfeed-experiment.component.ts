import { Component, OnInit } from '@angular/core';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * This component is a feature flag gate for the new gql feeds
 */
@Component({
  selector: 'm-newsfeed__experiment',
  template: `
    <m-newsfeed__gql *ngIf="useGql; else legacyFeed"></m-newsfeed__gql>
    <ng-template #legacyFeed>
      <m-newsfeed--subscribed></m-newsfeed--subscribed>
    </ng-template>
  `,
})
export class NewsfeedExperimentComponent implements OnInit {
  useGql: boolean;

  constructor(private experimentsService: ExperimentsService) {}

  ngOnInit() {
    //ojm remove important
    this.useGql = true;
    // this.useGql = this.experimentsService.hasVariation('engine-2570-gql', true);
  }
}
