import { Injectable, Compiler, Injector } from '@angular/core';
import {
  StackableModalService,
  StackableModalEvent,
  StackableModalState,
} from '../../../services/ux/stackable-modal.service';
import { AuthModalComponent } from './auth-modal.component';
import { Subject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { RedirectHandlerService } from '../param-handlers/redirect-handler.service';
import { ReferrerHandlerService } from '../param-handlers/referrer-handler.service';

@Injectable()
export class AuthModalService {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private session: Session,
    private stackableModal: StackableModalService,
    private redirect: RedirectHandlerService,
    private referrer: ReferrerHandlerService
  ) {
    this.referrer.subscribe(); //unsubs on destroy
  }

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

    const { AuthModalModule } = await import('./auth-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      AuthModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<MindsUser> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(AuthModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        formDisplay: opts.formDisplay,
        onComplete: async (user: MindsUser) => {
          onSuccess$.next(user);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
          this.redirect.handle(opts.formDisplay);
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    // Modal was closed before login completed
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }
}
