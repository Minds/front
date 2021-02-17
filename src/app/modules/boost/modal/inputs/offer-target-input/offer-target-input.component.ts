export type UserSearchResponse = { status: string; entities: MindsUser[] };

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { MindsUser } from '../../../../../interfaces/entities';

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
    />
    <ul
      *ngIf="(matches$ | async)?.length > 0 && !(forceClose$ | async)"
      class="m-boostOfferTarget__matchesList"
    >
      <li
        *ngFor="let match of matches$ | async"
        (click)="onMatchSelect($event, match.username)"
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
  public readonly matches$: BehaviorSubject<MindsUser[]> = new BehaviorSubject<
    MindsUser[]
  >([]);
  public readonly username$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');
  public readonly forceClose$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  @ViewChild('searchBox') searchBox: ElementRef;

  readonly cdnUrl: string;

  constructor(
    private api: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(
          map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
          filter(text => text.length > 2),
          debounceTime(10),
          distinctUntilChanged(),
          switchMap(searchTerm =>
            this.api.get(`api/v2/search/suggest/user`, {
              q: searchTerm,
              limit: 8,
              hydrate: 1,
            })
          ),
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

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public onMatchSelect($event: MouseEvent, username: string): void {
    this.username$.next(username);
    this.forceClose$.next(true);
  }

  public onAvatarClick($event: MouseEvent, username: string): void {
    $event.stopPropagation();

    if (isPlatformBrowser(this.platformId)) {
      window.open(`/${username}`, '_blank');
    }
  }

  public onUsernameChange($event, keepOpen: boolean = false) {
    this.forceClose$.next(false);
    this.username$.next($event);
  }
}
