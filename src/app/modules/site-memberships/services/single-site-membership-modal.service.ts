import { Injectable, Injector, createNgModule } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { SiteMembershipsPageComponent } from '../components/memberships-page/site-memberships-page.component';
import { SingleSiteMembershipModalComponent } from '../components/single-site-membership-modal/single-site-membership-modal.component';
import { SiteMembershipsLazyModule } from '../site-memberships-lazy.module';

/** Options for the single site membership modal. */
export type SingleSiteMembershipModalOptions = {
  title: string;
  subtitle: string;
  closeCtaText: string;
  upgradeMode: boolean;
  membershipGuid: string;
};

/**
 * Service that loads and presents the single site membership modal.
 */
@Injectable({ providedIn: 'root' })
export class SingleSiteMembershipModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector,
    private isTenant: IsTenantService
  ) {}

  /**
   * Presents the modal.
   * @param { SingleSiteMembershipModalOptions } opts - Options for the modal.
   * @returns { Promise<ModalRef<SiteMembershipsPageComponent>> }
   */
  public async open(
    opts: SingleSiteMembershipModalOptions
  ): Promise<ModalRef<SiteMembershipsPageComponent>> {
    // Only show on tenant sites.
    if (!this.isTenant.is()) {
      return;
    }

    const modal = this.modalService.present(await this.getComponentRef(), {
      data: {
        title: opts.title,
        subtitle: opts.subtitle,
        closeCtaText: opts.closeCtaText,
        membershipGuid: opts.membershipGuid,
        upgradeMode: opts.upgradeMode,
        onJoinIntent: () => {
          modal.dismiss();
        },
        onCloseIntent: () => {
          modal.dismiss();
        },
      },
      injector: this.injector,
      size: 'lg',
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof SingleSiteMembershipModalComponent> }
   */
  private async getComponentRef(): Promise<
    typeof SingleSiteMembershipModalComponent
  > {
    return createNgModule<SiteMembershipsLazyModule>(
      (await import('../site-memberships-lazy.module'))
        .SiteMembershipsLazyModule,
      this.injector
    ).instance.resolveSingleSiteMembershipsModalComponent();
  }
}
