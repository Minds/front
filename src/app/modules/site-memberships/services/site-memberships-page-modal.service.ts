import { Injectable, Injector, createNgModuleRef } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { SiteMembershipsPageComponent } from '../components/memberships-page/site-memberships-page.component';
import { SiteMembershipService } from './site-memberships.service';
import { filter, firstValueFrom } from 'rxjs';
import {
  SiteMembership,
  SiteMembershipSubscription,
} from '../../../../graphql/generated.engine';

/** Modal options. */
type SiteMembershipsPageModalOpts = {
  showWhenMember?: boolean;
};
/**
 * Service that loads and presents
 * the site memberships page component as a modal
 *
 * e.g. to be shown after tenant user registration
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipsPageModal {
  constructor(
    protected modalService: ModalService,
    private injector: Injector,
    private isTenant: IsTenantService,
    private siteMembershipsService: SiteMembershipService
  ) {}

  /**
   * Presents the modal.
   * @param { SiteMembershipsPageModalOpts } opts - Options for the modal.
   * @returns { Promise<ModalRef<SiteMembershipsPageComponent>> }
   */
  public async open(
    opts: SiteMembershipsPageModalOpts = {}
  ): Promise<ModalRef<SiteMembershipsPageComponent>> {
    // Only show on tenant sites
    if (!this.isTenant.is()) {
      return;
    }
    const { SiteMembershipsLazyModule } = await import(
      '../site-memberships-lazy.module'
    );

    const moduleRef = createNgModuleRef(
      SiteMembershipsLazyModule,
      this.injector
    );

    const siteMembershipsPageComponent =
      moduleRef.instance.resolveSiteMembershipsPageComponent();

    this.siteMembershipsService.fetch(true);

    // Prefetch memberships to check whether we should show the modal.
    await firstValueFrom(
      this.siteMembershipsService.initialized$.pipe(filter(Boolean))
    );
    const siteMemberships: SiteMembership[] = await firstValueFrom(
      this.siteMembershipsService.siteMemberships$
    );

    // Skip initializing in the modal component if there are no memberships.
    if (!siteMemberships.length) {
      return;
    }

    if (!opts?.showWhenMember) {
      const siteMembershipSubscriptions: SiteMembershipSubscription[] =
        await firstValueFrom(
          this.siteMembershipsService.siteMembershipSubscriptions$
        );

      // Skip opening in the modal component if a user is already has a membership.
      if (siteMembershipSubscriptions?.length) {
        return;
      }
    }

    const modal = this.modalService.present(siteMembershipsPageComponent, {
      data: {
        isModal: true,
        onJoinClick: () => {
          this.dismiss();
        },
        skipInitialFetch: true,
      },
      injector: this.injector,
      size: 'lg',
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal;
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}
