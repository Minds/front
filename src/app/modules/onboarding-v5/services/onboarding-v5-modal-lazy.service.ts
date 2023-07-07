import { createNgModule, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { OnboardingV5ModalComponent } from '../modal/onboarding-v5-modal.component';
import { OnboardingV5LazyModule } from '../onboarding-v5-modal-lazy.module';

/**
 * Service for opening the onboarding v5 modal and lazy loading in needed components..
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5ModalLazyService {
  constructor(private modalService: ModalService, private injector: Injector) {}

  /**
   * Open the onboarding V5 modal.
   * @returns { Promise<ModalRef<OnboardingV5ModalComponent>> } - modal reference.
   */
  public async open(): Promise<ModalRef<OnboardingV5ModalComponent>> {
    const componentRef: typeof OnboardingV5ModalComponent = await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      data: {
        onDismissIntent: () => {
          modal.close();
        },
      },
      fullscreen: true,
      modalDialogClass: 'm-theme--wrapper m-theme--wrapper__dark',
    });
    return modal;
  }

  /**
   * Gets component reference to be used as lazy-loaded modal base from module.
   * @returns { Promise<typeof OnboardingV5ModalComponent> } component reference.
   */
  private async getComponentRef(): Promise<typeof OnboardingV5ModalComponent> {
    return createNgModule<OnboardingV5LazyModule>(
      (await import('../onboarding-v5-modal-lazy.module'))
        .OnboardingV5LazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
