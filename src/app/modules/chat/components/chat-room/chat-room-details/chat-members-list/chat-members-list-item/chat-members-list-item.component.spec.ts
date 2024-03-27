import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMembersListItemComponent } from './chat-members-list-item.component';
import { mockChatMemberEdge } from '../../../../../../../mocks/chat.mock';
import { MockComponent } from '../../../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChatMembersListItemComponent', () => {
  let comp: ChatMembersListItemComponent;
  let fixture: ComponentFixture<ChatMembersListItemComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatMembersListItemComponent],
    }).overrideComponent(ChatMembersListItemComponent, {
      set: {
        imports: [
          RouterTestingModule,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-chatRoomMembersListItem__dropdown',
            inputs: ['memberEdge'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatMembersListItemComponent);
    comp = fixture.componentInstance;

    (comp as any).memberEdge = mockChatMemberEdge;

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

    expect(fixture.nativeElement.querySelector('minds-avatar')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('m-chatRoomMembersListItem__dropdown')
    ).toBeTruthy();

    expect(
      fixture.nativeElement.querySelector('.m-chatMemberListItem__name')
        .innerText
    ).toBe(mockChatMemberEdge.node.name);
    expect(
      fixture.nativeElement.querySelector('.m-chatMemberListItem__username')
        .innerText
    ).toBe('@' + mockChatMemberEdge.node.username);
  });
});
