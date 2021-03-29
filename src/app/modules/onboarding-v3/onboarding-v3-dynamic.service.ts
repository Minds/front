import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';
import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';
import { OnboardingStepName } from './onboarding-v3.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingV3DynamicService {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService
  ) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<any> }
   */
  public async open(): Promise<any> {
    const { OnboardingV3ProgressLazyModule } = await import(
      './onboarding.lazy.module'
    );

    const moduleFactory = await this.compiler.compileModuleAsync(
      OnboardingV3ProgressLazyModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(OnboardingV3ModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        dismissOnRouteChange: false,
        onSaveIntent: (step: OnboardingStepName) => {},
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    // Modal was closed.
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }

  /**
   * Present initial modals to be shown before navigation
   * to newsfeed.
   * @returns { Promise<void> } - awaitable.
   */
  public async presentHomepageModals(): Promise<void> {
    try {
      await this.open();
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }
}
