import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomMessageDropdownComponent } from './chat-room-message-dropdown.component';
import { MockDirective, MockService } from '../../../../../../../utils/mock';
import { ChatMessagesService } from '../../../../../services/chat-messages.service';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { ReportCreatorComponent } from '../../../../../../report/creator/creator.component';

describe('ChatRoomMessageDropdownComponent', () => {
  let comp: ChatRoomMessageDropdownComponent;
  let fixture: ComponentFixture<ChatRoomMessageDropdownComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMessageDropdownComponent],
      providers: [
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: ChatMessagesService,
          useValue: MockService(ChatMessagesService),
        },
      ],
    }).overrideComponent(ChatRoomMessageDropdownComponent, {
      set: {
        imports: [
          NgCommonModule,
          NgxPopperjsModule,
          MockDirective({
            selector: 'showOnHover',
            inputs: [
              'hoverSourceElement',
              'forceShow',
              'reactToForceShowChange',
            ],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomMessageDropdownComponent);
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

  it('should handle on popper shown', () => {
    (comp as any).dropdownMenuShown = false;
    (comp as any).onPopperShown();
    expect((comp as any).dropdownMenuShown).toBe(true);
  });

  it('should handle on popper hidden', () => {
    (comp as any).dropdownMenuShown = true;
    (comp as any).onPopperHidden();
    expect((comp as any).dropdownMenuShown).toBe(false);
  });

  it('should handle report click', () => {
    (comp as any).messageEdge = {
      node: { id: '123' },
    };
    (comp as any).onReportClick();

    expect((comp as any).modalService.present).toHaveBeenCalledWith(
      ReportCreatorComponent,
      {
        data: {
          entity: {
            urn: '123',
            id: '123',
          },
        },
      }
    );
  });

  it('should handle delete click', () => {
    (comp as any).messageEdge = { node: { id: '123' } };
    (comp as any).onDeleteClick();
    expect(
      (comp as any).chatMessageService.removeChatMessage
    ).toHaveBeenCalledWith((comp as any).messageEdge);
  });
});
