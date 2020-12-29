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
   * Holds true if subscription is in progress.
   */
  public readonly subscriptionInProgress$: BehaviorSubject<
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
   * True if subscribed to user.
   * @returns { boolean }
   */
  get subscribed(): boolean {
    const subscribed = this.entity.subscribed;

    if (typeof subscribed === 'boolean') {
      return this.entity.subscribed;
    }

    return false;
  }

  /**
   * Users avatar URL.
   * @returns { string }
   */
  get avatarUrl(): string {
    const iconTime: number = this.entity.icontime || 0;
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
  public onSubscribeToggle(): void {
    this.subscriptionInProgress$.next(true);

    if (this.entity.type === 'user') {
      const endpoint = `/${this.entity.guid}api/v1/subscribe/${this.entity.guid}`;

      const request = this.subscribed
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
              this.subscriptionInProgress$.next(false);
              return of(null);
            })
          )
          .subscribe(response => {
            this.subscriptionInProgress$.next(false);

            if (response.status !== 200) {
              throw new Error(
                response.message || 'An unknown error has occurred'
              );
            }

            this.entity.subscribed = !this.entity.subscribed;
          })
      );
    }
    // TODO: Groups
  }
}
