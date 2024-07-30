import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleSiteMembershipModalComponent } from './single-site-membership-modal.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SiteMembershipService } from '../../services/site-memberships.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject, of } from 'rxjs';
import { siteMembershipMock } from '../../../../mocks/site-membership.mock';
import { SiteMembershipSubscription } from '../../../../../graphql/generated.engine';

describe('SingleSiteMembershipModalComponent', () => {
  let comp: SingleSiteMembershipModalComponent;
  let fixture: ComponentFixture<SingleSiteMembershipModalComponent>;
  let siteMembershipServiceMock: any = MockService(SiteMembershipService, {
    has: ['siteMembershipSubscriptions$'],
    props: {
      siteMembershipSubscriptions$: {
        get: () => new BehaviorSubject<SiteMembershipSubscription[]>([]),
      },
    },
  });

  siteMembershipServiceMock.loadMembershipByGuid.and.returnValue(
    of(siteMembershipMock)
  );

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        SingleSiteMembershipModalComponent,
        MockComponent({
          selector: 'm-siteMembershipCard',
          inputs: [
            'name',
            'description',
            'priceInCents',
            'priceCurrencyCode',
            'billingPeriod',
            'pricingModel',
          ],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-joinManageSiteMembershipButton',
          inputs: ['membershipGuid'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['size', 'stretch'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-modalCloseButton',
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
      providers: [
        { provide: SiteMembershipService, useValue: siteMembershipServiceMock },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(SingleSiteMembershipModalComponent);
    comp = fixture.componentInstance;

    (comp as any).membershipGuid = siteMembershipMock.membershipGuid;
    (comp as any).siteMembershipsService.siteMembershipSubscriptions$.next([]);

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set site membership on init', () => {
      (comp as any).onCloseIntent = jasmine.createSpy('onCloseIntent');
      (comp as any).siteMembershipsService.loadMembershipByGuid.and.returnValue(
        of(siteMembershipMock)
      );

      comp.ngOnInit();

      expect((comp as any).siteMembership$.getValue()).toEqual(
        siteMembershipMock
      );
      expect((comp as any).onCloseIntent).not.toHaveBeenCalled();
      expect((comp as any).initialized$.getValue()).toEqual(true);
    });

    it('should close modal when no site membership is found on init', () => {
      (comp as any).onCloseIntent = jasmine.createSpy('onCloseIntent');
      (comp as any).siteMembershipsService.loadMembershipByGuid.and.returnValue(
        of(null)
      );

      comp.ngOnInit();

      expect((comp as any).onCloseIntent).toHaveBeenCalled();
    });

    it('should close if the user is already subscribed to the membership', () => {
      (comp as any).upgradeMode = true;
      (comp as any).onCloseIntent = jasmine.createSpy('onCloseIntent');
      (comp as any).siteMembership$.next(siteMembershipMock);
      (comp as any).membershipGuid = siteMembershipMock.membershipGuid;
      (comp as any).siteMembershipsService.siteMembershipSubscriptions$.next([
        {
          membershipGuid: siteMembershipMock.membershipGuid,
        },
      ]);
      (comp as any).siteMembershipsService.loadMembershipByGuid.and.returnValue(
        of(siteMembershipMock)
      );

      comp.ngOnInit();

      expect((comp as any).onCloseIntent).toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'You are already a member. Please contact an administrator.'
      );
    });

    it('should NOT close if the user is already subscribed to the membership when not in upgrade mode', () => {
      (comp as any).upgradeMode = false;
      (comp as any).onCloseIntent = jasmine.createSpy('onCloseIntent');
      (comp as any).siteMembership$.next(siteMembershipMock);
      (comp as any).membershipGuid = siteMembershipMock.membershipGuid;
      (comp as any).siteMembershipsService.siteMembershipSubscriptions$.next([
        {
          membershipGuid: siteMembershipMock.membershipGuid,
        },
      ]);
      (comp as any).siteMembershipsService.loadMembershipByGuid.and.returnValue(
        of(siteMembershipMock)
      );

      comp.ngOnInit();

      expect((comp as any).onCloseIntent).not.toHaveBeenCalled();
      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
    });
  });

  it('should set modal data', () => {
    let title = 'title';
    let subtitle = 'subtitle';
    let closeCtaText = 'closeCtaText';
    let membershipGuid = 'membershipGuid';
    let upgradeMode = true;
    let onJoinIntent = jasmine.createSpy('onJoinIntent');
    let onCloseIntent = jasmine.createSpy('onCloseIntent');

    comp.setModalData({
      title: 'title',
      subtitle: 'subtitle',
      closeCtaText: 'closeCtaText',
      membershipGuid: 'membershipGuid',
      upgradeMode: true,
      onJoinIntent: onJoinIntent,
      onCloseIntent: onCloseIntent,
    });

    expect((comp as any).title).toEqual(title);
    expect((comp as any).subtitle).toEqual(subtitle);
    expect((comp as any).closeCtaText).toEqual(closeCtaText);
    expect((comp as any).membershipGuid).toEqual(membershipGuid);
    expect((comp as any).upgradeMode).toEqual(upgradeMode);
    expect((comp as any).onJoinIntent).toEqual(onJoinIntent);
    expect((comp as any).onCloseIntent).toEqual(onCloseIntent);
  });
});
