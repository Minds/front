import { Injectable } from '@angular/core';
import { EntitiesService } from '../../../common/services/entities.service';
import { Client } from '../../../services/api';

@Injectable()
export class SortedService {
  constructor(
    protected entitiesService: EntitiesService,
    protected client: Client
  ) {}

  async getMedia(channel: any, type: string, limit: number) {
    try {
      const response: any = await this.client.get(
        `api/v2/feeds/container/${channel.guid}/${type}`,
        {
          limit,
          sync: '',
          as_activities: '',
          force_public: '1',
        }
      );

      if (
        !response.entities ||
        typeof response.entities.length === 'undefined'
      ) {
        throw new Error('Invalid server response');
      }

      return response.entities.map(entity => {
        return entity.entity;
      });
    } catch (e) {
      console.error('SortedService.getMedia', e);
      return [];
    }
  }
}
