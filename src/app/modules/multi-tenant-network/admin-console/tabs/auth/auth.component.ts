import { Component, Injector, OnInit } from '@angular/core';
import {
  ModalRef,
  ModalService,
} from '../../../../../services/ux/modal.service';
import { NetworkAdminConsoleAuthEditComponent } from './components/edit.component';
import { FetchOidcProvidersGQL } from '../../../../../../graphql/generated.engine';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'm-networkAdminConsole__auth',
  templateUrl: './auth.component.html',
  styleUrls: [
    './auth.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleAuthComponent implements OnInit {
  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private oidcProvidersGql: FetchOidcProvidersGQL
  ) {}

  ngOnInit() {}

  newProvider() {
    const modal = this.modalService.present(
      NetworkAdminConsoleAuthEditComponent,
      {
        data: {
          onDone: async () => {
            modal.dismiss();

            await firstValueFrom(
              this.oidcProvidersGql.fetch({}, { fetchPolicy: 'network-only' })
            );
          },
        },
        injector: this.injector,
      }
    );
  }
}
