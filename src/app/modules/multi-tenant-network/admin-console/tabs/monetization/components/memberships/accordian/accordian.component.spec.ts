import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminMonetizationMembershipAccordianComponent } from './accordian.component';
import { MockComponent, MockService } from '../../../../../../../../utils/mock';
import { ModalService } from '../../../../../../../../services/ux/modal.service';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { ArchiveSiteMembershipGQL } from '../../../../../../../../../graphql/generated.engine';
import { MultiTenantRolesService } from '../../../../../../services/roles.service';
import { siteMembershipMock } from '../../../../../../../../mocks/site-membership.mock';
import { RoleId } from '../../../../roles/roles.types';
import { ConfirmV2Component } from '../../../../../../../modals/confirm-v2/confirm.component';
import { of } from 'rxjs';
import { SiteMembershipsCountService } from '../../../../../../../site-memberships/services/site-membership-count.service';

describe('NetworkAdminMonetizationMembershipAccordianComponent', () => {
  let comp: NetworkAdminMonetizationMembershipAccordianComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationMembershipAccordianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminMonetizationMembershipAccordianComponent,
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
        MockComponent({
          selector: 'm-networkAdminConsoleRole__icon',
          inputs: ['roleId', 'scale'],
        }),
        MockComponent({
          selector: 'm-networkAdminMonetization__groupsList',
          inputs: ['groups', 'showDeleteButton'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService),
        },
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: ArchiveSiteMembershipGQL,
          useValue: jasmine.createSpyObj<ArchiveSiteMembershipGQL>(['mutate']),
        },
        {
          provide: SiteMembershipsCountService,
          useValue: MockService(SiteMembershipsCountService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: Injector,
          useValue: MockService(Injector),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminMonetizationMembershipAccordianComponent
    );
    comp = fixture.componentInstance;
    comp.membership = siteMembershipMock;
    (comp as any).archiveSiteMembershipGQL.mutate.calls.reset();
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    comp.expanded$.next(false);
    comp.toggleExpandedState();
    expect(comp.expanded$.getValue()).toBe(true);
    comp.toggleExpandedState();
    expect(comp.expanded$.getValue()).toBe(false);
  });

  it('should return role icon', () => {
    (comp as any).rolesService.getIconByRoleId.and.returnValue('admin');
    const roleIcon = comp.getRoleIconByRoleId(RoleId.ADMIN);
    expect(roleIcon).toBe('admin');
  });

  it('should return role label', () => {
    (comp as any).rolesService.getLabelByRoleId.and.returnValue('Admin');
    const roleLabel = comp.getRoleLabelByRoleId(RoleId.ADMIN);
    expect(roleLabel).toBe('Admin');
  });

  describe('onArchiveClick', () => {
    it('should handle archive click', () => {
      comp.onArchiveClick(siteMembershipMock);
      expect((comp as any).modalService.present).toHaveBeenCalledWith(
        ConfirmV2Component,
        {
          data: {
            title: 'Archive Membership',
            body: jasmine.any(String),
            confirmButtonText: 'Archive',
            confirmButtonColor: 'red',
            confirmButtonSolid: false,
            showCancelButton: false,
            onConfirm: jasmine.any(Function),
          },
          injector: (comp as any).injector,
        }
      );
    });

    it('should handle archive', fakeAsync(() => {
      (comp as any).archiveSiteMembershipGQL.mutate.and.returnValue(
        of({
          data: {
            archiveSiteMembership: true,
          },
        })
      );

      (comp as any).archiveMembership(siteMembershipMock);
      tick();

      expect(
        (comp as any).archiveSiteMembershipGQL.mutate
      ).toHaveBeenCalledWith(
        {
          siteMembershipGuid: siteMembershipMock.membershipGuid,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Successfully archived membership.'
      );
      expect(
        (comp as any).membershipCountService.decrementMembershipCount
      ).toHaveBeenCalled();
    }));
  });

  it('should handle edit click', () => {
    comp.onEditClick(siteMembershipMock);
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/network/admin/monetization/memberships/edit/' +
        siteMembershipMock.membershipGuid
    );
  });

  describe('handleArchiveSuccess', () => {
    it('should handle archive success', () => {
      const cache = {
        identify: jasmine.createSpy('identify'),
        evict: jasmine.createSpy('evict'),
        gc: jasmine.createSpy('gc'),
      };

      (comp as any).handleArchiveSuccess(
        cache,
        {
          data: {
            archiveSiteMembership: true,
          },
        },
        {
          variables: {
            siteMembershipGuid: siteMembershipMock.membershipGuid,
          },
        }
      );

      expect(cache.identify).toHaveBeenCalledWith({
        __typename: 'SiteMembership',
        id: siteMembershipMock.membershipGuid,
      });
      expect(cache.evict).toHaveBeenCalled();
      expect(cache.gc).toHaveBeenCalled();
    });
  });
});
