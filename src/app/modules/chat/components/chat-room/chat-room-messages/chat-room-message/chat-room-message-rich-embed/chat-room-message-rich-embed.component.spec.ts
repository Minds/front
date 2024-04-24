import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomMessageRichEmbedComponent } from './chat-room-message-rich-embed.component';
import { WINDOW } from '../../../../../../../common/injection-tokens/common-injection-tokens';
import { ChangeDetectorRef } from '@angular/core';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { MockService } from '../../../../../../../utils/mock';

describe('ChatRoomMessageRichEmbedComponent', () => {
  let comp: ChatRoomMessageRichEmbedComponent;
  let fixture: ComponentFixture<ChatRoomMessageRichEmbedComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMessageRichEmbedComponent],
      providers: [
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
      ],
    });

    fixture = TestBed.createComponent(ChatRoomMessageRichEmbedComponent);
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

  it('should have thumbnail, title and description', () => {
    (comp as any).thumbnailSrc = 'https://example.minds.com/image.png';
    (comp as any).title = 'Title';
    (comp as any).url = 'https://example.minds.com';

    fixture.detectChanges();
    comp.cd.detectChanges();

    const thumbnail = fixture.nativeElement.querySelector(
      '.m-chatRoomMessage__richEmbedImage'
    );
    expect(thumbnail).toBeTruthy();
    expect(thumbnail.src).toBe((comp as any).thumbnailSrc);

    const title = fixture.nativeElement.querySelector(
      '.m-chatRoomMessage__richEmbedTitle'
    );
    expect(title).toBeTruthy();
    expect(title.textContent).toBe((comp as any).title);

    const url = fixture.nativeElement.querySelector(
      '.m-chatRoomMessage__richEmbedUrl'
    );
    expect(url).toBeTruthy();
    expect(url.textContent).toBe((comp as any).url);
  });

  describe('handleRichEmbedClick', () => {
    it('should handle rich embed click', () => {
      const event: MouseEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as any;
      (comp as any).url = 'https://example.minds.com';
      (comp as any).handleRichEmbedClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect((comp as any).window.open).toHaveBeenCalledWith(
        (comp as any).url,
        '_blank'
      );
    });

    it('should handle rich embed click and not navigate when there is no URL', () => {
      const event: MouseEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
      } as any;
      (comp as any).url = null;
      (comp as any).handleRichEmbedClick(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect((comp as any).window.open).not.toHaveBeenCalled();
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'You are not able to open this link.'
      );
    });
  });
});
