import { Injectable } from "@angular/core";

import { Client } from "../../services/api/client";
import { Session } from "../../services/session";

import { EntitiesService } from "./entities.service";
import { BlockListService } from "./block-list.service";
import { SettingsService } from "../../modules/settings/settings.service";

import MindsClientHttpAdapter from "../../lib/minds-sync/adapters/MindsClientHttpAdapter.js";
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import BoostedContentSync from '../../lib/minds-sync/services/BoostedContentSync.js';

import AsyncStatus from "../../helpers/async-status";

@Injectable()
export class BoostedContentService {

  protected boostedContentSync: BoostedContentSync;

  protected status = new AsyncStatus();

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
    protected settingsService: SettingsService,
  ) {
    this.setUp();
  }

  async setUp() {
    this.boostedContentSync = new BoostedContentSync(
      new MindsClientHttpAdapter(this.client),
      await browserStorageAdapterFactory('minds-boosted-content-190314'),
      6 * 60 * 60,
      5 * 60,
      500,
    );

    this.boostedContentSync.setResolvers({
      currentUser: () => this.session.getLoggedInUser() && this.session.getLoggedInUser().guid,
      blockedUserGuids: async () => await this.blockListService.getList(),
      fetchEntity: async guid => await this.entitiesService.single(guid),
    });

    //

    this.boostedContentSync.setUp();

    //

    this.status.done();

    // User session / rating handlers

    if (this.session.isLoggedIn()) {
      this.boostedContentSync.setRating(this.session.getLoggedInUser().boost_rating || null);
    }

    this.session.isLoggedIn((is: boolean) => {
      if (is) {
        this.boostedContentSync.setRating(this.session.getLoggedInUser().boost_rating || null);
      } else {
        this.boostedContentSync.destroy();
      }
    });

    // Garbage collection
    this.boostedContentSync.gc();
    setTimeout(() => this.boostedContentSync.gc(), 30 * 60 * 1000); // Every 30 minutes

    // Rating changes hook
    this.settingsService.ratingChanged.subscribe(rating => this.boostedContentSync.changeRating(rating));
  }

  async fetch() {
    await this.status.untilReady();

    return await this.boostedContentSync.fetch();
  }
}
