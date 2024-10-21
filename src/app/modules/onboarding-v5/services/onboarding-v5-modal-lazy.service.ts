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
import { OnboardingV5MinimalModeService } from './onboarding-v5-minimal-mode.service';
import { SiteMembershipsPageModal } from '../../site-memberships/services/site-memberships-page-modal.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Service for opening the onboarding v5 modal and lazy loading in needed components..
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5ModalLazyService {
  /**
   * The current url when the modal was opened
   */
  urlOnOpen: string;

  /**
   * Whether the current page was reached by redirect after a site membership purchase
   */
  membershipCheckoutRedirect = false;

  constructor(
    private modalService: ModalService,
    private onboardingMinimalMode: OnboardingV5MinimalModeService,
    private injector: Injector,
    private upgradeModal: UpgradeModalService,
    private siteMembershipsPageModal: SiteMembershipsPageModal,
    private router: Router,
    private configs: ConfigsService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Check for membershipCheckoutRedirect queryParam
        const url = this.router.url;
        const queryParamsIndex = url.indexOf('?');
        if (queryParamsIndex >= 0) {
          const queryParamsString = url.substring(queryParamsIndex + 1);
          const queryParams = new URLSearchParams(queryParamsString);
          this.membershipCheckoutRedirect =
            queryParams.get('membershipCheckoutRedirect') === 'true';
        } else {
          this.membershipCheckoutRedirect = false;
        }
      });
  }

  /**
   * Open the onboarding V5 modal.
   * @returns { Promise<ModalRef<OnboardingV5ModalComponent>> } - modal reference.
   */
  public async open(): Promise<ModalRef<OnboardingV5ModalComponent>> {
    this.urlOnOpen = this.router.url;
    const componentRef: typeof OnboardingV5ModalComponent =
      await this.getComponentRef();
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
   * Present upgrade modal (or site membership modal, for tenants)
   * to users who just finished onboarding
   */
  private async openUpgradeModal() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.onboardingMinimalMode.shouldShow()) {
        setTimeout(() => this.upgradeModal.open(), 800);
      } else if (this.isTenantNetwork) {
        const shouldShowMembershipGate: boolean =
          this.configs.get('tenant')?.['should_show_membership_gate'] ?? false;

        // Don't open the modal if user onboarded from a
        // membership join page
        if (
          !shouldShowMembershipGate &&
          (this.urlOnOpen.startsWith('/memberships/join') ||
            this.membershipCheckoutRedirect)
        ) {
          return;
        }

        setTimeout(
          () =>
            this.siteMembershipsPageModal.open({
              showDismissActions: !shouldShowMembershipGate,
            }),
          800
        );
      }
    }
  }
}
