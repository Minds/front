import { HomepageV3ExperimentService } from './../experiments/sub-services/home-page-v3-experiment.service';
import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { GuestModeExperimentService } from '../experiments/sub-services/guest-mode-experiment.service';

@Component({
  selector: 'm-homepagecontainer',
  templateUrl: 'container.component.html',
})
export class HomepageContainerComponent implements OnInit {
  constructor(
    private metaService: MetaService,
    private guestModeExperiment: GuestModeExperimentService,
    private homepageV3Experiment: HomepageV3ExperimentService,
  ) {}

  isGuestMode: boolean;
  isHomepageV3: boolean;

  ngOnInit(): void {
    this.metaService
      .setTitle(`The Leading Alternative Social Network`, true)
      .setDescription(
        'An open source, community-owned social network dedicated to privacy, free speech, monetization and decentralization. Break free from big censorship, algorithms and surveillance and join the leading, unbiased alternative.'
      )
      .setCanonicalUrl('/')
      .setOgUrl('/');

    this.isGuestMode = this.guestModeExperiment.isActive();
    this.isHomepageV3 = this.homepageV3Experiment.isActive();
  }
}
