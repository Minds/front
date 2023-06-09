import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  take,
  timer,
} from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { TwitterSyncService } from './twitter-sync.service';
import {
  TwitterSyncTweetMessageGQL,
  TwitterSyncTweetMessageQuery,
} from '../../../../graphql/generated.strapi';
import { ApolloQueryResult } from '@apollo/client';
import { SITE_URL } from '../../../common/injection-tokens/url-injection-tokens';

@Component({
  selector: 'm-twitterSync',
  templateUrl: './twitter-sync.component.html',
  styleUrls: ['./twitter-sync.component.ng.scss'],
})
export class TwitterSyncComponent implements OnInit, OnDestroy {
  // The setup form
  form: UntypedFormGroup;

  // The edit form (for once setup)
  updateForm: UntypedFormGroup;

  // If the twitter connect is setup
  isSetup = false;

  // If inprogress
  inProgress = true;

  // If saving
  isSaving = false;

  // The min number of followers we will try to sync for
  minFollowersForSync: number;

  /** Subscription for retrieval of Strapi data. */
  private strapiDataSubscription: Subscription;

  /** Whether a request from Strapi data is currently in progress. */
  private readonly strapiDataRequestInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    private session: Session,
    protected twitterSyncService: TwitterSyncService,
    protected configs: ConfigsService,
    protected toasterService: ToasterService,
    private twitterSyncMessageGql: TwitterSyncTweetMessageGQL,
    @Inject(SITE_URL) private siteUrl: string
  ) {
    this.form = new UntypedFormGroup({
      twitterHandle: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
    });
    this.updateForm = new UntypedFormGroup({
      discoverable: new UntypedFormControl(true, {
        validators: [],
      }),
    });

    this.minFollowersForSync = configs.get('twitter').min_followers_for_sync;
  }

  ngOnInit() {
    this.twitterSyncService
      .getConnectedAccount()
      .then(account => {
        this.isSetup = true;
        this.updateForm.controls.discoverable.setValue(account.discoverable);
      })
      .finally(() => {
        this.inProgress = false;
      });
  }

  ngOnDestroy(): void {
    this.strapiDataSubscription?.unsubscribe();
  }

  get username(): string {
    return this.session.getLoggedInUser().username;
  }

  /**
   * Post verification message to Twitter. Will attempt to fetch URL from Strapi
   * before navigation. In the event of a failure will fall back to default text.
   * @param { MouseEvent } e - mouse event.
   * @returns { void }
   */
  public postToTwitter(e: MouseEvent): void {
    this.strapiDataRequestInProgress$.next(true);

    this.strapiDataSubscription = this.twitterSyncMessageGql
      .fetch()
      .pipe(
        take(1),
        map(
          (result: ApolloQueryResult<TwitterSyncTweetMessageQuery>): string => {
            const twitterSyncText: string =
              result?.data?.twitterSyncTweetText?.data?.attributes?.tweetText;
            if (!twitterSyncText) {
              throw new Error(
                'Unable to parse attributes from Strapi response'
              );
            }
            return twitterSyncText;
          }
        ),
        catchError(
          (e: unknown): Observable<string> => {
            console.error(e);
            return of('Follow me on @minds {url}');
          }
        )
      )
      .subscribe((twitterSyncText: string): void => {
        window.open(
          'https://twitter.com/intent/tweet?text=' +
            twitterSyncText.replace('{url}', this.siteUrl + this.username)
        );
        this.strapiDataRequestInProgress$.next(false);
      });
  }

  async onDisoverableCheckboxClick(e: MouseEvent): Promise<void> {
    this.isSaving = true;
    const newValue = !this.updateForm.controls.discoverable.value;
    try {
      await this.twitterSyncService.updateSettings({ discoverable: newValue });
      this.toasterService.success('Updated');
    } catch (err) {
      this.toasterService.error(err.message);
    } finally {
      this.isSaving = false;
    }
  }

  async verify(e: MouseEvent): Promise<void> {
    this.isSaving = true;

    this.toasterService.inform(
      'Please wait a moment, tweets can take a while to be visible.'
    );

    await timer(15000).toPromise(); // Delay by 15 seconds as twitter can take a while

    try {
      await this.twitterSyncService.createConnectAccount(
        this.form.controls.twitterHandle.value
      );
      this.isSetup = true;
    } catch (err) {
      this.toasterService.error(
        "Sorry, we couldn't find your verification post"
      );
    } finally {
      this.isSaving = false;
    }
  }

  async disconnect(e: MouseEvent): Promise<void> {
    this.isSaving = true;
    try {
      await this.twitterSyncService.disconnectAccount();
      this.isSetup = false;
    } catch (err) {
    } finally {
      this.isSaving = false;
    }
  }
}
