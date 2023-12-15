import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { OnboardingV5ModalComponent } from '../modal/onboarding-v5-modal.component';
import { OnboardingV5LazyModule } from '../onboarding-v5-modal-lazy.module';
import { isPlatformBrowser } from '@angular/common';
import { UpgradeModalService } from '../../upgrade/upgrade-modal.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

/**
 * Service for opening the onboarding v5 modal and lazy loading in needed components..
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5ModalLazyService {
  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private upgradeModal: UpgradeModalService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Open the onboarding V5 modal.
   * @returns { Promise<ModalRef<OnboardingV5ModalComponent>> } - modal reference.
   */
  public async open(): Promise<ModalRef<OnboardingV5ModalComponent>> {
    const componentRef: typeof OnboardingV5ModalComponent = await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      data: {
        onComplete: () => {
          this.openUpgradeModal();
        },
        onDismissIntention: () => {
          modal.close();
        },
      },
      fullscreen: true,
      modalDialogClass: !this.isTenantNetwork
        ? 'm-theme--wrapper m-theme--wrapper__dark'
        : '',
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

  /**
   * Present upgrade modal to users
   * who just finished onboarding
   */
  private async openUpgradeModal() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.upgradeModal.open(), 800);
    }
  }
}
