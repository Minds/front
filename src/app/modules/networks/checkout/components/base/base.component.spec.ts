import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NetworksCheckoutBaseComponent } from './base.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { NetworksCheckoutService } from '../../services/checkout.service';
import { TopbarAlertService } from '../../../../../common/components/topbar-alert/topbar-alert.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import {
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
} from '../../../../../../graphql/generated.engine';

describe('NetworksCheckoutBaseComponent', () => {
  let comp: NetworksCheckoutBaseComponent;
  let fixture: ComponentFixture<NetworksCheckoutBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworksCheckoutBaseComponent,
        MockComponent({
          selector: 'm-sizeableLoadingSpinner',
          inputs: ['spinnerWidth', 'spinnerHeight', 'inProgress'],
        }),
        MockComponent({
          selector: 'm-networksCheckout__planBuilder',
        }),
        MockComponent({
          selector: 'm-networksCheckout__summary',
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: TopbarAlertService,
          useValue: MockService(TopbarAlertService, {
            has: ['topbarAlertShown$'],
            props: {
              topbarAlertShown$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                planId: 'networks_community',
              }),
            },
          },
        },
      ],
    })
      .overrideProvider(NetworksCheckoutService, {
        useValue: MockService(NetworksCheckoutService, {
          has: ['loaded$'],
          props: {
            loaded$: {
              get: () => new BehaviorSubject<boolean>(true),
            },
          },
        }),
      })
      .compileComponents();

    fixture = TestBed.createComponent(NetworksCheckoutBaseComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init when planId is provided with no timePeriod', () => {
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        planId: 'networks_community',
      });
      (comp as any).checkoutService.setIsTrialUpgradeRequest.and.returnValue(
        (comp as any).checkoutService
      );

      comp.ngOnInit();

      expect((comp as any).checkoutService.init).toHaveBeenCalledWith({
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Addons,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      });
    });

    it('should redirect when planId is NOT provided and we are not showing the confirmation page', () => {
      (comp as any).checkoutService.init.calls.reset();
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({});

      comp.ngOnInit();

      expect((comp as any).checkoutService.init).not.toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'Please select a plan.'
      );
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/about/networks'
      );
    });

    it('should redirect when planId is NOT provided', () => {
      (comp as any).checkoutService.init.calls.reset();
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        confirmed: true,
      });

      comp.ngOnInit();

      expect((comp as any).toaster.warn).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalled();

      expect((comp as any).checkoutService.init).not.toHaveBeenCalledWith({
        planId: '',
        page: CheckoutPageKeyEnum.Confirmation,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      });
    });

    it('should init with Confirmation page when query param is provided', () => {
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        planId: 'networks_community',
        confirmed: 'true',
      });
      (comp as any).checkoutService.setIsTrialUpgradeRequest.and.returnValue(
        (comp as any).checkoutService
      );

      comp.ngOnInit();

      expect((comp as any).checkoutService.init).toHaveBeenCalledWith({
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Confirmation,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      });
    });

    it('should init with a timePeriod of monthly when query param is provided', () => {
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        planId: 'networks_community',
        timePeriod: 'monthly',
      });
      (comp as any).checkoutService.setIsTrialUpgradeRequest.and.returnValue(
        (comp as any).checkoutService
      );

      comp.ngOnInit();

      expect((comp as any).checkoutService.init).toHaveBeenCalledWith({
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Addons,
        timePeriod: CheckoutTimePeriodEnum.Monthly,
      });
    });

    it('should init with a timePeriod of yearly when query param is provided', () => {
      (comp as any).route.snapshot.queryParamMap = convertToParamMap({
        planId: 'networks_community',
        timePeriod: 'yearly',
      });
      (comp as any).checkoutService.setIsTrialUpgradeRequest.and.returnValue(
        (comp as any).checkoutService
      );

      comp.ngOnInit();

      expect((comp as any).checkoutService.init).toHaveBeenCalledWith({
        planId: 'networks_community',
        page: CheckoutPageKeyEnum.Addons,
        timePeriod: CheckoutTimePeriodEnum.Yearly,
      });
    });
  });
});
