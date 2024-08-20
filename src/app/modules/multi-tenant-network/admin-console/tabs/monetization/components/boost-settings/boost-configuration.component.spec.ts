import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CommonModule as NgCommonModule } from '@angular/common';
import { NetworkAdminBoostConfigurationComponent } from './boost-configuration.component';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../../mocks/responses/multi-tenant-config.mock';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

describe('NetworkAdminBoostConfigurationComponent', () => {
  let comp: NetworkAdminBoostConfigurationComponent;
  let fixture: ComponentFixture<NetworkAdminBoostConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminBoostConfigurationComponent],
      providers: [
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService, {
            has: ['config$'],
            props: {
              config$: {
                get: () =>
                  new BehaviorSubject<MultiTenantConfig>(multiTenantConfigMock),
              },
            },
          }),
        },
        {
          provide: StripeKeysService,
          useValue: MockService(StripeKeysService, {
            has: ['initialized$', 'hasSetStripeKeys$'],
            props: {
              initialized$: { get: () => new BehaviorSubject<boolean>(true) },
              hasSetStripeKeys$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).overrideComponent(NetworkAdminBoostConfigurationComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-boostEmbedBuilder',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-networkAdminConsole__createBoostLink',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-networkAdminConsole__enableBoostToggle',
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(NetworkAdminBoostConfigurationComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).router.navigate).not.toHaveBeenCalled();
    expect((comp as any).toaster.warn).not.toHaveBeenCalled();
  });

  describe('render', () => {
    it('should render boost embed builder and create boost link when boost is enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
        customHomePageEnabled: true,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeTruthy();
    });

    it('should NOT render boost embed builder and create boost link when boost is NOT enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: false,
        customHomePageEnabled: true,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeFalsy();
    });

    it('should NOT render boost create link section when boosting is enabled but custom homepage is disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
        customHomePageEnabled: false,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeFalsy();
    });
  });

  describe('checkStripeKeys', () => {
    it('should get stripe keys from server and navigate if not set', fakeAsync(() => {
      (comp as any).stripeKeysService.initialized$.next(false);
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(false);

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalledOnceWith(
        'You must set Stripe keys before accessing this page.'
      );
      expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
        '/network/admin/monetization',
      ]);
    }));

    it('should get stripe keys from server and not navigate if set', fakeAsync(() => {
      (comp as any).stripeKeysService.initialized$.next(false);
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(true);

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).toHaveBeenCalled();
      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect((comp as any).router.navigate).not.toHaveBeenCalled();
    }));

    it('should not get stripe keys from server when already inited and navigate if not set', fakeAsync(() => {
      (comp as any).stripeKeysService.initialized$.next(true);
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(false);

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).not.toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalledOnceWith(
        'You must set Stripe keys before accessing this page.'
      );
      expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
        '/network/admin/monetization',
      ]);
    }));

    it('should not get stripe keys from server when already inited and not navigate if set', fakeAsync(() => {
      (comp as any).stripeKeysService.initialized$.next(true);
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(true);

      comp.ngOnInit();
      tick();

      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).not.toHaveBeenCalled();
      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect((comp as any).router.navigate).not.toHaveBeenCalled();
    }));
  });
});
