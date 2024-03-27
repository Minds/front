import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomBottomBarComponent } from './chat-room-bottom-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmojiPickerModule } from '../../../../../common/components/emoji-picker/emoji-picker.module';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import {
  ChatMessageEdge,
  CreateChatMessageGQL,
} from '../../../../../../graphql/generated.engine';
import { ChatMessagesService } from '../../../services/chat-messages.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import { of } from 'rxjs';

describe('ChatRoomBottomBarComponent', () => {
  let comp: ChatRoomBottomBarComponent;
  let fixture: ComponentFixture<ChatRoomBottomBarComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [
        ChatRoomBottomBarComponent,
        ReactiveFormsModule,
        EmojiPickerModule,
      ],
      declarations: [
        MockComponent({ selector: 'm-emojiPicker', outputs: ['emojiSelect'] }),
        MockComponent({
          selector: 'm-sizableLoadingSpinner',
          inputs: ['spinnerWidth', 'spinnerHeight', 'inProgress'],
        }),
      ],
      providers: [
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: CreateChatMessageGQL,
          useValue: jasmine.createSpyObj<CreateChatMessageGQL>(['mutate']),
        },
        {
          provide: ChatMessagesService,
          useValue: MockService(ChatMessagesService),
        },
        { provide: ThemeService, useValue: MockService(ThemeService) },
      ],
    });

    fixture = TestBed.createComponent(ChatRoomBottomBarComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'error');

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

  describe('onEnterPress', () => {
    it('should handle enter button press', () => {});

    it('should handle enter button press when shift is held', () => {});
  });

  describe('onSubmit', () => {
    it('should handle submit', fakeAsync(() => {
      const testMessage: string = 'test';
      const roomGuid: string = '1234567890123456';
      const chatMessageEdge: ChatMessageEdge = {
        node: {
          guid: '123456789012',
        },
      } as ChatMessageEdge;

      (comp as any).roomGuid = roomGuid;
      (comp as any).formGroup.get('message').setValue(testMessage);
      (comp as any).createMessageGQL.mutate.and.returnValue(
        of({
          data: {
            createChatMessage: chatMessageEdge,
          },
        })
      );

      (comp as any).onSubmit();
      tick();

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith({
        plainText: testMessage,
        roomGuid: roomGuid,
      });
      expect(
        (comp as any).chatMessageService.appendChatMessage
      ).toHaveBeenCalledWith(chatMessageEdge);
      expect((comp as any).formGroup.get('message').value).toBe('');
      expect((comp as any).formGroup.get('message').pristine).toBeTrue();
      expect((comp as any).formGroup.get('message').untouched).toBeTrue();
    }));

    it('should NOT handle submit when message has no trimmed length', fakeAsync(() => {
      const testMessage: string = ' ';
      (comp as any).formGroup.get('message').setValue(testMessage);

      (comp as any).onSubmit();
      tick();

      expect((comp as any).createMessageGQL.mutate).not.toHaveBeenCalled();
      expect(
        (comp as any).chatMessageService.appendChatMessage
      ).not.toHaveBeenCalled();
    }));

    it('should handle GQL errors on submit', fakeAsync(() => {
      const testMessage: string = 'test';
      const roomGuid: string = '1234567890123456';

      (comp as any).roomGuid = roomGuid;
      (comp as any).formGroup.get('message').setValue(testMessage);
      (comp as any).createMessageGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'error message' }],
        })
      );

      (comp as any).onSubmit();
      tick();

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith({
        plainText: testMessage,
        roomGuid: roomGuid,
      });
      expect(
        (comp as any).chatMessageService.appendChatMessage
      ).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalled();
      expect((comp as any).formGroup.get('message').value).toBe(testMessage);
    }));

    it('should handle submit via enter key press', fakeAsync(() => {
      const testMessage: string = 'test';
      const roomGuid: string = '1234567890123456';
      const chatMessageEdge: ChatMessageEdge = {
        node: {
          guid: '123456789012',
        },
      } as ChatMessageEdge;

      (comp as any).roomGuid = roomGuid;
      (comp as any).formGroup.get('message').setValue(testMessage);
      (comp as any).createMessageGQL.mutate.and.returnValue(
        of({
          data: {
            createChatMessage: chatMessageEdge,
          },
        })
      );

      (comp as any).onEnterPress({
        preventDefault: () => void 0,
      });
      tick();

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith({
        plainText: testMessage,
        roomGuid: roomGuid,
      });
      expect(
        (comp as any).chatMessageService.appendChatMessage
      ).toHaveBeenCalledWith(chatMessageEdge);
      expect((comp as any).formGroup.get('message').value).toBe('');
      expect((comp as any).formGroup.get('message').pristine).toBeTrue();
      expect((comp as any).formGroup.get('message').untouched).toBeTrue();
    }));

    it('should NOT handle submit via enter key press when shift is held', fakeAsync(() => {
      (comp as any).onEnterPress({ shiftKey: true });
      tick();

      expect((comp as any).createMessageGQL.mutate).not.toHaveBeenCalled();
    }));
  });
});
