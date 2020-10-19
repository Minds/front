import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import { Tag } from '../onboarding-panel.service';

@Injectable({ providedIn: 'root' })
export class OnboardingV3TagsService {
  private _tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

  private subscriptions: Subscription[] = [];

  constructor(private api: ApiService) {}

  get tags$(): BehaviorSubject<Tag[]> {
    return this._tags$;
  }

  set tags$(tags$: BehaviorSubject<Tag[]>) {
    this._tags$ = tags$;
  }

  public loadTags(): OnboardingV3TagsService {
    this.subscriptions.push(
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
        })
    );
    return this;
  }

  public async toggleTag(tagValue: string): Promise<OnboardingV3TagsService> {
    this.subscriptions.push(
      this.tags$
        .pipe(
          take(1),
          tap(tags => {
            for (let i = 0; i < tags.length; i++) {
              if (tags[i].value === tagValue) {
                let requestObservable: Observable<ApiResponse>;
                const endpoint = `api/v2/hashtags/user/${tags[i].value}`;

                if (!tags[i].selected) {
                  requestObservable = this.api.post(endpoint);
                } else {
                  requestObservable = this.api.delete(endpoint);
                }

                tags[i].selected = !tags[i].selected;

                this.subscriptions.push(
                  requestObservable.pipe(take(1)).subscribe()
                );
              }
            }
          })
        )
        .subscribe()
    );
    return this;
  }
}
