import { TestBed } from '@angular/core/testing';
import { ChatwootWidgetService } from './chatwoot-widget.service';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';

describe('ChatwootWidgetService', () => {
  let service: ChatwootWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: IS_TENANT_NETWORK, useValue: false },
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
    (
      service as any
    ).document.defaultView.$chatwoot.popoutChatWindow.calls.reset();
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

  it('should not call to popout chat window when on tenant and not an admin', () => {
    (service as any).session.isAdmin.and.returnValue(false);
    Object.defineProperty(service, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

    service.popoutChatWindow();
    expect(
      (service as any).document.defaultView.$chatwoot.popoutChatWindow
    ).not.toHaveBeenCalled();
  });

  it('should call to toggle chat window', () => {
    service.toggleChatWindow();
    expect(
      (service as any).document.defaultView.$chatwoot.toggle
    ).toHaveBeenCalled();
  });

  it('should not call to toggle chat window when on tenant and not an admin', () => {
    (service as any).session.isAdmin.and.returnValue(false);
    Object.defineProperty(service, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

    service.toggleChatWindow();
    expect(
      (service as any).document.defaultView.$chatwoot.toggle
    ).not.toHaveBeenCalled();
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

  it('should not call to show the chat window when on tenant and not an admin', () => {
    (service as any).session.isAdmin.and.returnValue(false);
    Object.defineProperty(service, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

    service.showBubble();
    expect(
      (service as any).document.defaultView.$chatwoot.toggleBubbleVisibility
    ).not.toHaveBeenCalled();
  });
});
