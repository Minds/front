import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { FeaturesService } from '../../services/features.service';
import { ExperimentsService } from '../experiments/experiments.service';

@Component({
  selector: 'm-homepagecontainer',
  template: `
    <m-defaultFeed__container
      *ngIf="isGuestMode; else notGuestMode"
    ></m-defaultFeed__container>
    <!-- <m-discovery *ngIf="isGuestMode; else notGuestMode">
      <m-discovery__trends
        [showTabs]="false"
        [showChannels]="false"
      ></m-discovery__trends>
    </m-discovery> -->
    <ng-template #notGuestMode>
      <m-homepage__v2></m-homepage__v2>
    </ng-template>
  `,
})
export class HomepageContainerComponent implements OnInit {
  constructor(
    private metaService: MetaService,
    private experimentsService: ExperimentsService,
    private featuresService: FeaturesService
  ) {}

  isGuestMode: boolean;

  ngOnInit(): void {
    this.metaService
      .setTitle(`The Leading Alternative Social Network`, true)
      .setDescription(
        'An open source, community-owned social network dedicated to privacy, free speech, monetization and decentralization. Break free from big censorship, algorithms and surveillance and join the leading, unbiased alternative.'
      )
      .setCanonicalUrl('/')
      .setOgUrl('/');

    this.isGuestMode =
      this.featuresService.has('guest-mode') &&
      this.experimentsService.hasVariation('discovery-homepage', 'on');
  }
}
