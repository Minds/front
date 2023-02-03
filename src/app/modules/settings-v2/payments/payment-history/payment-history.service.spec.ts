import { combineLatest, of } from 'rxjs';
import { take } from 'rxjs/operators';
import userMock from '../../../../mocks/responses/user.mock';
import { SettingsV2PaymentHistoryService } from './payment-history.service';
import { Payment, GetPaymentsRequest } from './payment-history.types';

describe('SettingsV2PaymentHistoryService', () => {
  let service: SettingsV2PaymentHistoryService;

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

  const mockResponse: GetPaymentsRequest = {
    status: 'success',
    data: mockPayments,
    has_more: true,
  };

  let apiMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  let toastMock = new (function() {
    this.error = jasmine.createSpy('error');
  })();

  beforeEach(() => {
    service = new SettingsV2PaymentHistoryService(apiMock, toastMock);
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list from API', (done: DoneFn) => {
    const expectedNextPagingToken: string =
      mockResponse.data[mockResponse.data.length - 1].payment_id;
    (service as any).api.get.and.returnValue(of(mockResponse));

    combineLatest([
      service.rawList$,
      service.hasMore$,
      (service as any).pagingToken$,
      (service as any).nextPagingToken$,
    ])
      .pipe(take(1))
      .subscribe(([rawList, hasMore, pagingToken, nextPagingToken]: any[]) => {
        expect((service as any).api.get).toHaveBeenCalled();
        expect(rawList).toEqual(mockPayments);
        expect(hasMore).toBeTrue();
        expect(nextPagingToken).toBe(expectedNextPagingToken);
        done();
      });
  });

  it('should load next by setting paging token', (done: DoneFn) => {
    const nextPagingToken: string = 'pay_2';
    (service as any).nextPagingToken$.next(nextPagingToken);
    (service as any).pagingToken$.next('pay_1');

    service.loadNext();

    (service as any).pagingToken$.pipe(take(1)).subscribe(val => {
      expect(val).toBe(nextPagingToken);
      done();
    });
  });
});
