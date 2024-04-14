import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WalletV2CreditsSendComponent } from './send.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Router } from '@angular/router';

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
      providers: [{ provide: Router, useValue: MockService(Router) }],
    });

    fixture = TestBed.createComponent(WalletV2CreditsSendComponent);
    comp = fixture.componentInstance;

    (comp as any).router.navigate.calls.reset();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
