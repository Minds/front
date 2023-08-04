import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { GroupMembersService } from '../services/members.service';
import { ApiResponse } from '../../../../../common/api/api.service';
import { GroupMembershipLevel } from '../../group.types';
import { MindsGroup } from '../../group.model';

/**
 * Presents a list of group members
 */
@Component({
  selector: 'm-group__membersList',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
})
export class GroupMembersListComponent implements OnInit, OnDestroy {
  // Whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Whether there is more data that could be added to the list.
  public readonly moreData$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // List subject.
  public readonly list$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  /** Value from service - what group are we talking about */
  public readonly group$: BehaviorSubject<MindsGroup> = this.service.group$;

  /** Value from service - which membership level do we want to present? */
  public readonly groupMembershipLevel$: BehaviorSubject<
    GroupMembershipLevel
  > = this.service.groupMembershipLevel$;

  /** Value from service - search for a specific user */
  public readonly searchQuery$: BehaviorSubject<string> = this.service
    .searchQuery$;

  // Number of members to request from API.
  private readonly requestLimit: number = 12;

  private subscriptions: Subscription[] = [];

  /**
   * Search query input
   */
  protected query: string = '';

  /**
   * The group we want to know about
   */
  @Input() group: MindsGroup;

  /**
   * Which membership level do we want to see in the list
   */
  @Input() membershipLevel: GroupMembershipLevel = GroupMembershipLevel.MEMBER;

  /**
   * Whether to show the search bar
   * ojm this is completely broken
   */
  @Input() showSearch: boolean = false;

  constructor(private service: GroupMembersService) {}

  ngOnInit(): void {
    // check that this user can even request it
    this.service.groupMembershipLevel$.next(this.membershipLevel);
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  /**
   * Init sub to fire on tab or filter change that will load / reload feed.
   * @returns { void }
   */
  public setupSubscriptions(): void {
    this.subscriptions.push(this.load$().subscribe());
  }

  /**
   * Load members list.
   * @returns { Observable<ApiResponse> }
   */
  public load$(): Observable<
    ApiResponse | { redirect: boolean; errorMessage: any }
  > {
    return combineLatest([
      this.group$,
      this.groupMembershipLevel$,
      this.searchQuery$,
    ]).pipe(
      distinctUntilChanged(),
      tap(_ => {
        this.inProgress$.next(true);
        this.list$.next([]);
      }),
      // debounceTime(100),
      switchMap(
        ([group, groupMembershipLevel, searchQuery]: [
          MindsGroup,
          GroupMembershipLevel,
          string
        ]): Observable<
          ApiResponse | { redirect: boolean; errorMessage: any }
        > => {
          return this.service.getList$(this.requestLimit, 0);
        }
      ),
      tap((response: any) => {
        if (!response) return; // ojm remove
        console.log('ojm response', response);
        this.moreData$.next(response['load-next']);
        this.inProgress$.next(false);
        this.list$.next(response.members);
      })
    );
  }

  /**
   * Load more from service based on list type and list length for offset.
   * @return { void }
   */
  public loadNext(): void {
    if (this.inProgress$.getValue()) {
      return;
    }
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.service
        .getList$(this.requestLimit, this.list$.getValue().length ?? null)
        .pipe(take(1))
        .subscribe((response: any) => {
          if (response && response.members && response.members.length) {
            let currentList = this.list$.getValue();
            this.list$.next([...currentList, ...response.members]);
            this.moreData$.next(response['load-next']);
          } else {
            this.moreData$.next(false);
          }
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * Search for a specific member
   */
  search(): void {
    this.service.searchQuery$.next(this.query);
  }

  /**
   * Called when a user is removed from the group by a moderator
   * @param member
   */
  onKick(member) {
    this.service.onKick(member);
  }

  /**
   * Whether no members text should be shown.
   * @returns { Observable<boolean> } - true if no members are found
   */
  get shouldShowNoMembersText$(): Observable<boolean> {
    return combineLatest([this.list$, this.inProgress$]).pipe(
      map(([list, inProgress]) => {
        return !inProgress && (!list || !list.length);
      })
    );
  }
}
