import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';

type TagsResponse = {
  status: string;
  tags?: Tag[] | [];
} | null;

export type Tag = {
  selected: boolean;
  value: string;
  type: string;
};

@Injectable({ providedIn: 'root' })
export class OnboardingV3PanelService {
  constructor(private api: ApiService) {}

  private _tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

  get tags$(): BehaviorSubject<Tag[]> {
    return this._tags$;
  }

  set tags$(tags$: BehaviorSubject<Tag[]>) {
    this._tags$ = tags$;
  }

  public loadTags(): OnboardingV3PanelService {
    this.api
      .get(
        'api/v2/hashtags/suggested',
        {
          trending: 0,
          defaults: 1,
          limit: 15,
        },
        3
      )
      .pipe(take(1))
      .subscribe(response => {
        this.tags$.next(response.tags);
      });
    return this;
  }

  public async toggleTag(tagValue: string): Promise<OnboardingV3PanelService> {
    console.log('toggling?');

    this.tags$
      .pipe(
        take(1),
        map((tags: Tag[]) => {
          return tags.map(tag => {
            if (tag.value === tagValue) {
              tag.selected = !tag.selected;
            }
          });
        })
      )
      .subscribe();

    // TODO: Merge these 2, above one toggles value, below one SHOULD send requests. needs testing modnay

    this.tags$.pipe(
      take(1),
      tap(async tags => {
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].value === tagValue) {
            if (!tags[i].selected) {
              await this.api.delete(`api/v2/hashtags/user/${tags[i].value}`);
            } else {
              await this.api.post(`api/v2/hashtags/user/${tags[i].value}`);
            }
          }
        }
      })
    );

    return this;
  }
}
