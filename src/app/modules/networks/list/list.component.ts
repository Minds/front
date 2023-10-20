import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { NetworksListService } from './list.service';
import { ApiResponse } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { NetworksListItem } from '../network.types';
import { NetworksCreateAdminModalService } from '../create-admin/create-admin.modal.service';

@Component({
  selector: 'm-networks__list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.ng.scss'],
})
export class NetworksListComponent implements OnInit, OnDestroy {
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

  // Number of members to request from API.
  private readonly requestLimit: number = 12;

  private subscriptions: Subscription[] = [];

  ojmFakeData = {
    status: 'success',
    tenants: [
      {
        id: '123',
      },
      {
        name: 'Valuetainment network',
      },
      {
        name:
          'BubblesBubblesBubblesBubblesBubblesBubblesBubblesBubblesBubblesBubbles ',
      },
    ],
  };
  constructor(
    private service: NetworksListService,
    private session: Session,
    private createAdminModal: NetworksCreateAdminModalService
  ) {}

  ngOnInit(): void {
    if (this.session.getLoggedInUser()) {
      this.service.user$.next(this.session.getLoggedInUser());

      /** sub to load/reload the list */
      this.subscriptions.push(this.load$().subscribe());
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Load members list.
   * @returns { Observable<ApiResponse> }
   */
  public load$(): Observable<
    ApiResponse | { redirect: boolean; errorMessage: any }
  > {
    return this.service.user$.pipe(
      distinctUntilChanged(),
      tap(_ => {
        this.inProgress$.next(true);
        this.list$.next([]);
      }),
      switchMap(
        (): Observable<
          ApiResponse | { redirect: boolean; errorMessage: any }
        > => {
          return this.service.getList$(this.requestLimit, 0);
        }
      ),
      tap((response: any) => {
        // ojm uncomment this.moreData$.next(response['load-next']);
        this.inProgress$.next(false);
        // ojm uncomment and delete
        this.list$.next(this.ojmFakeData.tenants);
        // this.list$.next(response.tenants);
      }),
      shareReplay()
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
          if (response && response.networks && response.networks.length) {
            let currentList = this.list$.getValue();
            this.list$.next([...currentList, ...response.networks]);

            this.moreData$.next(response['load-next']);
          } else {
            this.moreData$.next(false);
          }
          this.inProgress$.next(false);
        })
    );
  }

  /**
   * Show a bulb if the network doesn't have an icon yet
   */
  getIconUrl(network: NetworksListItem): string {
    return network.iconUrl ? network.iconUrl : '/assets/logos/bulb.jpg';
  }

  /**
   * Go to the billing details for the clicked network
   */
  clickedManageBilling(network: NetworksListItem): void {
    // ojm todo
  }

  /**
   * Go to the clicked network
   */
  clickedGoToNetwork(network: NetworksListItem): void {
    // ojm todo
  }

  /**
   * Setup to the clicked network
   */
  async clickedSetUpNetwork(network: NetworksListItem): Promise<void> {
    // Create handle modal
    this.createAdminModal.present(network.id);
  }
}
