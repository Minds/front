import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ChatRoomBottomBarComponent,
  OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
} from './chat-room-bottom-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmojiPickerModule } from '../../../../../common/components/emoji-picker/emoji-picker.module';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import {
  ChatMessageEdge,
  CreateChatMessageGQL,
  GetChatMessagesDocument,
} from '../../../../../../graphql/generated.engine';
import {
  ChatMessagesService,
  PAGE_SIZE,
} from '../../../services/chat-messages.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import { of, throwError } from 'rxjs';
import { mockChatMessageEdge } from '../../../../../mocks/chat.mock';
import { Session } from '../../../../../services/session';
import userMock from '../../../../../mocks/responses/user.mock';
import { PermissionsService } from '../../../../../common/services/permissions.service';
import { ChatImageUploadService } from '../../../services/chat-image-upload.service';

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
        MockComponent({
          selector: 'm-emojiPicker',
          inputs: ['iconName', 'floatUiPlacement'],
          outputs: ['emojiSelect'],
        }),
        MockComponent({
          selector: 'm-sizableLoadingSpinner',
          inputs: ['spinnerWidth', 'spinnerHeight', 'inProgress'],
        }),
        MockComponent({
          selector: 'm-file-upload',
          inputs: ['accept', 'multiple', 'disabled'],
          outputs: ['onSelect'],
          template: `<div id="fileUpload"><ng-content></ng-content></div>`,
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconName', 'sizeFactor'],
          template: `<div id="uploadIcon"></div>`,
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
        {
          provide: ChatImageUploadService,
          useValue: MockService(ChatImageUploadService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
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

      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
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

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith(
        {
          plainText: testMessage,
          roomGuid: roomGuid,
        },
        {
          update: jasmine.any(Function),
          optimisticResponse: {
            __typename: 'Mutation',
            createChatMessage: {
              __typename: 'ChatMessageEdge',
              id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              node: {
                id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                guid: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                plainText: testMessage,
                roomGuid: (comp as any).roomGuid,
                sender: {
                  cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  type: 'user',
                  node: {
                    id: userMock.guid,
                    guid: userMock.guid,
                    username: userMock.username,
                    name: userMock.name,
                  },
                },
                timeCreatedUnix: jasmine.any(String),
                timeCreatedISO8601: jasmine.any(String),
                richEmbed: null,
                image: null,
              },
            },
          },
        }
      );

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
        (comp as any).chatMessageService.requestScrollToBottom
      ).not.toHaveBeenCalled();
    }));

    it('should handle GQL errors on submit', fakeAsync(() => {
      const testMessage: string = 'test';
      const roomGuid: string = '1234567890123456';

      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).roomGuid = roomGuid;
      (comp as any).formGroup.get('message').setValue(testMessage);
      (comp as any).createMessageGQL.mutate.and.returnValue(
        of({
          errors: [{ message: 'error message' }],
        })
      );

      (comp as any).onSubmit();
      tick();

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith(
        {
          plainText: testMessage,
          roomGuid: roomGuid,
        },
        {
          update: jasmine.any(Function),
          optimisticResponse: {
            __typename: 'Mutation',
            createChatMessage: {
              __typename: 'ChatMessageEdge',
              id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              node: {
                id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                guid: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                plainText: testMessage,
                roomGuid: (comp as any).roomGuid,
                sender: {
                  cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  type: 'user',
                  node: {
                    id: userMock.guid,
                    guid: userMock.guid,
                    username: userMock.username,
                    name: userMock.name,
                  },
                },
                timeCreatedUnix: jasmine.any(String),
                timeCreatedISO8601: jasmine.any(String),
                richEmbed: null,
                image: null,
              },
            },
          },
        }
      );

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

      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
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

      expect((comp as any).createMessageGQL.mutate).toHaveBeenCalledWith(
        {
          plainText: testMessage,
          roomGuid: roomGuid,
        },
        {
          update: jasmine.any(Function),
          optimisticResponse: {
            __typename: 'Mutation',
            createChatMessage: {
              __typename: 'ChatMessageEdge',
              id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
              node: {
                id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                guid: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                plainText: testMessage,
                roomGuid: (comp as any).roomGuid,
                sender: {
                  cursor: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  id: OPTIMISTIC_MESSAGE_FIELD_PLACEHOLDER,
                  type: 'user',
                  node: {
                    id: userMock.guid,
                    guid: userMock.guid,
                    username: userMock.username,
                    name: userMock.name,
                  },
                },
                timeCreatedUnix: jasmine.any(String),
                timeCreatedISO8601: jasmine.any(String),
                richEmbed: null,
                image: null,
              },
            },
          },
        }
      );

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

  describe('handleCreateMessageUpdate', () => {
    it('should handle create message update', () => {
      const cachedEdges: ChatMessageEdge[] = [
        {
          ...mockChatMessageEdge,
          id: '1',
        },
      ];
      const newEdge: ChatMessageEdge = {
        ...mockChatMessageEdge,
        id: '2',
      };
      const readQueryResponse = {
        chatMessages: {
          edges: cachedEdges,
        },
      };

      const cache: any = {
        readQuery: jasmine.createSpy().and.returnValue(readQueryResponse),
        writeQuery: jasmine.createSpy().and.returnValue(true),
      };

      const data: any = {
        data: {
          createChatMessage: newEdge,
        },
      };

      (comp as any).handleCreateMessageUpdate(cache, { data });

      expect(cache.readQuery).toHaveBeenCalledWith({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: (comp as any).roomGuid,
        },
      });
      expect(cache.writeQuery).toHaveBeenCalledWith(
        jasmine.objectContaining({
          query: GetChatMessagesDocument,
          variables: {
            first: PAGE_SIZE,
            roomGuid: (comp as any).roomGuid,
          },
        })
      );
      expect(
        (comp as any).chatMessageService.requestScrollToBottom
      ).toHaveBeenCalled();
    });
  });

  describe('canUploadChatMedia', () => {
    it('should return true if the user can upload chat media', () => {
      (comp as any).permissionService.canUploadChatMedia.and.returnValue(true);
      expect((comp as any).canUploadChatMedia).toBeTrue();
    });

    it('should return false if the user cannot upload chat media', () => {
      (comp as any).permissionService.canUploadChatMedia.and.returnValue(false);
      expect((comp as any).canUploadChatMedia).toBeFalse();
    });
  });

  describe('onFileSelect', () => {
    it('should handle file select', fakeAsync(() => {
      const file: File = new File(['test'], 'test.png', { type: 'image/png' });
      (comp as any).chatImageUploadService.upload.and.returnValue(of({}));

      (comp as any).onFileSelect(file);
      tick();

      expect((comp as any).uploadInProgress$.getValue()).toBeFalse();
      expect((comp as any).chatImageUploadService.upload).toHaveBeenCalledWith(
        file,
        (comp as any).roomGuid
      );
    }));

    it('should handle file select with non-image file', fakeAsync(() => {
      const file: File = new File(['test'], 'test.txt', { type: 'text' });

      (comp as any).onFileSelect(file);
      tick();

      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'Only images are currently supported'
      );
    }));

    it('should handle file select with error', fakeAsync(() => {
      const file: File = new File(['test'], 'test.png', { type: 'image/png' });
      (comp as any).chatImageUploadService.upload.and.returnValue(
        throwError(() => new Error('test'))
      );

      (comp as any).onFileSelect(file);
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Failed to upload image'
      );
      expect((comp as any).uploadInProgress$.getValue()).toBeFalse();
    }));
  });
});
