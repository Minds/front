import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { MindsUser } from '../../../../../interfaces/entities';
import { BoostModalService } from '../../boost-modal.service';

/**
 * Type-ahead search response from server.
 */
export type UserSearchResponse = { status: string; entities: MindsUser[] };

/**
 * Input for the target of a boost offer - drops down with suggestions from server.
 */
@Component({
  selector: 'm-boostModal__offer-target-input',
  template: `
    <h2 class="m-boostOfferTarget__title" i18n="@@BOOST_MODAL__TARGET_CHANNEL">
      Target Channel
    </h2>
    <input
      [ngModel]="username$ | async"
      (ngModelChange)="onUsernameChange($event)"
      class="m-boostOfferTarget__input"
      type="text"
      #searchBox
      data-cy="data-minds-boost-modal-target-input"
    />
    <ul
      *ngIf="showPopout$ | async"
      class="m-boostOfferTarget__matchesList"
      #matchesPopout
    >
      <li
        *ngFor="let match of matches$ | async"
        (click)="onMatchSelect(match)"
        class="m-boostOfferTarget__matchesListItem"
      >
        <img
          class="m-boostOfferTarget__matchesListAvatar"
          (click)="onAvatarClick($event, match.username)"
          src="{{ cdnUrl }}icon/{{ match.guid }}/small/{{ match.icontime }}"
        />
        <span
          class="m-boostOfferTarget__matchesListText m-boostOfferTarget__matchesListText--primary"
          >{{ match.name }}</span
        >
        <span
          class="m-boostOfferTarget__matchesListText m-boostOfferTarget__matchesListText--secondary"
          >&nbsp;·&nbsp;@{{ match.username }}</span
        >
      </li>
      <li *ngIf="inProgress$ | async">
        <m-loadingSpinner [inProgress]="true"></m-loadingSpinner>
      </li>
    </ul>
  `,
  styleUrls: ['./offer-target-input.component.ng.scss'],
})
export class BoostModalOfferTargetInputComponent implements AfterViewInit {
  private subscriptions: Subscription[] = [];

  /**
   * Type-ahead matches from server.
   */
  public readonly matches$: BehaviorSubject<MindsUser[]> = new BehaviorSubject<
    MindsUser[]
  >([]);

  /**
   * Users username, held as the value in the components main input.
   */
  public readonly username$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  /**
   * Force the suggestions dropdown to close.
   */
  public readonly forceClose$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Holds true temporarily when matches popout has been clicked inside.
   */
  private clickedInside$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Whether a request is in progress.
   */
  private inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Search-box input reference.
   */
  @ViewChild('searchBox') searchBox: ElementRef;

  /**
   * Matches popout - note this will be destroyed when there are no matches.
   * Subscriptions will have to be set-up again on change and you should make sure that it exists before using.
   */
  @ViewChild('matchesPopout') matchesPopout: ElementRef;

  /**
   * CDN url
   */
  readonly cdnUrl: string;

  constructor(
    private api: ApiService,
    private service: BoostModalService,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      // New observable from input events on the search-box.
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(
          // map to vaLue from keyboard event
          map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
          // effectively break if the char count is less than 2
          filter(text => text.length > 2),
          // debounce request to throttle server requests
          debounceTime(100),
          // if there is no change, do nothing.
          distinctUntilChanged(),
          // replace outputted observable with the result of a server call for matches.
          switchMap(searchTerm => {
            this.inProgress$.next(true);
            this.matches$.next([]);
            return this.api.get(`api/v2/search/suggest/user`, {
              q: searchTerm,
              limit: 8,
              hydrate: 1,
            });
          }),
          // on error.
          catchError(e => {
            console.error(e);
            return of([]);
          })
        )
        .subscribe((response: UserSearchResponse) => {
          this.inProgress$.next(false);
          if (response.status === 'success' && response.entities.length > 0) {
            this.matches$.next(response.entities);
          }
        }),

      // ViewChild is destroyed in template *ngIf - reset this sub when matches popout shown.
      this.showPopout$.subscribe(() => {
        this.setupMatchesSubscription();
      }),

      // Using this and the subscription created above, force close if clicked outside of the target.
      fromEvent(document, 'click', { capture: true }).subscribe($event => {
        // push to back of queue so that interior event listener runs first.
        setTimeout(() => {
          if (!this.clickedInside$.getValue()) {
            this.forceClose$.next(true);
          }
          this.clickedInside$.next(false);
        }, 0);
      })
    );
  }

  /**
   * Whether popoout should be shown.
   * @returns { Observable<boolean> } - true if popout should be shown
   */
  get showPopout$(): Observable<boolean> {
    return combineLatest([
      this.matches$,
      this.forceClose$,
      this.username$,
      this.inProgress$,
    ]).pipe(
      take(1),
      // map new value of observable.
      map(([matches, forceClose, username, inProgress]) => {
        return (
          (matches.length > 0 || inProgress) &&
          username.length > 2 &&
          !forceClose
        );
      })
    );
  }

  /**
   * Subscribe to clicks in the matches popout window -
   * stops event propagation and sets a temporary value to clickedInside$.
   * Works in tandem with document click listener to tell whether a click is
   * inside the matches sub-box or outside of it.
   *
   * @returns { void }
   */
  private setupMatchesSubscription(): void {
    if (this.matchesPopout && this.matchesPopout.nativeElement) {
      this.subscriptions.push(
        fromEvent(this.matchesPopout.nativeElement, 'click').subscribe(
          ($event: any) => {
            $event.stopPropagation();
            this.clickedInside$.next(true);
          }
        )
      );
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * On avatar click open the clicked users channel in a new tab..
   * @param { MouseEvent } $event - the mouse event.
   * @param { username } username - username who's channel we will navigate to.
   * @returns { void }
   */
  public onAvatarClick($event: MouseEvent, username: string): void {
    // prevents default behavior of onMatchSelect
    $event.stopPropagation();

    if (isPlatformBrowser(this.platformId)) {
      window.open(`/${username}`, '_blank');
    }
  }

  /**
   * On match select, populate the targetUser$ in service and
   * update class level username$ subject.
   * @param { MindsUser } match - selected match.
   * @returns { void }
   */
  public onMatchSelect(match: MindsUser): void {
    this.username$.next(match.username);
    this.service.targetUser$.next(match);
    this.forceClose$.next(true); //ordering of these? cannot click from opt dropdown
  }

  /**
   * On username change, update the target user in service and
   * class level username$
   * @param { string } $event - usernames string.
   * @returns { void }
   */
  public onUsernameChange($event: string): void {
    this.forceClose$.next(false);
    this.username$.next($event);
    this.setTargetUser();
  }

  /**
   * Sets target user in service from current typed username.
   */
  private setTargetUser(): void {
    this.subscriptions.push(
      // with latest username and matches
      combineLatest([this.username$, this.matches$])
        .pipe(
          take(1),
          // map new value of observable.
          map(([username, matches]) => {
            // filter down matches to the one with a matching username, or an empty array
            return matches.filter(match => {
              return match.username === username;
            })[0];
          })
        )
        .subscribe(user => {
          this.service.targetUser$.next(user);
        })
    );
  }
}
