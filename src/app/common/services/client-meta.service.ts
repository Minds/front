import { Injectable, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformServer } from '@angular/common';
import hashCode from '../../helpers/hash-code';
import { Session } from '../../services/session';
import { Client } from '../../services/api';

let uniqId = 0;

@Injectable()
export class ClientMetaService {
  protected source: string;

  protected timestamp: number;

  protected salt: string;

  protected medium: string;

  protected campaign: string;

  protected id: number;

  protected injector: Injector;

  protected inherited: boolean = false;

  constructor(
    protected location: Location,
    protected session: Session,
    protected client: Client,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.id = ++uniqId;

    this.timestamp = Date.now();
    this.salt = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');
  }

  inherit(injector: Injector) {
    const parentClientMeta: ClientMetaService = injector.get(
      ClientMetaService,
      null
    );

    if (parentClientMeta) {
      if (parentClientMeta.getId() === this.id) {
        throw new Error(
          '[ClientMetaService] Cannot inherit client meta from itself. Did you forget to add to @Component({ providers }) or the @SkipSelf() decorator on Injector?'
        );
      }

      this.source = parentClientMeta.getSource();
      this.timestamp = parentClientMeta.getTimestamp();
      this.salt = parentClientMeta.getSalt();
      this.medium = parentClientMeta.getMedium();
      this.campaign = parentClientMeta.getCampaign();
    }

    this.inherited = true;

    return this;
  }

  getId() {
    return this.id;
  }

  setSource(source: string) {
    this.checkInheritance();

    this.source = source;
    this.timestamp = Date.now();
    this.salt = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');
    return this;
  }

  getSource() {
    return this.source;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getSalt() {
    return this.salt;
  }

  buildDelta() {
    return Math.floor((Date.now() - this.timestamp) / 1000);
  }

  setMedium(medium: string) {
    this.checkInheritance();

    this.medium = medium;
    return this;
  }

  getMedium() {
    return this.medium;
  }

  setCampaign(campaign: string) {
    this.checkInheritance();

    this.campaign = campaign;
    return this;
  }

  getCampaign() {
    return this.campaign;
  }

  buildPageToken() {
    const user = this.session.getLoggedInUser() || {};

    const tokenParts = [
      this.salt, // NOTE: Salt + hash so individual user activity can't be tracked
      this.location.path() || '/',
      user.guid || '000000000000000000',
      this.timestamp || '',
    ];

    return hashCode(tokenParts.join(':'), 5);
  }

  build(
    overrides: {
      source?;
      medium?;
      page_token?;
      campaign?;
      delta?;
      position?;
    } = {}
  ) {
    this.checkInheritance();

    return {
      platform: 'web',
      source: this.source,
      medium: this.medium,
      page_token: this.buildPageToken(),
      campaign: this.campaign,
      delta: this.buildDelta(),
      ...overrides,
    };
  }

  async recordView(entity) {
    if (isPlatformServer(this.platformId)) return; // Browser will record too.
    await this.client.post('api/v2/analytics/views/entity/' + entity.guid, {
      client_meta: this.build(),
    });
  }

  protected checkInheritance() {
    if (!this.inherited) {
      console.warn(
        '[ClientMetaService] This instance did not call inherit() before doing any operations.'
      );
    }
  }
}
