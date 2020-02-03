import { BehaviorSubject, Observable } from 'rxjs';
import { MindsUser, MindsGroup } from '../../../interfaces/entities';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

export type ActivityDisplayOptions = {
  showOwnerBlock: boolean;
  showComments: boolean;
  showOnlyCommentsInput: boolean;
  showToolbar: boolean;
  showEditedTag: boolean;
  fixedHeight: boolean;
};

export type ActivityEntity = {
  guid: string;
  remind_object?: Object;
  ownerObj: MindsUser;
  containerObj: MindsGroup | null;
  message: string;
  title: string;
  blurb: string;
  custom_type: 'video' | 'batch';
  custom_data: any;
  entity_guid: string | null;
  thumbnail_src: string;
  perma_url: string;
  time_created: number;
  edited: boolean;
  modal_source_url?: string;
};

@Injectable()
export class ActivityService {
  entity$ = new BehaviorSubject(null);
  canonicalUrl$: Observable<string> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      if (!entity) return '';
      const guid = entity.entity_guid || entity.guid;
      return `/newsfeed/${guid}`;
    })
  );
  canDelete$: Observable<boolean> = this.entity$.pipe();
  canShowContent$: Observable<boolean> = this.entity$.pipe();
  isBoost$: Observable<boolean> = this.entity$.pipe();
  isRemind$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && !!entity.remind_object;
    })
  );
  isEdited$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && entity.edited;
    })
  );
  isUnlisted$: Observable<boolean> = this.entity$.pipe();

  displayOptions: ActivityDisplayOptions = {
    showOwnerBlock: true,
    showComments: true,
    showOnlyCommentsInput: true,
    showToolbar: true,
    showEditedTag: false,
    fixedHeight: false,
  };

  constructor(private configs: ConfigsService) {}

  /**
   * Emits new entity
   * @param entity
   * @return ActivityService
   */
  setEntity(entity): ActivityService {
    if (entity.type !== 'activity') entity = this.patchForeignEntity(entity);
    this.entity$.next(entity);
    return this;
  }

  /**
   * Sets display options
   * @param options
   * @return ActivityService
   */
  setDisplayOptions(options: Object = {}): ActivityService {
    this.displayOptions = Object.assign(this.displayOptions, options);
    return this;
  }

  private patchForeignEntity(entity): ActivityEntity {
    switch (entity.subtype) {
      case 'image':
        entity.custom_type = 'batch';
        entity.custom_data = [
          {
            thumbnail_src: 'todo',
          },
        ];
        break;
      case 'video':
        entity.blurb = entity.description;
        entity.custom_type = 'video';
        entity.entity_guid = entity.guid;
        break;
      case 'album':
        // Not supported
        break;
      case 'blog':
        break;
    }

    return entity;
  }
}
