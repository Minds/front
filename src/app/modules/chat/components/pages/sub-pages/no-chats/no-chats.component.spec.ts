import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoChatsSubPageComponent } from './no-chats.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { StartChatModalService } from '../../../start-chat-modal/start-chat-modal.service';

describe('MyComponent', () => {
  let comp: NoChatsSubPageComponent;
  let fixture: ComponentFixture<NoChatsSubPageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [NoChatsSubPageComponent],
      providers: [
        {
          provide: StartChatModalService,
          useValue: MockService(StartChatModalService),
        },
      ],
    }).overrideComponent(NoChatsSubPageComponent, {
      set: {
        imports: [
          MockComponent({
            selector: 'm-chat__actionCard',
            inputs: ['headerText', 'descriptionText', 'ctaText'],
            outputs: ['actionButtonClick'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(NoChatsSubPageComponent);
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

  it('should handle start new chat click', () => {
    (comp as any).onStartNewChatClick();
    expect((comp as any).startChatModal.open).toHaveBeenCalledWith(true);
  });
});
