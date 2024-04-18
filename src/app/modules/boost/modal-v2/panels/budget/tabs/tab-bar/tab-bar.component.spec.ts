import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Injector } from '@angular/core';
import { BoostModalV2Service } from '../../../../services/boost-modal-v2.service';
import { BoostPaymentCategory } from '../../../../boost-modal-v2.types';
import { MockService } from '../../../../../../../utils/mock';
import { BoostModalV2BudgetTabBarComponent } from './tab-bar.component';
import { ModalService } from '../../../../../../../services/ux/modal.service';

describe('BoostModalV2BudgetTabBarComponent', () => {
  let comp: BoostModalV2BudgetTabBarComponent;
  let fixture: ComponentFixture<BoostModalV2BudgetTabBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BoostModalV2BudgetTabBarComponent],
      providers: [
        {
          provide: BoostModalV2Service,
          useValue: MockService(BoostModalV2Service, {
            has: ['paymentCategory$'],
            props: {
              paymentCategory$: {
                get: () =>
                  new BehaviorSubject<BoostPaymentCategory>(
                    BoostPaymentCategory.CASH
                  ),
              },
            },
          }),
        },
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: Injector,
          useValue: MockService(Injector),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostModalV2BudgetTabBarComponent);
    comp = fixture.componentInstance;

    (comp as any).paymentCategory$.next(BoostPaymentCategory.CASH);

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should change to cash on click for cash tab', (done: DoneFn) => {
    (comp as any).paymentCategory$.next(BoostPaymentCategory.TOKENS);
    comp.onTabClick(BoostPaymentCategory.CASH);

    (comp as any).paymentCategory$.subscribe(
      (paymentCategory: BoostPaymentCategory) => {
        // expect((comp as any).modal.present).not.toHaveBeenCalled();
        expect(paymentCategory).toBe(BoostPaymentCategory.CASH);
        done();
      }
    );
  });

  // it('should open confirmation modal when switching to tokens tab', () => {
  //   (comp as any).paymentCategory$.next(BoostPaymentCategory.CASH);
  //   comp.onTabClick(BoostPaymentCategory.TOKENS);
  //   expect((comp as any).modal.present).toHaveBeenCalled();
  // });

  it('should do nothing if payment category is already selected', () => {
    (comp as any).paymentCategory$.next(BoostPaymentCategory.TOKENS);
    comp.onTabClick(BoostPaymentCategory.TOKENS);
    // expect((comp as any).modal.present).not.toHaveBeenCalled();
  });
});
