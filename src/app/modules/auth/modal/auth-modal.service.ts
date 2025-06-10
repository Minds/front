import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { AuthForm, AuthModalComponent } from './auth-modal.component';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  onLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  onRegistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private session: Session,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Standalone pages are at /login and /register. Setting standalonePage to true will set the
   * back button location to the guest mode landing page
   */
  async open(
    opts: {
      formDisplay: AuthForm;
      standalonePage?: boolean;
      inviteToken?: string;
    } = {
      formDisplay: 'login',
      standalonePage: false,
      inviteToken: null,
    }
  ): Promise<MindsUser> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }
    this.onLoggedIn$.next(false);
    this.onRegistered$.next(false);

    const { AuthModalModule } = await import('./auth-modal.module');

    const modal = this.modalService.present(AuthModalComponent, {
      data: {
        formDisplay: opts.formDisplay,
        standalonePage: opts.standalonePage,
        inviteToken: opts.inviteToken,
        onLoggedIn: () => {
          this.onLoggedIn$.next(true);
        },
        onRegistered: () => {
          this.onRegistered$.next(true);
        },
        onComplete: async (user: MindsUser) => {
          modal.close(user);
        },
      },
      fullscreen: true,
      keyboard: false,
      injector: this.injector,
      lazyModule: AuthModalModule,
    });

    return modal.result;
  }
}
