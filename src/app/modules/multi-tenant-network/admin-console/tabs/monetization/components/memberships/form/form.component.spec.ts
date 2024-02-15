import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminMonetizationMembershipFormComponent } from './form.component';
import { MockComponent, MockService } from '../../../../../../../../utils/mock';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiTenantRolesService } from '../../../../../../services/roles.service';
import {
  GetSiteMembershipGQL,
  Role,
  SetSiteMembershipGQL,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
  UpdateSiteMembershipGQL,
} from '../../../../../../../../../graphql/generated.engine';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../../../common/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { MockAutocompleteEntityInputComponent } from '../../../../general/featured/add-user-modal/add-featured-entity-modal.component.spec';
import { MockFormInputCheckboxComponent } from '../../../../../../../../common/components/forms/checkbox/checkbox.component.mock';
import { siteMembershipMock } from '../../../../../../../../mocks/site-membership.mock';
import { groupMock } from '../../../../../../../../mocks/responses/group.mock';
import { MindsGroup } from '../../../../../../../groups/v2/group.model';
import { SiteMembershipsCountService } from '../../../../../../../site-memberships/services/site-membership-count.service';

describe('NetworkAdminMonetizationMembershipFormComponent', () => {
  let comp: NetworkAdminMonetizationMembershipFormComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationMembershipFormComponent>;

  const rolesMock: Role[] = [
    { name: 'OWNER', id: 0, permissions: [] },
    { name: 'ADMIN', id: 1, permissions: [] },
    { name: 'MODERATOR', id: 2, permissions: [] },
    { name: 'VERIFIED', id: 3, permissions: [] },
    { name: 'DEFAULT', id: 4, permissions: [] },
  ];

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        NetworkAdminMonetizationMembershipFormComponent,
        MockComponent({
          selector: 'm-formError',
          inputs: ['error'],
        }),
        MockComponent({
          selector: 'm-networkAdminConsoleRole__icon',
          inputs: ['roleId', 'scale'],
        }),
        MockFormInputCheckboxComponent,
        MockAutocompleteEntityInputComponent,
        MockComponent({
          selector: 'm-networkAdminMonetization__groupsList',
          inputs: ['groups', 'showDeleteButton'],
          outputs: ['onDeleteClick'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        FormBuilder,
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService, {
            has: ['allRoles$'],
            props: {
              allRoles$: { get: () => new BehaviorSubject<Role[]>(rolesMock) },
            },
          }),
        },
        {
          provide: GetSiteMembershipGQL,
          useValue: jasmine.createSpyObj<GetSiteMembershipGQL>(['fetch']),
        },
        {
          provide: SetSiteMembershipGQL,
          useValue: jasmine.createSpyObj<SetSiteMembershipGQL>(['mutate']),
        },
        {
          provide: UpdateSiteMembershipGQL,
          useValue: jasmine.createSpyObj<UpdateSiteMembershipGQL>(['mutate']),
        },
        {
          provide: SiteMembershipsCountService,
          useValue: MockService(SiteMembershipsCountService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    data: { editMode: false },
                    params: { guid: null },
                  };
                },
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminMonetizationMembershipFormComponent
    );
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init in create mode', fakeAsync(() => {
    tick();

    expect(comp).toBeTruthy();

    expect(comp.editMode).toBeFalsy();
    expect(comp.formGroup).toBeTruthy();

    // check dynamic form controls exist.
    expect(comp.formGroup.get(`user_role:ADMIN`)).toBeTruthy();
    expect(comp.formGroup.get(`user_role:MODERATOR`)).toBeTruthy();
    expect(comp.formGroup.get(`user_role:VERIFIED`)).toBeTruthy();

    // default values.
    expect(comp.nameFormControl.value).toBe('');
    expect(comp.descriptionFormControl.value).toBe('');
    expect(comp.currentGroupSelectionFormControl.value).toBe(null);
    expect(comp.priceFormControl.value).toBe(9.99);
    expect(comp.pricingModelFormControl.value).toBe(
      SiteMembershipPricingModelEnum.Recurring
    );
    expect(comp.billingPeriodFormControl.value).toBe(
      SiteMembershipBillingPeriodEnum.Monthly
    );
    expect(comp.selectedGroups$.getValue()?.length).toBe(0);
    expect(comp.formGroup.get(`user_role:ADMIN`).value).toBeFalse();
    expect(comp.formGroup.get(`user_role:MODERATOR`).value).toBeFalse();
    expect(comp.formGroup.get(`user_role:VERIFIED`).value).toBeFalse();

    // enabled states.
    expect(comp.nameFormControl.enabled).toBeTrue();
    expect(comp.descriptionFormControl.enabled).toBeTrue();
    expect(comp.currentGroupSelectionFormControl.enabled).toBeTrue();
    expect(comp.priceFormControl.enabled).toBeTrue();
    expect(comp.pricingModelFormControl.enabled).toBeTrue();
    expect(comp.billingPeriodFormControl.enabled).toBeTrue();

    // form initial state.
    expect(comp.formGroup.pristine).toBeTrue();
    expect(comp.formGroup.touched).toBeFalse();
    expect(comp.formGroup.invalid).toBe(true);
  }));

  it('should init in edit mode', fakeAsync(() => {
    const membershipGuid: string = '123';
    (comp as any).route.snapshot.data = { editMode: true };
    (comp as any).route.snapshot.params = { guid: membershipGuid };
    comp.formGroup = null;

    (comp as any).getSiteMembershipGQL.fetch.and.returnValue(
      of({
        data: {
          siteMembership: siteMembershipMock,
        },
      })
    );

    comp.ngOnInit();
    tick();

    expect(comp).toBeTruthy();

    expect(comp.editMode).toBeTrue();
    expect(comp.formGroup).toBeTruthy();

    // check dynamic form controls exist.
    expect(comp.formGroup.get(`user_role:ADMIN`)).toBeTruthy();
    expect(comp.formGroup.get(`user_role:MODERATOR`)).toBeTruthy();
    expect(comp.formGroup.get(`user_role:VERIFIED`)).toBeTruthy();

    // default values.
    expect(comp.nameFormControl.value).toBe(siteMembershipMock.membershipName);
    expect(comp.descriptionFormControl.value).toBe(
      siteMembershipMock.membershipDescription
    );
    expect(comp.currentGroupSelectionFormControl.value).toBe(null);
    expect(comp.priceFormControl.value).toBe(
      siteMembershipMock.membershipPriceInCents / 100
    );
    expect(comp.pricingModelFormControl.value).toBe(
      siteMembershipMock.membershipPricingModel
    );
    expect(comp.billingPeriodFormControl.value).toBe(
      siteMembershipMock.membershipBillingPeriod
    );
    expect(comp.selectedGroups$.getValue()?.length).toBe(
      siteMembershipMock.groups.length
    );
    expect(comp.formGroup.get(`user_role:ADMIN`).value).toBeFalse();
    expect(comp.formGroup.get(`user_role:MODERATOR`).value).toBeTrue();
    expect(comp.formGroup.get(`user_role:VERIFIED`).value).toBeTrue();

    // enabled states.
    expect(comp.nameFormControl.enabled).toBeTrue();
    expect(comp.descriptionFormControl.enabled).toBeTrue();
    expect(comp.currentGroupSelectionFormControl.enabled).toBeTrue();
    expect(comp.priceFormControl.enabled).toBeFalse();
    expect(comp.pricingModelFormControl.enabled).toBeFalse();
    expect(comp.billingPeriodFormControl.enabled).toBeFalse();

    // form initial state.
    expect(comp.formGroup.pristine).toBeTrue();
    expect(comp.formGroup.touched).toBeFalse();
    expect(comp.formGroup.invalid).toBe(false);
  }));

  it('should get role label by id', () => {
    (comp as any).rolesService.getLabelByRoleId.and.returnValue('Owner');
    expect(comp.getRoleLabelByRoleId(0)).toBe('Owner');
  });

  it('should get role icon by id', () => {
    (comp as any).rolesService.getIconByRoleId.and.returnValue('diamond');
    expect(comp.getRoleIconByRoleId(0)).toBe('diamond');
  });

  it('should handle role toggle', () => {
    comp.formGroup.get(`user_role:ADMIN`).setValue(true);
    expect(comp.formGroup.get(`user_role:ADMIN`).value).toBeTrue();
    comp.formGroup.get(`user_role:ADMIN`).setValue(false);
    expect(comp.formGroup.get(`user_role:ADMIN`).value).toBeFalse();
  });

  describe('onRadioButtonContainerClick', () => {
    it('should handle radio button container click', () => {
      comp.pricingModelFormControl.setValue(
        SiteMembershipPricingModelEnum.Recurring
      );
      comp.editMode = false;
      comp.pricingModelFormControl.markAsPristine();

      comp.onRadioButtonContainerClick(SiteMembershipPricingModelEnum.OneTime);

      expect(comp.pricingModelFormControl.value).toBe(
        SiteMembershipPricingModelEnum.OneTime
      );
      expect(comp.pricingModelFormControl.dirty).toBe(true);
    });

    it('should NOT handle radio button container click in edit mode', () => {
      comp.pricingModelFormControl.setValue(
        SiteMembershipPricingModelEnum.Recurring
      );
      comp.editMode = true;
      comp.pricingModelFormControl.markAsPristine();

      comp.onRadioButtonContainerClick(SiteMembershipPricingModelEnum.OneTime);

      expect(comp.pricingModelFormControl.value).toBe(
        SiteMembershipPricingModelEnum.Recurring
      );
      expect(comp.pricingModelFormControl.dirty).toBe(false);
    });
  });

  describe('removeGroup', () => {
    it('should handle group delete click', () => {
      const group: MindsGroup = groupMock;
      const group2: MindsGroup = { ...group, guid: '234' };
      comp.selectedGroups$.next([group, group2]);
      comp.formGroup.markAsPristine();
      comp.formGroup.markAsUntouched();

      comp.removeGroup(group);

      expect(comp.selectedGroups$.getValue()).toEqual([group2]);
      expect(comp.formGroup.dirty).toBeTrue();
      expect(comp.formGroup.touched).toBeTrue();
    });

    it('should handle group delete click, not deleting a group that is not in the array', () => {
      const group: MindsGroup = groupMock;
      const group2: MindsGroup = { ...group, guid: '234' };
      comp.selectedGroups$.next([group2]);
      comp.formGroup.markAsPristine();
      comp.formGroup.markAsUntouched();

      comp.removeGroup(group);

      expect(comp.selectedGroups$.getValue()).toEqual([group2]);
      expect(comp.formGroup.dirty).toBeTrue();
      expect(comp.formGroup.touched).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('it should handle create submission', fakeAsync(() => {
      comp.editMode = false;

      const name: string = 'name';
      const description: string = 'description';
      const price: number = 19.99;
      const pricingModel: SiteMembershipPricingModelEnum =
        SiteMembershipPricingModelEnum.OneTime;
      const billingPeriod: SiteMembershipBillingPeriodEnum =
        SiteMembershipBillingPeriodEnum.Yearly;
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.pricingModelFormControl.setValue(pricingModel);
      comp.priceFormControl.setValue(price);
      comp.billingPeriodFormControl.setValue(billingPeriod);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);

      (comp as any).setSiteMembershipGQL.mutate.and.returnValue(
        of({
          data: {
            siteMembership: {
              guid: '123',
            },
          },
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).setSiteMembershipGQL.mutate).toHaveBeenCalledWith({
        membershipName: name,
        membershipDescription: description,
        membershipPricingModel: pricingModel,
        membershipPriceInCents: 1999,
        membershipBillingPeriod: billingPeriod,
        groups: groups.map(group => group.guid),
        roles: [2, 3],
      });
      expect(comp.formGroup.pristine).toBeTrue();
      expect(comp.formGroup.touched).toBeFalse();
      expect(comp.formGroup.invalid).toBe(false);
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Membership successfully saved'
      );
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/network/admin/monetization/memberships'
      );
      expect(
        (comp as any).membershipCountService.incrementMembershipCount
      ).toHaveBeenCalled();
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
    }));

    it('it should handle graphql error creating submission', fakeAsync(() => {
      comp.editMode = false;

      const name: string = 'name';
      const description: string = 'description';
      const price: number = 19.99;
      const pricingModel: SiteMembershipPricingModelEnum =
        SiteMembershipPricingModelEnum.OneTime;
      const billingPeriod: SiteMembershipBillingPeriodEnum =
        SiteMembershipBillingPeriodEnum.Yearly;
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.pricingModelFormControl.setValue(pricingModel);
      comp.priceFormControl.setValue(price);
      comp.billingPeriodFormControl.setValue(billingPeriod);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);

      (comp as any).setSiteMembershipGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'error' }],
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).setSiteMembershipGQL.mutate).toHaveBeenCalledWith({
        membershipName: name,
        membershipDescription: description,
        membershipPricingModel: pricingModel,
        membershipPriceInCents: 1999,
        membershipBillingPeriod: billingPeriod,
        groups: groups.map(group => group.guid),
        roles: [2, 3],
      });

      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        new Error('error')
      );
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
    }));

    it('it should handle null data error creating submission', fakeAsync(() => {
      comp.editMode = false;

      const name: string = 'name';
      const description: string = 'description';
      const price: number = 19.99;
      const pricingModel: SiteMembershipPricingModelEnum =
        SiteMembershipPricingModelEnum.OneTime;
      const billingPeriod: SiteMembershipBillingPeriodEnum =
        SiteMembershipBillingPeriodEnum.Yearly;
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.pricingModelFormControl.setValue(pricingModel);
      comp.priceFormControl.setValue(price);
      comp.billingPeriodFormControl.setValue(billingPeriod);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);

      (comp as any).setSiteMembershipGQL.mutate.and.returnValue(
        of({
          data: {
            siteMembership: null,
          },
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).setSiteMembershipGQL.mutate).toHaveBeenCalledWith({
        membershipName: name,
        membershipDescription: description,
        membershipPricingModel: pricingModel,
        membershipPriceInCents: 1999,
        membershipBillingPeriod: billingPeriod,
        groups: groups.map(group => group.guid),
        roles: [2, 3],
      });

      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        new Error(DEFAULT_ERROR_MESSAGE)
      );
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
    }));

    it('it should handle edit submission', fakeAsync(() => {
      comp.editMode = true;

      const name: string = 'name';
      const description: string = 'description';
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);
      (comp as any).preloadedSiteMembership = siteMembershipMock;

      (comp as any).updateSiteMembershipGQL.mutate.and.returnValue(
        of({
          data: {
            updateSiteMembership: {
              guid: '123',
            },
          },
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).updateSiteMembershipGQL.mutate).toHaveBeenCalledWith(
        {
          membershipGuid: siteMembershipMock.membershipGuid,
          membershipName: name,
          membershipDescription: description,
          groups: groups.map(group => group.guid),
          roles: [2, 3],
        }
      );
      expect(comp.formGroup.pristine).toBeTrue();
      expect(comp.formGroup.touched).toBeFalse();
      expect(comp.formGroup.invalid).toBe(false);
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Membership successfully edited'
      );
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/network/admin/monetization/memberships'
      );
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
    }));

    it('it should handle graphql error editing submission', fakeAsync(() => {
      comp.editMode = true;

      const name: string = 'name';
      const description: string = 'description';
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);
      (comp as any).preloadedSiteMembership = siteMembershipMock;

      (comp as any).updateSiteMembershipGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'error' }],
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).updateSiteMembershipGQL.mutate).toHaveBeenCalledWith(
        {
          membershipGuid: siteMembershipMock.membershipGuid,
          membershipName: name,
          membershipDescription: description,
          groups: groups.map(group => group.guid),
          roles: [2, 3],
        }
      );
      expect((comp as any).toasterService.success).not.toHaveBeenCalledWith(
        'Membership successfully edited'
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalledWith(
        '/network/admin/monetization/memberships'
      );
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        new Error('error')
      );
    }));

    it('it should handle null data error editing submission', fakeAsync(() => {
      comp.editMode = true;

      const name: string = 'name';
      const description: string = 'description';
      const groups: MindsGroup[] = [groupMock];

      comp.nameFormControl.setValue(name);
      comp.descriptionFormControl.setValue(description);
      comp.selectedGroups$.next(groups);
      comp.formGroup.get(`user_role:VERIFIED`).setValue(true);
      comp.formGroup.get(`user_role:MODERATOR`).setValue(true);
      (comp as any).preloadedSiteMembership = siteMembershipMock;

      (comp as any).updateSiteMembershipGQL.mutate.and.returnValue(
        of({
          data: {
            updateSiteMembership: null,
          },
        })
      );

      comp.onSubmit();
      tick();

      expect((comp as any).updateSiteMembershipGQL.mutate).toHaveBeenCalledWith(
        {
          membershipGuid: siteMembershipMock.membershipGuid,
          membershipName: name,
          membershipDescription: description,
          groups: groups.map(group => group.guid),
          roles: [2, 3],
        }
      );
      expect((comp as any).toasterService.success).not.toHaveBeenCalledWith(
        'Membership successfully edited'
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalledWith(
        '/network/admin/monetization/memberships'
      );
      expect((comp as any).submitInProgress$.getValue()).toBe(false);
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        new Error(DEFAULT_ERROR_MESSAGE)
      );
    }));
  });

  describe('addGroup', () => {
    it('should add a group', () => {
      comp.currentGroupSelectionFormControl.markAsPristine();
      comp.currentGroupSelectionFormControl.markAsUntouched();

      comp.selectedGroups$.next([]);
      comp.currentGroupSelectionFormControl.setValue(groupMock);

      expect(comp.selectedGroups$.getValue()).toEqual([groupMock]);
    });

    it('should not add a group that is already added', () => {
      comp.currentGroupSelectionFormControl.markAsPristine();
      comp.currentGroupSelectionFormControl.markAsUntouched();

      comp.selectedGroups$.next([groupMock]);
      comp.currentGroupSelectionFormControl.setValue(groupMock);

      expect(comp.selectedGroups$.getValue()).toEqual([groupMock]);
    });
  });

  it('should handle an invalid price being entered', fakeAsync(() => {
    comp.priceFormControl.setValue(19.999);
    tick();
    expect(comp.priceFormControl.value).toBe(19.99);
  }));
});
