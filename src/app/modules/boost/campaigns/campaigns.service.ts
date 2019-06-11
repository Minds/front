import { Injectable } from '@angular/core';
import { EntitiesService } from '../../../common/services/entities.service';
import { CampaignType } from './campaigns.type';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

const matchTypeOrNull = (type: CampaignType, content) => {
  if (!content) {
    return null;
  }

  const taxonomy = [content.type, content.subtype].filter(Boolean).join(':');

  if (type === 'newsfeed' && taxonomy !== 'activity') {
    console.warn('Type mismatch', {type, taxonomy});
    return null;
  }

  if (type === 'content' && ['object:image', 'object:video', 'object:blog', 'group', 'user'].indexOf(taxonomy) === -1) {
    console.warn('Type mismatch', {type, taxonomy});
    return null;
  }

  return content;
};

@Injectable()
export class CampaignsService {

  constructor(
    protected session: Session,
    protected client: Client,
    protected entitiesService: EntitiesService,
  ) {
  }

  async getContent(type: CampaignType, query: string) {
    if (/^[0-9]+$/.test(query) || /^urn:entity:[0-9]+$/.test(query)) {
      const content = await this.getContentByGuidOrUrn(query);
      return matchTypeOrNull(type, content);
    } else if (/\/newsfeed\/[0-9]+/.test(query)) {
      const content = await this.getContentByRouteLink(query);
      return matchTypeOrNull(type, content);
    }

    return await this.getContentByQuery(type, query);
  }

  async getContentByGuidOrUrn(guidOrUrn: string) {
    return await this.entitiesService.single(guidOrUrn);
  }

  async getContentByRouteLink(href: string) {
    const regex = /\/newsfeed\/([0-9]+)/;
    const matches = regex.exec(href);

    if (!matches || !matches[1]) {
      return null;
    }

    return await this.entitiesService.single(matches[1]);
  }

  async getContentByQuery(type: CampaignType, query: string) {
    const userGuid = this.session.getLoggedInUser().guid;
    const feedTypes = [];

    switch (type) {
      case 'newsfeed':
        feedTypes.push('activities');
        break;

      case 'content':
        feedTypes.push('images', 'videos', 'blogs');
        break;
    }

    const results: Array<any> = await Promise.all(feedTypes.map(feedType => this.client.get(`api/v2/feeds/container/${userGuid}/${feedType}`, {
      sync: 1,
      force_public: 1,
      query,
      limit: 1,
      // TODO: Add nsfw
    })));

    const entityIds = [];

    for (let result of results) {
      if (!result || !result.entities) {
        continue;
      }

      entityIds.push(...result.entities.map(entity => entity.urn || entity.guid).filter(Boolean))
    }

    const entities: Array<any> = await this.entitiesService.fetch(entityIds);

    if (!entities || !entities.length) {
      return null;
    }

    let result: any = entities[0];

    for (let entity of entities) {
      if (entity.time_created > result.time_created) {
        result = entity;
      }
    }

    return result;
  }
}
