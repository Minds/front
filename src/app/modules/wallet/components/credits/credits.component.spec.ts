import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { WalletV2CreditsComponent } from './credits.component';
import { GiftCardPurchaseExperimentService } from '../../../experiments/sub-services/gift-card-purchase-experiment.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WalletV2CreditsComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsComponent>;
  let comp: WalletV2CreditsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsComponent,
        MockComponent({ selector: 'm-walletV2__creditsSummary' }),
        MockComponent({ selector: 'router-outlet' }),
      ],
      providers: [
        {
          provide: GiftCardPurchaseExperimentService,
          useValue: MockService(GiftCardPurchaseExperimentService),
        },
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have send tab when experiment is ON', fakeAsync(() => {
    (comp as any).purchaseExperiment.isActive.and.returnValue(true);
    comp.ngOnInit();
    fixture.detectChanges();

    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-walletCreditsTab__sendTab')
    );

    expect(element).toBeTruthy();
  }));

  it('should NOT have send tab when experiment is OFF', fakeAsync(() => {
    (comp as any).purchaseExperiment.isActive.and.returnValue(false);
    comp.ngOnInit();
    fixture.detectChanges();

    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-walletCreditsTab__sendTab')
    );

    expect(element).toBeNull();
  }));
});
