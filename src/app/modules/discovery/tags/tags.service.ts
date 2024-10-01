import { Injectable, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { HashtagDefaultsService } from '../../hashtags/service/defaults.service';
import { isPlatformServer } from '@angular/common';
import { DiscoveryService } from '../discovery.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ExperimentsService } from '../../experiments/experiments.service';

export type DiscoveryTag = any;

@Injectable({ providedIn: 'root' })
export class DiscoveryTagsService {
  tags$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  trending$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  foryou$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  activityRelated$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  userAndDefault$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  other$: Observable<DiscoveryTag[]> = combineLatest(
    this.tags$,
    this.trending$
  ).pipe(
    map(([tags, trending]) => {
      const other = [];
      // Prevent duplicates
      for (let tag of trending) {
        if (tags.findIndex((i) => i.value === tag.value) === -1) {
          other.push(tag);
        }
      }
      return other;
    })
  );

  tagCount$: Observable<number> = this.tags$.pipe(
    map((tags) => tags?.length || 0)
  );

  /**
   * Default tags without user ones
   */
  defaults$: Observable<DiscoveryTag[]> = combineLatest([
    this.tags$,
    this.hashtagDefaults.tags$,
  ]).pipe(
    map(([tags, defaults]) => {
      const rawTags = tags.map((tag) => tag.value);

      return defaults
        .filter((item) => !rawTags.includes(item))
        .map((item) => ({
          value: item,
        }));
    })
  );

  // Add/Remove tracker
  remove$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);

  /**
   * A very unsophsticated check of whether tags have been changed and not yet saved.
   * Unsophisticated bc if you add and remove the same tag
   * (a.k.a. no net change) it will still return true
   */
  tagsChanged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // true when tags have been loaded.
  public loaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  plusHandler;

  constructor(
    private client: Client,
    private hashtagDefaults: HashtagDefaultsService,
    private discoveryService: DiscoveryService,
    private experiments: ExperimentsService,
    configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const handlers = configs.get('handlers');
    if (handlers) {
      this.plusHandler = handlers.plus;
    }
  }

  async loadTags(refresh = false, entityGuid = null) {
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) return;

    if (refresh) {
      this.tags$.next([]);
      this.trending$.next(null);
      this.remove$.next([]);
      this.activityRelated$.next(null);
    }

    let endpoint = 'api/v3/discovery/tags',
      params = entityGuid ? { entity_guid: entityGuid } : {};

    if (this.discoveryService.isPlusPage$.value) {
      params['wire_support_tier'] = this.plusHandler;
    }

    params['trending_tags_v2'] = true;

    try {
      const response: any = await this.client.get(endpoint, params);

      this.tags$.next(response.tags);
      this.trending$.next(response.trending);
      this.userAndDefault$.next(response.default);

      this.foryou$.next(
        response.for_you
          ? response.for_you.map((tag) => {
              return {
                value: tag.hashtag,
                posts_count: tag.volume,
                selected: tag.selected,
              };
            })
          : response.default
      );

      this.loaded$.next(true);

      this.activityRelated$.next(
        response.activity_related
          ? response.activity_related.map((tag) => {
              return {
                value: tag.hashtag,
                posts_count: tag.volume,
                selected: tag.selected,
              };
            })
          : null
      );
    } catch (err) {
    } finally {
      this.inProgress$.next(false);
    }
  }

  addTag(tag: DiscoveryTag): void {
    if (this.tags$.value.findIndex((i) => i.value === tag.value) === -1) {
      this.tags$.next([...this.tags$.value, tag]);
      this.tagsChanged$.next(true);
    }
  }

  removeTag(tag: DiscoveryTag): void {
    const pos: number = this.tags$.value.findIndex(
      (i) => i.value === tag.value
    );
    if (pos === -1) return;

    const selected = this.tags$.value.slice(0); // slice to clone, avoid changing original
    selected.splice(pos, 1);

    this.tags$.next(selected);
    this.remove$.next([...this.remove$.value, tag]);
    this.tagsChanged$.next(true);
  }

  async addSingleTag(tag: DiscoveryTag): Promise<boolean> {
    this.addTag(tag);
    return await this.saveTags();
  }

  async removeSingleTag(tag: DiscoveryTag): Promise<boolean> {
    this.removeTag(tag);
    return await this.saveTags();
  }

  /**
   * Counts tags a user has set.
   * @returns { Promise<number> } - amount of tags a user has set.
   */
  async countTags(): Promise<number> {
    const tags = this.tags$.getValue();
    return tags?.length ?? 0;
  }

  async saveTags(): Promise<boolean> {
    this.saving$.next(true);
    try {
      await this.client.post('api/v3/discovery/tags', {
        selected: this.tags$.value.map((tag) => tag.value),
        deselected: this.remove$.value
          .filter(
            (tag) =>
              this.tags$.value.findIndex((i) => i.value === tag.value) === -1
          )
          .map((tag) => tag.value),
      });
      this.tagsChanged$.next(false);
      return true;
    } catch (err) {
      return false;
    } finally {
      this.saving$.next(false);
    }
  }

  /**
   * Checks if a user HAS set tags already.
   * @returns { Promise<boolean> }
   */
  public async hasSetTags(): Promise<boolean> {
    if (this.inProgress$.getValue()) {
      await this.inProgress$.pipe(first()).toPromise();
    }
    if (!this.loaded$.getValue()) {
      await this.loadTags();
    }
    const count = await this.countTags();
    return count > 0;
  }

  /**
   * Removes a tag from the trending list.
   * @param { DiscoveryTag } tag - The tag to remove.
   * @returns { void }
   */
  public removeTagFromTrending(tag: DiscoveryTag): void {
    const index: number = this.trending$.value.findIndex(
      (i) => i.value === tag.value
    );
    if (index === -1) return;

    const tags = this.trending$.value.slice(0);
    tags.splice(index, 1);
    this.trending$.next(tags);
  }
}
