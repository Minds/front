import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { SettingsV2PaymentHistoryService } from './payment-history.service';
import { Payment } from './payment-history.types';
import { SettingsV2PaymentHistoryComponent } from './payment-history.component';
import userMock from '../../../../mocks/responses/user.mock';
import { TruncatePipe } from '../../../../common/pipes/truncate.pipe';

describe('SettingsV2PaymentHistoryComponent', () => {
  let comp: SettingsV2PaymentHistoryComponent;
  let fixture: ComponentFixture<SettingsV2PaymentHistoryComponent>;

  const mockPayments: Payment[] = [
    {
      status: 'succeeded',
      payment_id: 'pay_123',
      currency: 'usd',
      minor_unit_amount: 100,
      statement_descriptor: 'Minds: Supermind',
      created_timestamp: 1666276983,
      receipt_url: 'https://www.minds.com/',
      recipient: userMock,
    },
    {
      status: 'succeeded',
      payment_id: 'pay_234',
      currency: 'usd',
      minor_unit_amount: 100,
      statement_descriptor: 'Minds: Plus sub',
      created_timestamp: 1666276984,
      receipt_url: 'https://www.minds.com/',
      recipient: null,
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SettingsV2PaymentHistoryComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
        }),
        MockComponent({
          selector: 'm-tooltip',
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
        }),
        TruncatePipe,
      ],
    })
      .overrideProvider(SettingsV2PaymentHistoryService, {
        useValue: MockService(SettingsV2PaymentHistoryService, {
          has: ['hasMore$', 'inProgress$', 'rawList$'],
          props: {
            hasMore$: {
              get: () => new BehaviorSubject<boolean>(true),
            },
            inProgress$: {
              get: () => new BehaviorSubject<boolean>(false),
            },
            rawList$: {
              get: () => new BehaviorSubject<Payment[]>(mockPayments),
            },
          },
        }),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(SettingsV2PaymentHistoryComponent);
    comp = fixture.componentInstance;

    (comp as any).service.hasMore$.next(true);
    (comp as any).service.inProgress$.next(false);
    (comp as any).service.rawList$.next(mockPayments);

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

  it('should get hasMore$ from service', (done: DoneFn) => {
    (comp as any).service.hasMore$.next(false);
    comp.hasMore$.subscribe((val) => {
      expect(val).toBeFalsy();
      done();
    });
  });

  it('should get inProgress$ from service', (done: DoneFn) => {
    (comp as any).service.inProgress$.next(true);
    comp.inProgress$.subscribe((val) => {
      expect(val).toBeTruthy();
      done();
    });
  });

  it('should get list$ from service', (done: DoneFn) => {
    comp.list$.subscribe((val) => {
      expect(val).toEqual(mockPayments);
      done();
    });
  });

  it('should call service to load next', () => {
    comp.loadNext();
    expect((comp as any).service.loadNext).toHaveBeenCalled();
  });
});
