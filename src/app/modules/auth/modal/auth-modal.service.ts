import { Injectable, Injector } from '@angular/core';
import { AuthModalComponent } from './auth-modal.component';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class AuthModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private session: Session
  ) {}

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

    const { AuthModalModule } = await import('./auth-modal.module');

    const modal = this.modalService.present(AuthModalComponent, {
      data: {
        formDisplay: opts.formDisplay,
        onComplete: async (user: MindsUser) => {
          modal.close(user);
        },
      },
      keyboard: false,
      injector: this.injector,
      lazyModule: AuthModalModule,
    });

    return modal.result;
  }
}
