import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatInitService } from './chat-init.service';
import { InitChatGQL } from '../../../../graphql/generated.engine';
import { GlobalChatSocketService } from './global-chat-socket.service';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { BehaviorSubject } from 'rxjs';
import { ChatNotificationToasterService } from './chat-notification-toast.service';

describe('ChatInitService', () => {
  let service: ChatInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InitChatGQL,
          useValue: jasmine.createSpyObj<InitChatGQL>(['watch']),
        },
        {
          provide: GlobalChatSocketService,
          useValue: MockService(GlobalChatSocketService),
        },
        {
          provide: ChatNotificationToasterService,
          useValue: MockService(ChatNotificationToasterService),
        },
        { provide: Session, useValue: MockService(Session) },
        ChatInitService,
      ],
    });

    service = TestBed.inject(ChatInitService);
    (service as any)._queryRef = jasmine.createSpyObj([
      'watch',
      'valueChanges',
      'resetLastResults',
      'refetch',
    ]);
    (service as any)._queryRef.valueChanges = new BehaviorSubject({
      data: { chatRoomGuids: [] },
    });

    spyOn(console, 'info'); // suppress console.info
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  describe('init function', () => {
    it('should not initialize if user is not logged in', fakeAsync(() => {
      (service as any).session.isLoggedIn.and.returnValue(false);

      service.init();
      tick();

      expect((service as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (service as any).globalChatSocketService.listen
      ).not.toHaveBeenCalled();
    }));

    it('should initialize if user is logged in', fakeAsync(() => {
      const guids: string[] = ['123', '234'];
      (service as any).session.isLoggedIn.and.returnValue(true);

      service.init();
      tick();

      expect((service as any).session.isLoggedIn).toHaveBeenCalled();
      expect(
        (service as any).globalChatSocketService.listen
      ).toHaveBeenCalled();
      expect(
        (service as any).chatNotificationToasterService.init
      ).toHaveBeenCalled();
    }));
  });

  it('should destroy', () => {
    service.destroy();
    expect((service as any)._queryRef.resetLastResults).toHaveBeenCalled();
  });

  it('should refetch', () => {
    service.refetch();
    expect((service as any)._queryRef.refetch).toHaveBeenCalled();
  });

  it('should reinit', fakeAsync(() => {
    const guids: string[] = ['123', '234'];
    (service as any).session.isLoggedIn.and.returnValue(true);

    service.reinit();

    expect((service as any)._queryRef.resetLastResults).toHaveBeenCalled();
    expect((service as any)._queryRef.refetch).toHaveBeenCalled();
    expect((service as any).session.isLoggedIn).toHaveBeenCalled();
    expect((service as any).globalChatSocketService.listen).toHaveBeenCalled();
  }));

  it('should get unread count', (done: DoneFn) => {
    (service as any).session.isLoggedIn.and.returnValue(true);

    const unreadCount: number = 5;
    (service as any)._queryRef.valueChanges.next({
      data: { chatUnreadMessagesCount: unreadCount },
    });

    service.getUnreadCount$().subscribe((count: number) => {
      expect(count).toBe(unreadCount);
      done();
    });
  });
});
