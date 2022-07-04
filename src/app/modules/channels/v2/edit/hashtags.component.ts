import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { TypeaheadInputComponent } from '../../../hashtags/typeahead-input/typeahead-input.component';
import { ChannelEditService } from './edit.service';

/**
 * Hashtags accordion pane component
 * Allows users to add/remove hashtags that are associated with their channel
 * (Note: these hashtags are different from the ones in discovery)
 */
@Component({
  selector: 'm-channelEdit__hashtags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'hashtags.component.html',
  styleUrls: ['hashtags.component.ng.scss'],
})
export class ChannelEditHashtagsComponent extends AbstractSubscriberComponent {
  /**
   * Typeahead component
   */
  @ViewChild('hashtagsTypeaheadInput')
  protected hashtagsTypeaheadInput: TypeaheadInputComponent;

  /**
   * Constructor
   * @param service
   */
  constructor(
    public service: ChannelEditService,
    private toast: FormToastService
  ) {
    super();
  }

  /**
   * Determines whether hashtag limit is reached.
   * @returns { Observable<boolean> }
   */
  get isHashtagLimitReached$(): Observable<boolean> {
    return this.service.hashtags$.pipe(map(hashtags => hashtags?.length >= 5));
  }

  /**
   * Adds a hashtag via service, unless limit is reach in which
   * case it will display a toast error. Will also show an error
   * in the event of an attempt to add a duplicate hashtag.
   * @param { string } hashtag - hashtag to add.
   * @returns { void }
   */
  public addHashtagIntent(hashtag: string): void {
    this.subscriptions.push(
      combineLatest([this.isHashtagLimitReached$, this.service.hashtags$])
        .pipe(
          take(1),
          map(([isHashtagLimitReached, hashtags]) => {
            if (isHashtagLimitReached) {
              return this.displayMaxTagsToast();
            }

            if (hashtags.indexOf(hashtag) > -1) {
              return this.displayDuplicateHashtagError();
            }

            this.service.addHashtag(hashtag);

            if (this.hashtagsTypeaheadInput) {
              this.hashtagsTypeaheadInput.reset();
            }
          }),
          catchError(this.handleError)
        )
        .subscribe()
    );
  }

  /**
   * Checks tag limit, throwing a toast if limit has been reached.
   * @returns { void }
   */
  public checkHashtagLimit(): void {
    this.subscriptions.push(
      this.isHashtagLimitReached$
        .pipe(
          take(1),
          filter((limitReached: boolean) => limitReached), // filter false values
          tap((limitReached: boolean) => this.displayMaxTagsToast()),
          catchError(this.handleError)
        )
        .subscribe()
    );
  }

  /**
   * Displays a toast error for max hashtags being reached.
   * @returns { void }
   */
  private displayMaxTagsToast(): void {
    this.toast.error('You can only have a maximum of 5 hashtags.');
  }

  /**
   * Displays a toast error for a duplicate hashtag being entered.
   * @returns { void }
   */
  private displayDuplicateHashtagError(): void {
    this.toast.error('You have already added this hashtag.');
  }

  /**
   * Handles errors in RXJS streams.
   * @param { unknown } e - error.
   * @returns { Observable<never> } - will return an EMPTY observable.
   */
  private handleError(error: unknown): Observable<never> {
    console.error(error);
    return EMPTY;
  }
}
