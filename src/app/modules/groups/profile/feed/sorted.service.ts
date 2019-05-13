import { Injectable } from "@angular/core";
import { EntitiesService } from "../../../../common/services/entities.service";

@Injectable()
export class SortedService {
  constructor(
    protected entitiesService: EntitiesService,
  ) {
  }

  async getPinnedPosts(group: any) {
    if (!group || !group.pinned_posts || !group.pinned_posts.length) {
      return [];
    }

    try {
      const entities = await this.entitiesService.fetch(group.pinned_posts);

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
}
