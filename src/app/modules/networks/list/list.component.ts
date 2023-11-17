import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  CreateRootUserEventType,
  NetworksCreateRootUserModalService,
} from '../create-root-user/create-root-user.modal.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { QueryRef } from 'apollo-angular';
import {
  GetNetworksListGQL,
  GetNetworksListQuery,
  GetNetworksListQueryVariables,
  Tenant,
} from '../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';
import { ToasterService } from '../../../common/services/toaster.service';
import { AutoLoginService } from '../auto-login.service';

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

  // List subject.
  public readonly list$: BehaviorSubject<Tenant[]> = new BehaviorSubject<
    Tenant[]
  >([]);

  private subscriptions: Subscription[] = [];

  readonly cdnAssetsUrl: string;

  /** Query reference for networks list query. */
  private getNetworksListQuery: QueryRef<
    GetNetworksListQuery,
    GetNetworksListQueryVariables
  >;

  constructor(
    private createRootUserModal: NetworksCreateRootUserModalService,
    private getNetworksListGQL: GetNetworksListGQL,
    private autoLoginService: AutoLoginService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Load list
   */
  private load(): void {
    this.inProgress$.next(true);

    this.getNetworksListQuery = this.getNetworksListGQL.watch({
      first: 120,
      last: 0,
    });

    this.subscriptions.push(
      this.getNetworksListQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetNetworksListQuery>): void => {
          if (result.loading) {
            return;
          }

          this.list$.next(result.data.tenants);
          this.inProgress$.next(false);
        }
      )
    );
  }

  /**
   * Go to the billing details for the clicked network
   */
  clickedManageBilling(network: Tenant): void {
    if (!network.rootUserGuid) {
      return;
    }
    //TODO
  }

  /**
   * Go to the clicked network
   */
  clickedGoToNetwork(network: Tenant): void {
    if (!network.rootUserGuid) {
      return;
    }

    this.autoLoginService.login(network.id);
  }

  /**
   * Open the create network root user modal
   */
  async clickedSetUpNetwork(network: Tenant): Promise<void> {
    if (network.rootUserGuid) {
      return;
    }
    // "Create handle" modal
    const result = await this.createRootUserModal.present(network);

    // Reload the list when user saves their root username
    if (result.type === CreateRootUserEventType.Completed) {
      this.load();
    }
  }
}
