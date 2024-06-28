import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletDashboardComponent } from './dashboard.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { WalletV2Service } from './wallet-v2.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenPricesService } from './components/currency-value/token-prices.service';
import { ChangeDetectorRef, PLATFORM_ID } from '@angular/core';

describe('WalletDashboardComponent', () => {
  let comp: WalletDashboardComponent;
  let fixture: ComponentFixture<WalletDashboardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        WalletDashboardComponent,
        MockComponent({
          selector: 'm-dashboardLayout',
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-wallet__tokenPriceBadge',
          template: `<div></div>`,
        }),
        MockComponent({
          selector: 'router-outlet',
        }),
      ],
      providers: [
        { provide: WalletV2Service, useValue: MockService(WalletV2Service) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: Router,
          useValue: {
            url: '/wallet/tokens',
            navigate: jasmine.createSpy('navigate'),
          },
        },
        { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        {
          provide: TokenPricesService,
          useValue: {
            minds: 0,
          },
        },
        ChangeDetectorRef,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    fixture = TestBed.createComponent(WalletDashboardComponent);
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('render m-wallet__tokenPriceBadge', () => {
    it('should render m-wallet__tokenPriceBadge when there is a token price', () => {
      (comp as any).tokenPricesService.minds = 1;
      (comp as any).router.url = '/wallet/tokens';
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('m-wallet__tokenPriceBadge')
      ).toBeFalsy();
    });

    it('should not render m-wallet__tokenPriceBadge when there is no token prices', () => {
      (comp as any).tokenPricesService.minds = 0;
      (comp as any).router.url = '/wallet/tokens';
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('m-wallet__tokenPriceBadge')
      ).toBeFalsy();
    });

    it('should not render m-wallet__tokenPriceBadge when token price is null', () => {
      (comp as any).tokenPricesService.minds = null;
      (comp as any).router.url = '/wallet/tokens';
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('m-wallet__tokenPriceBadge')
      ).toBeFalsy();
    });

    it('should not render m-wallet__tokenPriceBadge when url does not include', () => {
      (comp as any).tokenPricesService.minds = 1;
      (comp as any).router.url = '/wallet/cash';
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('m-wallet__tokenPriceBadge')
      ).toBeFalsy();
    });
  });
});
