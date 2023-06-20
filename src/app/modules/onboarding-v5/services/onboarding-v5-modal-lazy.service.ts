import { createNgModule, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { OnboardingV5ModalComponent } from '../modal/onboarding-v5-modal.component';
import { OnboardingV5LazyModule } from '../onboarding-v5-modal-lazy.module';

@Injectable({ providedIn: 'root' })
export class OnboardingV5ModalLazyService {
  constructor(private modalService: ModalService, private injector: Injector) {}

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

  private async getComponentRef(): Promise<typeof OnboardingV5ModalComponent> {
    return createNgModule<OnboardingV5LazyModule>(
      (await import('../onboarding-v5-modal-lazy.module'))
        .OnboardingV5LazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
