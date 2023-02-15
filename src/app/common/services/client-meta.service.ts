import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, Location } from '@angular/common';
import hashCode from '../../helpers/hash-code';
import { Session } from '../../services/session';
import { Client } from '../../services/api';
import { ClientMetaDirective } from '../directives/client-meta.directive';

export type ClientMetaMedium =
  | 'feed'
  | 'boost-rotator'
  | 'portrait'
  | 'channel-recs'
  | 'featured-content'
  | 'single'
  | 'boost'
  | 'modal'
  | null;

export type ClientMetaSource =
  | 'feed/subscribed'
  | 'feed/channel'
  | 'feed/group'
  | 'feed/discovery/search'
  | 'feed/groups'
  | 'feed/discovery'
  | 'feed/boosts'
  | 'search/latest'
  | 'search/top'
  | 'search/channels'
  | 'search/groups'
  | 'search/null'
  | 'single'
  | 'portrait'
  | 'top-feed'
  | null;

/**
 * Client meta data structure
 */
export interface ClientMetaData {
  platform: string;
  source: ClientMetaSource;
  timestamp: number;
  salt: string;
  medium: ClientMetaMedium; // this refers to the
  campaign: string;
  page_token: string;
  delta: number;
  position?: number | string;

  served_by_guid?: string | null;
}

/**
 * Helps with page token and API interaction
 */
@Injectable()
export class ClientMetaService {
  /**
   * Constructor
   * @param location
   * @param session
   * @param client
   * @param platformId
   */
  constructor(
    protected location: Location,
    protected session: Session,
    protected client: Client,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Builds page token based on current location
   * @param salt
   * @param timestamp
   */
  buildPageToken(salt: string, timestamp: number) {
    const user = this.session.getLoggedInUser() || {};

    const tokenParts = [
      salt, // NOTE: Salt + hash so individual user activity can't be tracked
      this.location.path() || '/',
      user.guid || '000000000000000000',
      timestamp || 0,
    ];

    return hashCode(tokenParts.join(':'), 5);
  }

  /**
   * Records a view
   * @param entity
   * @param clientMetaDirective
   * @param extraClientMetaData
   */
  async recordView(
    entity: any,
    clientMetaDirective: ClientMetaDirective,
    extraClientMetaData: Partial<ClientMetaData> = {}
  ) {
    if (isPlatformServer(this.platformId)) {
      return; // Browser will record too.
    }

    await this.client.post('api/v2/analytics/views/entity/' + entity.guid, {
      client_meta: {
        ...(clientMetaDirective && clientMetaDirective.build()),
        ...extraClientMetaData,
      },
    });
  }
}
