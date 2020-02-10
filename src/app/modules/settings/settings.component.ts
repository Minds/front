import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Session } from '../../services/session';

import { HashtagsSelectorModalComponent } from '../../modules/hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { ReferralsLinksComponent } from '../wallet/tokens/referrals/links/links.component';
import { MetaService } from '../../common/services/meta.service';

@Component({
  selector: 'm-settings',
  templateUrl: 'settings.component.html',
})
export class SettingsComponent {
  user: any;
  filter: string;
  account_time_created: any;
  card: string;

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public metaService: MetaService,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }

    this.metaService
      .setTitle('Settings')
      .setDescription('Configure your Minds settings');

    this.filter = 'general';

    this.account_time_created = this.session.getLoggedInUser().time_created;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter'];
      } else {
        this.filter = 'general';
      }
      if (params['card']) {
        this.card = params['card'];
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
  }

  openHashtagsSelector() {
    this.overlayModal
      .create(
        HashtagsSelectorModalComponent,
        {},
        {
          class:
            'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
        }
      )
      .present();
  }

  openReferralsModal() {
    this.overlayModal
      .create(
        ReferralsLinksComponent,
        {},
        {
          class: 'm-overlay-modal--referrals-links m-overlay-modal--medium',
        }
      )
      .present();
  }
}
