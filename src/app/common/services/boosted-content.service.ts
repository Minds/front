import { Injectable } from '@angular/core';

import { Client } from '../../services/api/client';
import { Session } from '../../services/session';

import { EntitiesService } from './entities.service';
import { BlockListService } from './block-list.service';
import { SettingsService } from '../../modules/settings/settings.service';

import MindsClientHttpAdapter from '../../lib/minds-sync/adapters/MindsClientHttpAdapter.js';
import browserStorageAdapterFactory from '../../helpers/browser-storage-adapter-factory';
import BoostedContentSync from '../../lib/minds-sync/services/BoostedContentSync.js';

@Injectable()
export class BoostedContentService {
  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
    protected settingsService: SettingsService
  ) {
    this.setUp();
  }

  async setUp() {
    // User session / rating handlers

    if (this.session.isLoggedIn()) {
      //  this.boostedContentSync.setRating(this.session.getLoggedInUser().boost_rating || null);
    }

    this.session.isLoggedIn((is: boolean) => {
      if (is) {
        //  this.boostedContentSync.setRating(this.session.getLoggedInUser().boost_rating || null);
      }
    });

    // Rating changes hook
    //this.settingsService.ratingChanged.subscribe(rating => this.boostedContentSync.changeRating(rating));
  }

  setEndpoint(endpoint: string) {}

  fetch(opts = {}): BoostedContentService {
    return this;
  }
}
