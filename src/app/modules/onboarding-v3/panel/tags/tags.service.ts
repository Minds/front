import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';

/**
 *  Tag object
 */
export type Tag = {
  selected: boolean;
  value: string;
  type: string;
};

/**
 * Singleton service at lazy module level, dealing with tags for onboarding v3
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV3TagsService {
  /**
   * Holds selected tags
   */
  private _tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

  private subscriptions: Subscription[] = [];

  constructor(private api: ApiService) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Get all tags.
   * @returns { BehaviorSubject<Tag[]> } - array of Tags
   */
  get tags$(): BehaviorSubject<Tag[]> {
    return this._tags$;
  }

  /**
   * Set all tags.
   * @param { BehaviorSubject<Tag> } - behaviour subject ot tag
   */
  set tags$(tags$: BehaviorSubject<Tag[]>) {
    this._tags$ = tags$;
  }

  /**
   * Load tags from server and push value to tags$.
   * @returns { OnboardingV3TagsService } - chainable.
   */
  public loadTags(): OnboardingV3TagsService {
    this.subscriptions.push(
      this.api
        .get(
          'api/v2/hashtags/suggested',
          {
            trending: 0,
            defaults: 1,
            limit: 24,
          },
          3
        )
        .pipe(
          take(1),
          catchError((e: any) => {
            console.error(e);
            return of([]);
          })
        )
        .subscribe((response: any) => {
          this.tags$.next(response.tags);
        })
    );
    return this;
  }

  /**
   * Toggle a tag selected or unselected. Write to db.
   * @param { string } tagValue - value of the tag e.g. "technology"
   * @return { Promise<OnboardingV3TagsService> } - chainable.
   */
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
                  requestObservable
                    .pipe(
                      take(1),
                      catchError((e: any) => {
                        console.error(e);
                        return of(null);
                      })
                    )
                    .subscribe()
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
