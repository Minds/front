import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../common/services/meta.service';

@Component({
  selector: 'm-homepagecontainer',
  templateUrl: 'container.component.html',
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
