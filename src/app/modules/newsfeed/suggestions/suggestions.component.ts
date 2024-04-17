import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {
  RelatedContentPool,
  RelatedContentPools,
  RelatedContentService,
} from '../../../common/services/related-content.service';
import getActivityContentType from '../../../helpers/activity-content-type';
import { Session } from '../../../services/session';
import { ActivityEntity } from '../activity/activity.service';

/**
 * Sidebar widget with suggested activities inside
 *
 * See it on the sidebar of a single entity page
 */
@Component({
  selector: 'm-newsfeed__activitySuggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.ng.scss'],
  providers: [RelatedContentService],
})
export class NewsfeedActivitySuggestionsComponent {
  protected _baseEntity: ActivityEntity;

  /**
   * The 'base' entity is the activity that will be
   * used to determine which posts to suggest
   */
  @Input() set baseEntity(e: ActivityEntity) {
    if (e) {
      this._baseEntity = e;
      this.onBaseEntityChange(e);
    }
  }

  /**
   * Raw feed entities are filtered by content type
   */
  entities: Array<any> = [];
  inProgress: boolean = false;

  constructor(
    public session: Session,
    protected relatedContent: RelatedContentService
  ) {}

  async onBaseEntityChange(e: ActivityEntity): Promise<void> {
    this.inProgress = true;
    this.entities = [];
    this.relatedContent.setContext('container');
    this.relatedContent.setBaseEntity(e);

    try {
      await this.relatedContent.fetch();
      const pools = this.relatedContent.pools;

      if (pools) {
        this.collatePools(pools);
      }
    } catch (e) {}
    this.inProgress = false;
  }

  collatePools(pools: RelatedContentPools): void {
    this.filterPoolByType(pools.next);

    // if there aren't enough viable posts in the 'next' pool
    // try the 'previous' pool
    if (this.entities.length < 3) {
      this.filterPoolByType(pools.prev);
    }

    this.entities.length = Math.min(this.entities.length, 3);
  }

  filterPoolByType(pool: RelatedContentPool): void {
    if (!pool.entities.length) {
      return;
    }

    pool.entities.forEach((e) => {
      let entity = e.entity;
      const type = getActivityContentType(entity, true, false);
      // if (type === 'image' || type === 'video' || type === 'blog') {
      this.entities.push(entity);
      // }
    });
  }

  get headerName(): string {
    if (!this._baseEntity) {
      return;
    }

    if (this.baseEntityIsGroupPost && this._baseEntity.containerObj.name) {
      return this._baseEntity.containerObj.name;
    }

    const baseOwner = this._baseEntity.ownerObj;

    if (baseOwner.guid === this.session.getLoggedInUser().guid) {
      return 'you';
    }

    return baseOwner.name;
  }

  get baseEntityIsGroupPost(): boolean {
    return !!(
      this._baseEntity.containerObj &&
      this._baseEntity.containerObj.type === 'group'
    );
  }
}
