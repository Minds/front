import { TestBed } from '@angular/core/testing';
import { ChatReceiptService } from './chat-receipt.service';
import {
  GetChatUnreadCountGQL,
  GetChatUnreadCountQuery,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';
import { ReplaySubject, lastValueFrom, of, take } from 'rxjs';

describe('ChatReceiptService', () => {
  let service: ChatReceiptService, getChatUnreadCountMock$: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SetReadReceiptGQL,
          useValue: jasmine.createSpyObj<SetReadReceiptGQL>(['mutate']),
        },
        {
          provide: GetChatUnreadCountGQL,
          useValue: jasmine.createSpyObj<GetChatUnreadCountGQL>(['watch']),
        },
        ChatReceiptService,
      ],
    });

    service = TestBed.inject(ChatReceiptService);

    getChatUnreadCountMock$ = new ReplaySubject();

    (service as any).getUnreadCountGql.watch.and.returnValue({
      refetch: jasmine.createSpy('refetch'),
      fetchMore: jasmine.createSpy('fetchMore'),
      valueChanges: getChatUnreadCountMock$,
    });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should poll for new message', async () => {
    getChatUnreadCountMock$.next({
      data: {
        chatUnreadMessagesCount: 12,
      },
    });

    expect(await lastValueFrom(service.getUnreadCount$().pipe(take(1)))).toBe(
      12
    );
  });

  it('should submit read receipt', async () => {
    (service as any).setReadReceiptGql.mutate.and.returnValue(
      of({
        data: {
          setReadReceipt: {
            success: true,
          },
        },
      })
    );

    service.update('1', '2');

    expect((service as any).setReadReceiptGql.mutate).toHaveBeenCalled();
  });
});
