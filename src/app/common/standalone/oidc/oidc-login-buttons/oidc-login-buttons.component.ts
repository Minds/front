import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '../../../common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PermissionsService } from '../../../services/permissions.service';
import {
  FetchOidcProvidersGQL,
  OidcProviderPublic,
} from '../../../../../graphql/generated.engine';
import { firstValueFrom, take } from 'rxjs';

/**
 * Buttons that allow users to create/discover groups
 *
 * See them on the /groups/memberships page, at the
 * top of the list of the groups that you've joined
 */
@Component({
  standalone: true,
  selector: 'm-oidcLoginButtons',
  imports: [CommonModule, NgCommonModule, RouterLink],
  templateUrl: './oidc-login-buttons.component.html',
  styleUrls: ['./oidc-login-buttons.component.ng.scss'],
})
export class OidcLoginButtons {
  providers: OidcProviderPublic[];
  @Output() hasOidcProviders: EventEmitter<boolean> = new EventEmitter();
  hasClickedLoginMethod = false;

  constructor(
    protected permissions: PermissionsService,
    protected fetchOidcProviders: FetchOidcProvidersGQL
  ) {}

  ngOnInit() {
    firstValueFrom(this.fetchOidcProviders.fetch()).then(result => {
      this.providers = result.data.oidcProviders;

      this.hasOidcProviders.emit(this.providers?.length > 0);
    });
  }

  public onLoginClick(e: MouseEvent): void {
    this.hasClickedLoginMethod = true;
  }
}
