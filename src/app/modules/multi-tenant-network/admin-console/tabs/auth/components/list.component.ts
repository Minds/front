import { Component, Injector, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import {
  DeleteOidcProviderGQL,
  FetchOidcProvidersGQL,
  FetchOidcProvidersQuery,
  FetchOidcProvidersQueryVariables,
  OidcProviderPublic,
} from '../../../../../../../graphql/generated.engine';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ConfirmV2Component } from '../../../../../modals/confirm-v2/confirm.component';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { NetworkAdminConsoleAuthEditComponent } from './edit.component';

@Component({
  selector: 'm-networkAdminConsoleAuth__list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class NetworkAdminConsoleAuthListComponent implements OnInit {
  private oidcProviderGqlQuery: QueryRef<
    FetchOidcProvidersQuery,
    FetchOidcProvidersQueryVariables
  >;

  list$: Observable<any>;

  constructor(
    private oidcProviderGql: FetchOidcProvidersGQL,
    private deleteOidcProviderGql: DeleteOidcProviderGQL,
    private modalService: ModalService,
    private injector: Injector
  ) {
    this.oidcProviderGqlQuery = this.oidcProviderGql.watch(
      {},
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'network-only',
      }
    );
  }

  ngOnInit() {
    this.list$ = this.oidcProviderGqlQuery.valueChanges.pipe(
      map((data) => data.data.oidcProviders)
    );
  }

  onEdit(item: OidcProviderPublic) {
    const modal = this.modalService.present(
      NetworkAdminConsoleAuthEditComponent,
      {
        data: {
          provider: item,
          onDone: async () => {
            modal.dismiss();
            this.oidcProviderGqlQuery.refetch();
          },
        },
        injector: this.injector,
      }
    );
  }

  onDelete(item: OidcProviderPublic) {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Delete SSO Provider',
        body: 'Are you sure you want to delete this provider? This action cannot be undone and users will need to use the forogt password in order to login again.',
        confirmButtonColor: 'red',
        onConfirm: async () => {
          modal.dismiss();

          await firstValueFrom(
            this.deleteOidcProviderGql.mutate({ id: item.id })
          );
          this.oidcProviderGqlQuery.refetch();
        },
      },
      injector: this.injector,
    });
  }
}
