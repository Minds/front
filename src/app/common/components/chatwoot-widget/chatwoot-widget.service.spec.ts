import { TestBed } from '@angular/core/testing';
import { ChatwootWidgetService } from './chatwoot-widget.service';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('ChatwootWidgetService', () => {
  let service: ChatwootWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(ChatwootWidgetService);
    (service as any).document.defaultView.$chatwoot = {
      popoutChatWindow: jasmine.createSpy('popoutChatWindow'),
      toggle: jasmine.createSpy('toggle'),
      toggleBubbleVisibility: jasmine.createSpy('toggleBubbleVisibility'),
    };
  });

  afterAll(() => {
    (service as any).document.defaultView.$chatwoot.popoutChatWindow.calls.reset();
    (service as any).document.defaultView.$chatwoot.toggle.calls.reset();
    (service as any).document.defaultView.$chatwoot = null;
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call to popout chat window', () => {
    service.popoutChatWindow();
    expect(
      (service as any).document.defaultView.$chatwoot.popoutChatWindow
    ).toHaveBeenCalled();
  });

  it('should call to toggle chat window', () => {
    service.toggleChatWindow();
    expect(
      (service as any).document.defaultView.$chatwoot.toggle
    ).toHaveBeenCalled();
  });

  it('should hide the chatwoot bubble', () => {
    service.hideBubble();
    expect(
      (service as any).document.defaultView.$chatwoot.toggleBubbleVisibility
    ).toHaveBeenCalledWith('hide');
  });

  it('should show the chatwoot bubble', () => {
    service.showBubble();
    expect(
      (service as any).document.defaultView.$chatwoot.toggleBubbleVisibility
    ).toHaveBeenCalledWith('show');
  });
});
