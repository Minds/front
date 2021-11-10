import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';

@Component({
  selector: 'm-homepagecontainer',
  template: `
    <m-discovery *mExperiment="'discovery-homepage'; variation: 'on'">
      <m-discovery__trends
        [showTabs]="false"
        [showChannels]="false"
      ></m-discovery__trends>
    </m-discovery>
    <m-homepage__v2
      *mExperiment="'discovery-homepage'; variation: 'off'"
    ></m-homepage__v2>
  `,
})
export class HomepageContainerComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService
      .setTitle(`The Leading Alternative Social Network`, true)
      .setDescription(
        'An open source, community-owned social network dedicated to privacy, free speech, monetization and decentralization. Break free from big censorship, algorithms and surveillance and join the leading, unbiased alternative.'
      )
      .setCanonicalUrl('/')
      .setOgUrl('/');
  }
}
