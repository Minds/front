import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WalletV2CreditsSendComponent } from './send.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Router } from '@angular/router';
import { GiftCardPurchaseExperimentService } from '../../../../experiments/sub-services/gift-card-purchase-experiment.service';

describe('WalletV2CreditsSendComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsSendComponent>;
  let comp: WalletV2CreditsSendComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsSendComponent,
        MockComponent({
          selector: 'm-walletV2__creditsProductUpgradeCard',
          inputs: ['giftType'],
        }),
      ],
      providers: [
        {
          provide: GiftCardPurchaseExperimentService,
          useValue: MockService(GiftCardPurchaseExperimentService),
        },
        { provide: Router, useValue: MockService(Router) },
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsSendComponent);
    comp = fixture.componentInstance;

    (comp as any).purchaseExperiment.isActive.and.returnValue(true);
    (comp as any).router.navigate.calls.reset();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should navigate to credits history if experiment is off', () => {
    (comp as any).purchaseExperiment.isActive.and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/wallet/credits/history',
    ]);
  });

  it('should NOT navigate to credits history if experiment is on', () => {
    (comp as any).purchaseExperiment.isActive.and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).router.navigate).not.toHaveBeenCalledWith([
      '/wallet/credits/history',
    ]);
  });
});
