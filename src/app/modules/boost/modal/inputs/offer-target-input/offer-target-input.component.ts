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
      *ngIf="(matches$ | async)?.length > 0 && !(forceClose$ | async)"
      class="m-boostOfferTarget__matchesList"
    >
      <li
        *ngFor="let match of matches$ | async"
        (click)="onMatchSelect(match)"
        class="m-boostOfferTarget__matchesListItem"
      >
        <img
          class="m-boostOfferTarget__matchesListAvatar"
          (click)="onAvatarClick($event, match.username)"
          src="{{ cdnUrl }}fs/v1/avatars/{{ match.guid }}/small"
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
   * Search-box input reference.
   */
  @ViewChild('searchBox') searchBox: ElementRef;

  /**
   * CDN url
   */
  readonly cdnUrl: string;

  constructor(
    private api: ApiService,
    private service: BoostModalService,
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
          debounceTime(10),
          // if there is no change, do nothing.
          distinctUntilChanged(),
          // replace outputted observable with the result of a server call for matches.
          switchMap(searchTerm =>
            this.api.get(`api/v2/search/suggest/user`, {
              q: searchTerm,
              limit: 8,
              hydrate: 1,
            })
          ),
          // on error.
          catchError(e => {
            console.error(e);
            return of([]);
          })
        )
        .subscribe((response: UserSearchResponse) => {
          if (response.status === 'success' && response.entities.length > 0) {
            this.matches$.next(response.entities);
          }
        })
    );
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
