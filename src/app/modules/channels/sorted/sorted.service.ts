import { Injectable } from "@angular/core";
import { EntitiesService } from "../../../common/services/entities.service";
import { Client } from "../../../services/api";

@Injectable()
export class SortedService {
  constructor(
    protected entitiesService: EntitiesService,
    protected client: Client,
  ) {
  }

  async getPinnedPosts(channel: any) {
    if (!channel || !channel.pinned_posts || !channel.pinned_posts.length) {
      return [];
    }

    try {
      const entities = await this.entitiesService.fetch(channel.pinned_posts);

      if (!entities) {
        return [];
      }

      return entities
        .filter(entity => Boolean(entity))
        .map(entity => ({ ...entity, pinned: true }));
    } catch (e) {
      console.error('Error fetching pinned posts', e);
      return [];
    }
  }

  async getMedia(channel: any, type: string, limit: number) {
    try {
      const response: any = await this.client.get(`api/v2/feeds/container/${channel.guid}/${type}`, {
        limit,
        sync: '',
        as_activities: '',
        force_public: '1',
      });

      if (!response.entities || typeof response.entities.length === 'undefined') {
        throw new Error('Invalid server response');
      }

      return response.entities;
    } catch (e) {
      console.error('SortedService.getMedia', e);
      return [];
    }
  }
}
