import { Injectable } from '@angular/core';
import { CampaignType } from './campaigns.type';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import normalizeUrn from '../../../helpers/normalize-urn';

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
export class CampaignContentsService {

  constructor(
    protected session: Session,
    protected client: Client,
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
    return (await this.getEntities([guidOrUrn]))[0];
  }

  async getContentByRouteLink(href: string) {
    const regex = /\/newsfeed\/([0-9]+)/;
    const matches = regex.exec(href);

    if (!matches || !matches[1]) {
      return null;
    }

    return (await this.getEntities([matches[1]]))[0];
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

    const entities: Array<any> = await this.getEntities(entityIds);

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

  async getEntities(urns: string[]) {
    // TODO: Replace with a better Entities Sync service (w/ caching)

    const entities = (await this.client.get(`api/v2/entities`, {
      urns: urns.join(','),
      as_activities: '',
    }) as any).entities || [];

    return entities
      .filter(Boolean)
      .map(entity => ({
        ...entity,
        urn: normalizeUrn(entity.urn || entity.guid)
      }));
  }
}
