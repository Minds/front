import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, of, Subscription } from 'rxjs';
import { catchError, delay, take, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';

/**
 * Individual card for suggestions panel. Displays user information and holds popup card.
 */
@Component({
  selector: 'm-onboardingV3__suggestionsPanelCard',
  templateUrl: 'suggested-panel-card.component.html',
  styleUrls: ['./suggested-panel-card.component.ng.scss'],
})
export class OnboardingV3SuggestionsPanelCardComponent
  implements OnDestroy, AfterViewInit {
  private subscriptions: Subscription[] = [];

  /**
   * Holds true if subscription or joining is in progress.
   */
  public readonly actionInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * True if the "hover" state has been triggered to show the hover card.
   */
  public readonly hovering$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * mouseenter event used for delayed hover on card body.
   */
  public mouseenter$: Observable<boolean> = new Observable<any>(null);

  /**
   * mouseleave event used to cancel showing of card body.
   */
  public mouseleave$: Observable<boolean> = new Observable<any>(null);

  /**
   * Holds reference to the main body of the card (not avatar and sub button).
   */
  @ViewChild('bodyContainer') bodyContainerElement: ElementRef;

  /**
   * Channel or group entity.
   */
  @Input() entity: any;

  /**
   * Description to show on card.
   * @returns { string }
   */
  get description(): string {
    return this.entity.briefdescription;
  }

  /**
   * Name to show on card.
   * @returns { string }
   */
  get name(): string {
    return this.entity.name;
  }

  /**
   * Name to show on card.
   * @returns { string }
   */
  get username(): string {
    return this.entity.username;
  }

  /**
   * Count of subscribers.
   * @param { string | number }
   */
  get subscribersCount(): string | number {
    return this.entity.subscribers_count || '0';
  }

  /**
   * Count of subscriptions.
   * @param { string | number }
   */
  get subscriptionsCount(): string | number {
    return this.entity.subscriptions_count || '0';
  }

  /**
   * Count of memberships.
   * @param { string | number }
   */
  get membershipCount(): string | number {
    return this.entity['members:count'] || '0';
  }

  /**
   * Array of hashtags (without # char).
   * @returns { string[] }
   */
  get hashtags(): string[] {
    return this.entity.tags || [];
  }

  /**
   * Get url to navigate to on click.
   * @returns { string }
   */
  get url(): string {
    switch (this.entity.type) {
      case 'user':
        return '/' + this.entity.username;
      case 'group':
        return `/groups/profile/${this.entity.guid}/feed`;
      default:
        return '';
    }
  }

  /**
   * True if subscribed to user or is member of group.
   * @returns { boolean }
   */
  get isSubscribed(): boolean {
    switch (this.entity.type) {
      case 'user':
        const subscribed = this.entity.subscribed;

        if (typeof subscribed === 'boolean') {
          return this.entity.subscribed;
        }
        return false;

      case 'group':
        const isMember = this.entity['is:member'];

        if (typeof isMember === 'boolean') {
          return isMember;
        }

        return false;

      default:
        return false;
    }
  }

  /**
   * Users avatar URL.
   * @returns { string }
   */
  get avatarUrl(): string {
    const iconTime: number = this.entity.icontime || 0;

    if (this.entity && this.entity.type === 'group') {
      return `${this.configs.get('cdn_url')}fs/v1/avatars/${
        this.entity.guid
      }/${iconTime}`;
    }

    return `${this.configs.get('cdn_url')}icon/${
      this.entity.guid
    }/medium/${iconTime}`;
  }

  constructor(
    private configs: ConfigsService,
    private api: ApiService,
    private toast: FormToastService
  ) {}

  ngAfterViewInit(): void {
    this.setupHoverListeners(); // makes use of ViewChild so has to be AfterViewInit
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Sets up observables that fire on mouseenter/mouseleave of the card body.
   * When these observables fire they show/hide the card appropriately,
   * when body for more than 500ms and the mouseleave event has not fired.
   *
   * @returns { void }
   */
  setupHoverListeners(): void {
    if (!this.bodyContainerElement) {
      return;
    }

    // set instance variables to new observables that fire on mouseenter/mouseleave of card body
    this.mouseenter$ = fromEvent(
      this.bodyContainerElement.nativeElement,
      'mouseenter'
    );
    this.mouseleave$ = fromEvent(
      this.bodyContainerElement.nativeElement,
      'mouseleave'
    );

    this.subscriptions.push(
      // emit after 500ms, or until mouseleave observable fires.
      this.mouseenter$
        .pipe(delay(500), takeUntil(this.mouseleave$))
        .subscribe(() => {
          this.hovering$.next(true); // show card
        })
    );

    this.subscriptions.push(
      // emit on mouseleave
      this.mouseleave$.subscribe(() => {
        this.hovering$.next(false); // hide card
        // recursively reset listeners so that events can fire again if the user mouses out and back in.
        this.setupHoverListeners();
      })
    );
  }

  /**
   * Called when subscribe / join is toggled.
   * @returns { void }
   */
  public onActionToggle(): void {
    this.actionInProgress$.next(true);

    switch (this.entity.type) {
      case 'user':
        this.toggleChannelSubscription();
        break;
      case 'group':
        this.toggleGroupMembership();
        break;
    }
  }

  /**
   * Calls endpoint appropriately to toggle channel subscription
   * between subscribed and not.
   * @returns { void }
   */
  private toggleChannelSubscription(): void {
    const endpoint = `${this.entity.guid}api/v1/subscribe/${this.entity.guid}`;

    const request = this.isSubscribed
      ? this.api.delete(endpoint)
      : this.api.post(endpoint);

    this.subscriptions.push(
      request
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            this.toast.error(
              'An unknown error has occurred subscribing to this channel'
            );
            this.actionInProgress$.next(false);
            return of(null);
          })
        )
        .subscribe(response => {
          this.actionInProgress$.next(false);

          if (response.status !== 200) {
            throw new Error(
              response.message || 'An unknown error has occurred'
            );
          }

          this.entity.subscribed = !this.entity.subscribed;
        })
    );
  }

  /**
   * Calls endpoint appropriately to toggle group membership
   * between being a member and not being a member.
   * @returns { void }
   */
  private toggleGroupMembership(): void {
    const endpoint = `api/v1/groups/membership/${this.entity.guid}`;

    const request = this.isSubscribed
      ? this.api.delete(endpoint)
      : this.api.put(endpoint);

    this.subscriptions.push(
      request
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            this.toast.error(
              'An unknown error has occurred joining or leaving this group'
            );
            this.actionInProgress$.next(false);
            return of(null);
          })
        )
        .subscribe(response => {
          this.actionInProgress$.next(false);

          if (response.status === 'error') {
            throw new Error(
              response.message || 'An unknown error has occurred '
            );
          }

          this.entity['is:member'] = !this.entity['is:member'];
        })
    );
  }
}
