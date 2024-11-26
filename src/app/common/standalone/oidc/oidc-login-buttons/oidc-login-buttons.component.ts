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
import { ConfigsService } from '../../../services/configs.service';
import { UserAvatarService } from '../../../services/user-avatar.service';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';

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
  providers: Partial<OidcProviderPublic>[];
  @Output() hasOidcProviders: EventEmitter<boolean> = new EventEmitter();
  @Output('done') onDone: EventEmitter<MindsUser> = new EventEmitter();
  hasClickedLoginMethod = false;
  windowPoller;

  constructor(
    protected permissions: PermissionsService,
    protected fetchOidcProviders: FetchOidcProvidersGQL,
    protected configs: ConfigsService,
    protected userAvatarService: UserAvatarService,
    protected session: Session
  ) {}

  ngOnInit() {
    firstValueFrom(this.fetchOidcProviders.fetch())
      .then((result) => {
        this.providers = result.data.oidcProviders;
        this.hasOidcProviders.emit(this.providers?.length > 0);
      })
      .catch((e: unknown) => {
        console.error(e);
        this.hasOidcProviders.emit(false);
      });
  }

  ngOnDestroy() {
    if (this.windowPoller) {
      clearInterval(this.windowPoller);
    }
  }

  public async onLoginClick(e: MouseEvent, loginUrl: string): Promise<void> {
    e.preventDefault();
    this.hasClickedLoginMethod = true;

    if (this.windowPoller) clearInterval(this.windowPoller);

    const ref = window.open(loginUrl, '_blank');

    if (ref) {
      this.windowPoller = setInterval(async () => {
        if (ref.closed && document.hasFocus()) {
          // Stop polling
          clearInterval(this.windowPoller);

          // Was login successful? Refetch configs.
          await this.configs.loadFromRemote();

          const user = this.configs.get('user');

          if (user) {
            // Update avatar
            this.userAvatarService.init();

            // Update permissions
            this.permissions.initFromConfigs();

            const user: MindsUser = this.configs.get('user');
            // Update session
            this.session.login(user);

            // Tell the parent we are done
            this.onDone.emit(user);
          }

          this.hasClickedLoginMethod = false;
        }
      }, 500);
    }
  }
}
