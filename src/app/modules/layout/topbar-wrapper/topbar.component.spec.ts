import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TopbarWrapperComponent } from './topbar.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { GiftCardPurchaseExperimentService } from '../../experiments/sub-services/gift-card-purchase-experiment.service';

describe('TopbarWrapperComponent', () => {
  let comp: TopbarWrapperComponent;
  let fixture: ComponentFixture<TopbarWrapperComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TopbarWrapperComponent,
          MockComponent({
            selector: 'm-topbar',
          }),
          MockComponent({
            selector: 'm-search--bar',
            inputs: ['defaultSizes'],
          }),
          MockComponent({
            selector: 'm-tooltip',
          }),
          MockComponent({
            selector: 'm-topbar__walletBalance',
          }),
          MockComponent({
            selector: 'm-icon',
            inputs: ['from', 'iconId', 'sizeFactor', 'rem'],
            outputs: ['click'],
          }),
          MockComponent({
            selector: 'm-notifications--topbar-toggle',
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: Router,
            useValue: MockService(Router),
          },
          {
            provide: GiftCardPurchaseExperimentService,
            useValue: MockService(GiftCardPurchaseExperimentService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(TopbarWrapperComponent);
    comp = fixture.componentInstance;

    (comp as any).giftCardPurchaseExperiment.isActive.and.returnValue(true);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set giftCardPurchaseExperimentIsActive to true', () => {
      comp.giftCardPurchaseExperimentIsActive = false;
      (comp as any).giftCardPurchaseExperiment.isActive.and.returnValue(true);
      comp.ngOnInit();
      expect(comp.giftCardPurchaseExperimentIsActive).toBeTrue();
    });

    it('should set giftCardPurchaseExperimentIsActive to false', () => {
      comp.giftCardPurchaseExperimentIsActive = true;
      (comp as any).giftCardPurchaseExperiment.isActive.and.returnValue(false);
      comp.ngOnInit();
      expect(comp.giftCardPurchaseExperimentIsActive).toBeFalse();
    });
  });

  describe('onGiftIconClick', () => {
    it('should navigate on gift icon click', () => {
      comp.onGiftIconClick();
      expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
        '/wallet/credits/send',
      ]);
    });
  });
});
