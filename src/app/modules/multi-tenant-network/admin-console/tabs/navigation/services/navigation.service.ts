import { Injectable, Injector, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  catchError,
  finalize,
  map,
  of,
  take,
} from 'rxjs';
import { ApolloQueryResult, MutationResult } from '@apollo/client';
import {
  DeleteCustomNavigationItemGQL,
  DeleteCustomNavigationItemMutation,
  GetNavigationItemsGQL,
  GetNavigationItemsQuery,
  NavigationItem,
  NavigationItemTypeEnum,
  ReorderNavigationItemsGQL,
  ReorderNavigationItemsMutation,
  ReorderNavigationItemsMutationVariables,
  UpsertNavigationItemGQL,
  UpsertNavigationItemMutation,
  UpsertNavigationItemMutationVariables,
} from '../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../../modals/confirm-v2/confirm.component';

/** Holds disabled state for a navigation item. */
export type DisabledNavigationItem = { defaultState: boolean };

/** ID mapped to disabled state */
export type DisabledNavigationItems = { [key: string]: DisabledNavigationItem };

/**
 * Service for management of custom navigation items
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantNavigationService implements OnDestroy {
  public readonly allNavigationItems$: ReplaySubject<NavigationItem[]> =
    new ReplaySubject<NavigationItem[]>();

  public readonly savingNavigationItem$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription[] = [];

  /** Navigation items that are disabled on mobile. */
  public readonly disabledMobileItems: DisabledNavigationItems = {
    boost: { defaultState: false },
    admin: { defaultState: false },
    memberships: { defaultState: false },
    newsfeed: { defaultState: true },
    explore: { defaultState: true },
  };

  /** Navigation items that are disabled on web. */
  public readonly disabledWebItems: DisabledNavigationItems = {
    admin: { defaultState: true },
  };

  constructor(
    private getNavigationItemsGQL: GetNavigationItemsGQL,
    private upsertNavigationItemGQL: UpsertNavigationItemGQL,
    private deleteCustomNavigationItemGQL: DeleteCustomNavigationItemGQL,
    private reorderNavigationItemsGQL: ReorderNavigationItemsGQL,
    private toaster: ToasterService,
    private modalService: ModalService,
    private injector: Injector
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public fetchNavigationItems(refresh: boolean = true): void {
    const subscription = this.getNavigationItemsGQL
      .fetch(null, {
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(
        take(1),
        catchError((error: any) => {
          console.error('fetchNavItems error:', error);
          return of(null);
        })
      )
      .subscribe(
        (result: ApolloQueryResult<GetNavigationItemsQuery> | null): void => {
          if (result && result.data) {
            this.allNavigationItems$.next(result.data.customNavigationItems);
          }
        }
      );

    this.subscriptions.push(subscription);
  }

  /**
   * Creates/edits a navigation item
   *
   * Must be subscribed to within components b/c we need to
   * perform different follow-up actions based on success/failure
   * @param { NavigationItem } item
   * @returns { Observable<boolean> }
   */
  public upsertNavigationItem(item: NavigationItem): Observable<boolean> {
    const mutationVars: UpsertNavigationItemMutationVariables = {
      ...item,
    };
    this.savingNavigationItem$.next(true);

    return this.upsertNavigationItemGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<UpsertNavigationItemMutation>) => {
        this.toaster.success(
          `Saved ${item.id === 'channel' ? item.id : item.name} successfully.`
        );
        this.fetchNavigationItems();
        return Boolean(result?.data?.upsertCustomNavigationItem?.id);
      }),
      catchError((e: any): Observable<boolean> => {
        if (e?.errors?.[0] && e.errors[0].message) {
          this.toaster.error(e.errors[0].message);
        }
        console.error(e);
        return of(false);
      }),
      finalize(() => this.savingNavigationItem$.next(false))
    );
  }

  /**
   * Edits the presentation order of the navigation items
   * @param { NavigationItems[] } items
   * @returns { Observable<boolean> }
   */
  public reorderNavigationItems(items: NavigationItem[]): void {
    const orderedIds = items.map((item) => item.id);

    const mutationVars: ReorderNavigationItemsMutationVariables = {
      ids: orderedIds,
    };

    const subscription = this.reorderNavigationItemsGQL
      .mutate(mutationVars)
      .pipe(
        take(1),
        map((result: MutationResult<ReorderNavigationItemsMutation>) => {
          return Boolean(result?.data?.updateCustomNavigationItemsOrder.length);
        }),
        catchError((error: any) => {
          if (error?.errors?.[0] && error.errors[0].message) {
            this.toaster.error(error.errors[0].message);
          } else {
            this.toaster.error(
              'An error occurred while reordering the navigation items.'
            );
          }
          console.error(error);
          return of(false);
        })
      )
      .subscribe();

    this.subscriptions.push(subscription);
  }

  /**
   * Confirms that the user wants to delete the item before deleting it.
   * Only applicable to custom links.
   * @param { NavigationItem } item
   */
  public deleteCustomNavigationItem(item: NavigationItem): void {
    if (item.type !== NavigationItemTypeEnum.CustomLink) {
      this.toaster.error('You may only delete custom links');
    }

    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Delete Custom Link',
        body: 'Are you sure you want to delete this link? This action cannot be undone.',
        confirmButtonColor: 'red',
        onConfirm: () => {
          modal.dismiss();

          const subscription = this.deleteCustomNavigationItemGQL
            .mutate({ id: item.id })
            .pipe(
              take(1),
              map(
                (
                  result: MutationResult<DeleteCustomNavigationItemMutation>
                ) => {
                  this.toaster.success('Navigation item deleted.');
                  this.fetchNavigationItems(); // Refresh the list of navigation items
                  return Boolean(result?.data?.deleteCustomNavigationItem);
                }
              ),
              catchError((error: any) => {
                if (error?.errors?.[0] && error.errors[0].message) {
                  this.toaster.error(error.errors[0].message);
                } else {
                  this.toaster.error(
                    'An error occurred while deleting the navigation item.'
                  );
                }
                console.error(error);
                return of(false);
              })
            )
            .subscribe();

          // Add the subscription to the array for cleanup
          this.subscriptions.push(subscription);
        },
      },
      injector: this.injector,
    });
  }
}
