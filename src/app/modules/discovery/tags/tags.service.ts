import { Injectable, Injector } from '@angular/core';
import { Client } from '../../../services/api';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HashtagDefaultsService } from '../../hashtags/service/defaults.service';

export type DiscoveryTag = any;

@Injectable()
export class DiscoveryTagsService {
  tags$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  trending$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);
  other$: Observable<DiscoveryTag[]> = combineLatest(
    this.tags$,
    this.trending$
  ).pipe(
    map(([tags, trending]) => {
      const other = [];
      // Prevent duplicates
      for (let tag of trending) {
        if (tags.findIndex(i => i.value === tag.value) === -1) {
          other.push(tag);
        }
      }
      return other;
    })
  );

  /**
   * Default tags without user ones
   */
  defaults$: Observable<DiscoveryTag[]> = combineLatest([
    this.tags$,
    this.hashtagDefaults.tags$,
  ]).pipe(
    map(([tags, defaults]) => {
      const rawTags = tags.map(tag => tag.value);

      return defaults
        .filter(item => !rawTags.includes(item))
        .map(item => ({
          value: item,
        }));
    })
  );

  // Add/Remove tracker
  remove$: BehaviorSubject<DiscoveryTag[]> = new BehaviorSubject([]);

  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private client: Client,
    private hashtagDefaults: HashtagDefaultsService
  ) {}

  async loadTags(refresh = false) {
    this.inProgress$.next(true);
    if (refresh) {
      this.tags$.next([]);
      this.trending$.next(null);
      this.remove$.next([]);
    }
    const response: any = await this.client.get('api/v3/discovery/tags');
    this.inProgress$.next(false);
    this.tags$.next(response.tags);
    this.trending$.next(response.trending);
  }

  addTag(tag: DiscoveryTag): void {
    if (this.tags$.value.findIndex(i => i.value === tag.value) === -1) {
      this.tags$.next([...this.tags$.value, tag]);
    }
  }

  removeTag(tag: DiscoveryTag): void {
    const pos: number = this.tags$.value.findIndex(i => i.value === tag.value);
    if (pos === -1) return;

    const selected = this.tags$.value.slice(0); // slice to clone, avoid changing original
    selected.splice(pos, 1);

    this.tags$.next(selected);
    this.remove$.next([...this.remove$.value, tag]);
  }

  async saveTags(): Promise<boolean> {
    this.saving$.next(true);
    try {
      await this.client.post('api/v3/discovery/tags', {
        selected: this.tags$.value.map(tag => tag.value),
        deselected: this.remove$.value
          .filter(
            tag => this.tags$.value.findIndex(i => i.value === tag.value) === -1
          )
          .map(tag => tag.value),
      });
      return true;
    } catch (err) {
      return false;
    } finally {
      this.saving$.next(false);
    }
  }
}
