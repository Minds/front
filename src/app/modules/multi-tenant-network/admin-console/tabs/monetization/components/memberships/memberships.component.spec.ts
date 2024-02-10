import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminMonetizationMembershipsComponent } from './memberships.component';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { StripeKeysService } from '../../services/stripe-keys.service';
import {
  GetSiteMembershipsGQL,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { siteMembershipMock } from '../../../../../../../mocks/site-membership.mock';

describe('NetworkAdminMonetizationMembershipsComponent', () => {
  let comp: NetworkAdminMonetizationMembershipsComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationMembershipsComponent>;

  const maxMemberships: number = 10;

  const mockSiteMemberships: SiteMembership[] = [
    siteMembershipMock,
    { ...siteMembershipMock, id: '2', membershipGuid: '2' },
  ];

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminMonetizationMembershipsComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'color', 'size', 'solid'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-networkAdminMonetization__membershipAccordian',
          inputs: ['membership'],
          outputs: ['onArchive'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        {
          provide: GetSiteMembershipsGQL,
          useValue: jasmine.createSpyObj<GetSiteMembershipsGQL>(['fetch']),
        },
        {
          provide: StripeKeysService,
          useValue: MockService(StripeKeysService, {
            has: ['hasSetStripeKeys$', 'initialized$', 'fetchInProgress$'],
            props: {
              hasSetStripeKeys$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              initialized$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              fetchInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
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
          provide: ConfigsService,
          useValue: {
            get: () => ({ tenant: { max_memberships: maxMemberships } }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminMonetizationMembershipsComponent
    );
    comp = fixture.componentInstance;

    (comp as any).getSiteMembershipsGQL.fetch.and.returnValue(
      of({
        data: { siteMemberships: mockSiteMemberships },
      })
    );

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

  it('should init', fakeAsync(() => {
    (comp as any).stripeKeysService.initialized$.next(true);
    (comp as any).stripeKeysService.fetchInProgress$.next(true);

    (comp as any).getSiteMembershipsGQL.fetch.and.returnValue(
      of({
        data: { siteMemberships: mockSiteMemberships },
      })
    );

    comp.ngOnInit();
    tick();

    expect(comp).toBeTruthy();
    expect((comp as any).getSiteMembershipsGQL.fetch).toHaveBeenCalled();
    expect(comp.memberships$.getValue()).toEqual(mockSiteMemberships);
    expect(comp.membershipLoadInProgress$.getValue()).toBeFalse();
  }));

  it('should init with error', fakeAsync(() => {
    (comp as any).getSiteMembershipsGQL.fetch.and.returnValue(
      of({
        error: true,
        errors: [{ message: 'expected error' }],
      })
    );

    comp.ngOnInit();
    tick();

    expect(
      (comp as any).stripeKeysService.fetchStripeKeys
    ).not.toHaveBeenCalled();
    expect((comp as any).toaster.error).toHaveBeenCalled();
  }));

  it('shoudl fetch stripe keys on init if not already fetched or in progress', fakeAsync(() => {
    (comp as any).stripeKeysService.initialized$.next(false);
    (comp as any).stripeKeysService.fetchInProgress$.next(false);
    (comp as any).getSiteMembershipsGQL.fetch.and.returnValue(
      of({
        data: { siteMemberships: mockSiteMemberships },
      })
    );

    comp.ngOnInit();
    tick();

    expect((comp as any).stripeKeysService.fetchStripeKeys).toHaveBeenCalled();
  }));

  describe('onCreateButtonClick', () => {
    it('should handle create button click', () => {
      (comp as any).membershipLoadInProgress$.next(false);
      Object.defineProperty(comp, 'maxMemberships', {
        writable: true,
        value: 3,
      });
      comp.memberships$.next(mockSiteMemberships);

      comp.onCreateButtonClick();

      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/network/admin/monetization/memberships/new'
      );
    });

    it('should NOT handle create button click when a request is already in progress', () => {
      (comp as any).membershipLoadInProgress$.next(true);
      Object.defineProperty(comp, 'maxMemberships', {
        writable: true,
        value: 3,
      });
      comp.memberships$.next(mockSiteMemberships);

      comp.onCreateButtonClick();

      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'Please wait for the component to finish loading.'
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should NOT handle create button click when the user is already at max memberships', () => {
      (comp as any).membershipLoadInProgress$.next(false);
      Object.defineProperty(comp, 'maxMemberships', {
        writable: true,
        value: 2,
      });
      comp.memberships$.next(mockSiteMemberships);

      comp.onCreateButtonClick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Your network plan only allows 2 memberships. Archive a membership before creating a new one.'
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should remove a membership', () => {
    comp.memberships$.next(mockSiteMemberships);

    comp.removeMembership(mockSiteMemberships[0].membershipGuid);

    expect(comp.memberships$.getValue()).toEqual([mockSiteMemberships[1]]);
  });
});
