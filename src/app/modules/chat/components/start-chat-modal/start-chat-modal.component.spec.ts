import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { StartChatModalServiceComponent } from './start-chat-modal.component';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockComponent, MockService } from '../../../../utils/mock';
import { CreateChatRoomService } from '../../services/create-chat-room.service';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';
import { CDN_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { CommonModule as NgCommonModule } from '@angular/common';
import userMock from '../../../../mocks/responses/user.mock';

const MOCK_CDN_URL: string = 'https://example.minds.com';

describe('StartChatModalServiceComponent', () => {
  let comp: StartChatModalServiceComponent;
  let fixture: ComponentFixture<StartChatModalServiceComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [StartChatModalServiceComponent],
      providers: [
        FormBuilder,
        {
          provide: CreateChatRoomService,
          useValue: MockService(CreateChatRoomService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: CDN_URL, useValue: MOCK_CDN_URL },
      ],
    }).overrideComponent(StartChatModalServiceComponent, {
      set: {
        imports: [
          NgCommonModule,
          ReactiveFormsModule,
          MockComponent({
            selector: 'm-modalCloseButton',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-formInput__entityTypeahead',
            outputs: ['loading'],
            providers: [
              {
                provide: NG_VALUE_ACCESSOR,
                useValue: {
                  writeValue: () => {},
                  registerOnChange: () => {},
                  registerOnTouched: () => {},
                },
                multi: true,
              },
            ],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'size', 'solid', 'disabled', 'saving'],
            outputs: ['onAction'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(StartChatModalServiceComponent);
    comp = fixture.componentInstance;

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

  describe('ngOnInit', () => {
    it('should handle search matched users change', fakeAsync(() => {
      (comp as any).formGroup
        .get('searchMatchedUsers')
        .setValue([userMock, userMock]);
      tick();

      expect((comp as any).searchMatches$.getValue()).toEqual([
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: false,
        },
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: false,
        },
      ]);
    }));

    it('should handle search matched users change and correctly identify as already selected', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([userMock]);

      tick();

      expect((comp as any).searchMatches$.getValue()).toEqual([
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: true,
        },
      ]);
    }));
  });

  describe('toggleUserSelect', () => {
    it('should toggle user selection OFF', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([userMock]);
      tick();

      (comp as any).toggleUserSelect(userMock);
      tick();

      expect((comp as any).selectedUsers$.getValue()).toEqual([]);
    }));

    it('should toggle user selection ON', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([]);
      tick();

      (comp as any).toggleUserSelect(userMock);
      tick();

      expect((comp as any).selectedUsers$.getValue()).toEqual([userMock]);
    }));
  });

  describe('onConfirmClick', () => {
    it('should handle confirm click', fakeAsync(() => {
      const chatRoomId: string = '1234';
      (comp as any).createChatRoomService.createChatRoom.and.returnValue(
        Promise.resolve(chatRoomId)
      );
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).selectedUsers$.next([userMock]);

      (comp as any).onConfirmClick();
      tick();

      expect(
        (comp as any).createChatRoomService.createChatRoom
      ).toHaveBeenCalledWith([userMock]);
      expect((comp as any).onCompleted).toHaveBeenCalledWith(chatRoomId);
    }));

    it('should handle confirm click and fail', fakeAsync(() => {
      (comp as any).createChatRoomService.createChatRoom.and.returnValue(
        Promise.reject()
      );
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).selectedUsers$.next([userMock]);

      (comp as any).onConfirmClick();
      tick();

      expect(
        (comp as any).createChatRoomService.createChatRoom
      ).toHaveBeenCalledWith([userMock]);
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        DEFAULT_ERROR_MESSAGE
      );
    }));
  });

  it('should set typeahead loading state', () => {
    (comp as any).loadingResults$.next(false);
    (comp as any).onTypeaheadLoadingStateChange(true);
    expect((comp as any).loadingResults$.getValue()).toBeTrue();
  });

  it('should track results', () => {
    const result: string = (comp as any).trackResultsBy(userMock);
    expect(result).toBe(userMock.guid);
  });
});
