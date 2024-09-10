import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import {
  ArchiveSiteMembershipGQL,
  ArchiveSiteMembershipMutation,
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../../../../../../../../graphql/generated.engine';
import { GrowShrinkFast } from '../../../../../../../../animations';
import { MultiTenantRolesService } from '../../../../../../services/roles.service';
import { RoleId } from '../../../../roles/roles.types';
import {
  ModalRef,
  ModalService,
} from '../../../../../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../../../../../modals/confirm-v2/confirm.component';
import { MutationResult } from 'apollo-angular';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { SiteMembershipsCountService } from '../../../../../../../site-memberships/services/site-membership-count.service';
import { InMemoryCache } from '@apollo/client';

/**
 * Network admin monetization membership accordian. Used to display a quick
 * summary of a membership, with action buttons to edit and archive it.
 */
@Component({
  selector: 'm-networkAdminMonetization__membershipAccordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.ng.scss'],
  animations: [GrowShrinkFast],
})
export class NetworkAdminMonetizationMembershipAccordianComponent {
  /** Enum for use in template. */
  public readonly SiteMembershipBillingPeriodEnum: typeof SiteMembershipBillingPeriodEnum =
    SiteMembershipBillingPeriodEnum;

  /** Enum for use in template. */
  public readonly SiteMembershipPricingModelEnum: typeof SiteMembershipPricingModelEnum =
    SiteMembershipPricingModelEnum;

  /** Membership to display. */
  @Input() public membership: SiteMembership;

  /** Fires on archive. */
  @Output('onArchive') private onArchiveEmitter: EventEmitter<string> =
    new EventEmitter<string>();

  /** Whether or not the accordian is expanded. */
  public readonly expanded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether or not an archiving operation is in progress. */
  public readonly archiveInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private rolesService: MultiTenantRolesService,
    private modalService: ModalService,
    private archiveSiteMembershipGQL: ArchiveSiteMembershipGQL,
    private membershipCountService: SiteMembershipsCountService,
    private toaster: ToasterService,
    private router: Router,
    private injector: Injector
  ) {}

  /**
   * Toggle expanded state of the component.
   * @returns { void }
   */
  public toggleExpandedState(): void {
    this.expanded$.next(!Boolean(this.expanded$.getValue()));
  }

  /**
   * Gets the role icon for a given role id.
   * @param { RoleId } roleId - Role id to get icon for.
   * @returns { string } - Icon name.
   */
  public getRoleIconByRoleId(roleId: RoleId): string {
    return this.rolesService.getIconByRoleId(roleId);
  }

  /**
   * Gets the role label for a given role id.
   * @param { RoleId } roleId - Role id to get label for.
   * @returns { string } - Label name.
   */
  public getRoleLabelByRoleId(roleId: RoleId): string {
    return this.rolesService.getLabelByRoleId(roleId);
  }

  /**
   * Handle clicks on Archive button for a given membership.
   * @param { SiteMembership } membership - Membership to archive.
   * @returns { void }
   */
  public onArchiveClick(membership: SiteMembership): void {
    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Archive Membership',
          body: `
          Are you sure you want to archive this membership option?
          
          **Note:** Archiving a membership removes it from the memberships screen. However, current membership holders are still on the archived membership. To delete a membership, edit it from your Stripe page.
        `,
          confirmButtonText: 'Archive',
          confirmButtonColor: 'red',
          confirmButtonSolid: false,
          showCancelButton: false,
          onConfirm: () => {
            modalRef.close();
            this.archiveMembership(membership);
          },
        },
        injector: this.injector,
      }
    );
  }

  /**
   * Handle clicks on Edit button for a given membership.
   * @param { SiteMembership } membership - Membership to edit.
   */
  public onEditClick(membership: SiteMembership): void {
    this.router.navigateByUrl(
      '/network/admin/monetization/memberships/edit/' +
        membership.membershipGuid
    );
  }

  /**
   * Archive a given membership.
   * @param { SiteMembership } membership - Membership to archive.
   * @returns { Promise<void> }
   */
  private async archiveMembership(membership: SiteMembership): Promise<void> {
    this.archiveInProgress$.next(true);
    try {
      const response: MutationResult<ArchiveSiteMembershipMutation> =
        await lastValueFrom(
          this.archiveSiteMembershipGQL.mutate(
            {
              siteMembershipGuid: membership.membershipGuid,
            },
            {
              update: this.handleArchiveSuccess.bind(this),
            }
          )
        );

      if (!Boolean(response.data?.archiveSiteMembership)) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      this.membershipCountService.decrementMembershipCount();
      this.toaster.success('Successfully archived membership.');
      this.onArchiveEmitter.emit(membership.membershipGuid);
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
      return;
    } finally {
      this.archiveInProgress$.next(false);
    }
  }

  /**
   * Handle cache updates on success.
   * @param { InMemoryCache } cache - the in memory cache.
   * @param { MutationResult<UpdateChatRoomNameMutation> } result - the mutation result.
   * @param { any } options - the options.
   */
  private handleArchiveSuccess(
    cache: InMemoryCache,
    result: MutationResult<ArchiveSiteMembershipMutation>,
    options: any
  ): void {
    const id = cache.identify({
      __typename: 'SiteMembership',
      id: options.variables.siteMembershipGuid,
    });
    cache.evict({ id });
    cache.gc();
  }
}
