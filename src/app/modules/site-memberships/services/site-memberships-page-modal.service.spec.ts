import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SiteMembershipsPageModal } from './site-memberships-page-modal.service';
import { MockService } from '../../../utils/mock';
import { ModalService } from '../../../services/ux/modal.service';
import { Injector } from '@angular/core';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { SiteMembershipService } from './site-memberships.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { SiteMembership } from '../../../../graphql/generated.engine';
import { siteMembershipMock } from '../../../mocks/site-membership.mock';

describe('SiteMembershipsPageModal', () => {
  let service: SiteMembershipsPageModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiteMembershipsPageModal,
        { provide: ModalService, useValue: MockService(ModalService) },
        Injector,
        { provide: IsTenantService, useValue: MockService(IsTenantService) },
        {
          provide: SiteMembershipService,
          useValue: MockService(SiteMembershipService, {
            has: [
              'initialized$',
              'siteMemberships$',
              'siteMembershipSubscriptions$',
            ],
            props: {
              initialized$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              siteMemberships$: {
                get: () =>
                  new BehaviorSubject<SiteMembership[]>([siteMembershipMock]),
              },
              siteMembershipSubscriptions$: {
                get: () => new ReplaySubject<SiteMembership[]>(),
              },
            },
          }),
        },
      ],
    });

    service = TestBed.inject(SiteMembershipsPageModal);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(true);
    (service as any).siteMembershipsService.siteMemberships$.next([
      siteMembershipMock,
    ]);
    (service as any).siteMembershipsService.siteMembershipSubscriptions$.next(
      []
    );

    service.open();
    (service as any).siteMembershipsService.initialized$.next(true);
    tick();

    expect((service as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      jasmine.anything(),
      {
        data: {
          isModal: true,
          onJoinClick: jasmine.any(Function),
          skipInitialFetch: true,
          showDismissActions: true,
        },
        injector: (service as any).injector,
        size: 'lg',
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
  }));

  it('should NOT open for non tenants', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(false);

    service.open();
    tick();

    expect(
      (service as any).siteMembershipsService.fetch
    ).not.toHaveBeenCalled();
    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  it('should NOT open if no memberships are returned', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(true);
    (service as any).siteMembershipsService.siteMemberships$.next([]);

    service.open();
    (service as any).siteMembershipsService.initialized$.next(true);
    tick();

    expect((service as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  it('should NOT open if the user has site memberships and has not set showWhenMember', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(true);
    (service as any).siteMembershipsService.siteMemberships$.next([
      siteMembershipMock,
    ]);
    // arbitrary values as we only check length
    (service as any).siteMembershipsService.siteMembershipSubscriptions$.next([
      1, 2,
    ]);

    service.open();
    (service as any).siteMembershipsService.initialized$.next(true);
    tick();

    expect((service as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  it('should open regardless of subscriptions when showWhenMember is true', fakeAsync(() => {
    (service as any).isTenant.is.and.returnValue(true);
    (service as any).siteMembershipsService.siteMemberships$.next([
      siteMembershipMock,
    ]);
    (service as any).siteMembershipsService.siteMembershipSubscriptions$.next([
      1, 2,
    ]);

    service.open({ showWhenMember: true });
    (service as any).siteMembershipsService.initialized$.next(true);
    tick();

    expect((service as any).siteMembershipsService.fetch).toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      jasmine.anything(),
      {
        data: {
          isModal: true,
          onJoinClick: jasmine.any(Function),
          skipInitialFetch: true,
          showDismissActions: true,
        },
        injector: (service as any).injector,
        size: 'lg',
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
  }));
});
