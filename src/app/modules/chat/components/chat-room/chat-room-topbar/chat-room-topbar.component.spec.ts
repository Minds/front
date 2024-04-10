import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomTopComponent } from './chat-room-topbar.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatRoomUtilsService } from '../../../services/utils.service';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';
import { mockChatMemberEdge } from '../../../../../mocks/chat.mock';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ChatRoomTopComponent', () => {
  let comp: ChatRoomTopComponent;
  let fixture: ComponentFixture<ChatRoomTopComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomTopComponent],
      providers: [
        ChangeDetectorRef,
        {
          provide: ChatRoomUtilsService,
          useValue: MockService(ChatRoomUtilsService),
        },
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
      ],
    }).overrideComponent(ChatRoomTopComponent, {
      set: {
        imports: [
          NgCommonModule,
          RouterTestingModule,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomTopComponent);
    comp = fixture.componentInstance;

    (comp as any).roomName = 'roomName';
    (comp as any).roomMembers = [mockChatMemberEdge];
    (comp as any).requestMode = false;

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

  describe('ngOnChanges', () => {
    it('should derive room name from members', () => {
      (comp as any).roomMembers = [mockChatMemberEdge];
      (
        comp as any
      ).chatRoomUtilsService.deriveRoomNameFromMembers.and.returnValue(
        'roomName'
      );
      comp.ngOnChanges({
        roomMembers: {
          currentValue: [mockChatMemberEdge],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      expect(
        (comp as any).chatRoomUtilsService.deriveRoomNameFromMembers
      ).toHaveBeenCalledWith([mockChatMemberEdge]);
    });
  });

  it('should open a channel in a new tab', () => {
    (comp as any).openChannelInNewTab('username');
    expect((comp as any).window.open).toHaveBeenCalledWith(
      '/username',
      '_blank'
    );
  });

  describe('Render template', () => {
    it('should render a maximum of 3 avatars', () => {
      (comp as any).roomMembers = [
        mockChatMemberEdge,
        mockChatMemberEdge,
        mockChatMemberEdge,
        mockChatMemberEdge,
        mockChatMemberEdge,
      ];

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('minds-avatar')).length).toBe(
        3
      );
    });

    it('should show details icon for non request-mode', () => {
      (comp as any).requestMode = false;

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-chatRoomTop__rightContainer i')
      ).toBeTruthy();
    });

    it('should NOT show details icon for request-mode', () => {
      (comp as any).requestMode = true;

      fixture.detectChanges();
      (comp as any).cd.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-chatRoomTop__rightContainer i')
      ).toBeFalsy();
    });
  });
});
