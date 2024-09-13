import { EventEmitter, PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { ApiService } from '../../api/api.service';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';
import { ChatwootWidgetComponent } from './chatwoot-widget.component';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { ChatwootWidgetService } from './chatwoot-widget.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../injection-tokens/common-injection-tokens';
import { EmailAddressService } from '../../services/email-address.service';
import userMock from '../../../mocks/responses/user.mock';

let configMock = new (function () {
  this.get = jasmine.createSpy('get').and.returnValue({
    website_token: '~website_token~',
    base_url: '~base_url~',
    script_url: '~script_url~',
  });
})();

describe('ChatwootWidgetComponent', () => {
  let comp: ChatwootWidgetComponent;
  let fixture: ComponentFixture<ChatwootWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChatwootWidgetComponent],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: { get: () => new EventEmitter<boolean>() },
            },
          }),
        },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: ConfigsService, useValue: configMock },
        {
          provide: UserAvatarService,
          useValue: MockService(UserAvatarService),
        },
        {
          provide: ChatwootWidgetService,
          useValue: MockService(ChatwootWidgetService),
        },
        {
          provide: EmailAddressService,
          useValue: MockService(EmailAddressService),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: IS_TENANT_NETWORK, useValue: false },
        { provide: DOCUMENT, useValue: document },
        { provide: WINDOW, useValue: window },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ChatwootWidgetComponent);
    comp = fixture.componentInstance;

    (window as any).chatwootSDK = {
      run: jasmine.createSpy('run'),
    };

    (window as any).$chatwoot = {
      setUser: jasmine.createSpy('setUser'),
      reset: jasmine.createSpy('reset'),
    };

    spyOn(window as any, 'addEventListener');

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).config.get).toHaveBeenCalledWith('chatwoot');
  });

  it('should init chatwoot for logged out user', fakeAsync(() => {
    (comp as any).onChatwootLoad();
    (comp as any).session.isLoggedIn.and.returnValue(false);

    expect((window as any).chatwootSDK.run).toHaveBeenCalledOnceWith({
      websiteToken: (comp as any).websiteToken,
      baseUrl: (comp as any).baseUrl,
    });

    // emulate browser event coming back.
    (comp as any).resetChatwoot();
    (comp as any).initLoginStateSubscription();
    tick();

    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
    expect((comp as any).loggedInSubscription).toBeTruthy();
  }));

  it('should init chatwoot on init with a user who can use chatwoot', () => {
    (window as any).chatwootSDK.run.calls.reset();
    spyOn(comp as any, 'initChatwoot').and.callThrough();
    (comp as any).service.canUseChatwoot.and.returnValue(true);

    (comp as any).ngOnInit();

    expect((comp as any).initChatwoot).toHaveBeenCalled();
  });

  it('should not init chatwoot until logging in to a suitable user, if the initial user cannot use chatwoot', fakeAsync(() => {
    (window as any).chatwootSDK.run.calls.reset();
    spyOn(comp as any, 'initChatwoot').and.callThrough();
    (comp as any).service.canUseChatwoot.and.returnValue(false);

    (comp as any).ngOnInit();
    expect((comp as any).initChatwoot).not.toHaveBeenCalled();

    (comp as any).service.canUseChatwoot.and.returnValue(true);

    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).initChatwoot).toHaveBeenCalled();
  }));

  it('should not init chatwoot if no website token is provided', fakeAsync(() => {
    (comp as any).chatWootConfig = {
      website_token: '',
      base_url: '~base_url~',
      script_url: '~script_url~',
    };
    (window as any).chatwootSDK.run.calls.reset();
    (comp as any).ngOnInit();

    expect((window as any).chatwootSDK.run).not.toHaveBeenCalled();
  }));

  it('should not init chatwoot if no base url is provided', fakeAsync(() => {
    (comp as any).chatWootConfig = {
      website_token: '~website_url~',
      base_url: '',
      script_url: '~script_url~',
    };
    (window as any).chatwootSDK.run.calls.reset();
    (comp as any).ngOnInit();

    expect((window as any).chatwootSDK.run).not.toHaveBeenCalled();
  }));

  it('should reset chatwoot on log out', fakeAsync(() => {
    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(false);
    tick();
    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
  }));

  it('should init chatwoot for logged in user', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const avatarSrc: string = 'localhost/avatar.jpg';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
    (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);
    (comp as any).onChatwootLoad();
    tick();

    // emulate browser event coming back.
    (comp as any).setUser();
    (comp as any).initLoginStateSubscription();
    tick();

    expect((window as any).chatwootSDK.run).toHaveBeenCalledOnceWith({
      websiteToken: (comp as any).websiteToken,
      baseUrl: (comp as any).baseUrl,
    });

    expect((comp as any).api.get).toHaveBeenCalledWith(
      '/api/v3/helpdesk/chatwoot/hmac'
    );
    expect((comp as any).userAvatar.getSrc).toHaveBeenCalled();
    expect((window as any).$chatwoot.setUser).toHaveBeenCalledWith(
      mockUser.guid,
      {
        name: `@${mockUser.username}`,
        identifier_hash: mockHmac,
        avatar_url: avatarSrc,
      }
    );

    expect((comp as any).loggedInSubscription).toBeTruthy();
  }));

  it('should set user for chatwoot on log in', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const avatarSrc: string = 'localhost/avatar.jpg';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
    (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);

    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).api.get).toHaveBeenCalledWith(
      '/api/v3/helpdesk/chatwoot/hmac'
    );
    expect((comp as any).userAvatar.getSrc).toHaveBeenCalled();
    expect((window as any).$chatwoot.setUser).toHaveBeenCalledWith(
      mockUser.guid,
      {
        name: `@${mockUser.username}`,
        identifier_hash: mockHmac,
        avatar_url: avatarSrc,
      }
    );

    expect((comp as any).loggedInSubscription).toBeTruthy();
  }));

  it('should show bubble on login to a tenant for a user who can use chatwoot', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const avatarSrc: string = 'localhost/avatar.jpg';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
    (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);
    (comp as any).service.canUseChatwoot.and.returnValue(true);
    Object.defineProperty(comp, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).service.showBubble).toHaveBeenCalled();
    expect((comp as any).service.hideBubble).not.toHaveBeenCalled();
  }));

  it('should hide bubble on login to a tenant for a user who cannot use chatwoot', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const avatarSrc: string = 'localhost/avatar.jpg';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
    (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);
    (comp as any).service.canUseChatwoot.and.returnValue(false);
    Object.defineProperty(comp, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).service.showBubble).not.toHaveBeenCalled();
    expect((comp as any).service.hideBubble).toHaveBeenCalled();
  }));

  it('should not call to show or hide bubble on login to a non-tenant', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const avatarSrc: string = 'localhost/avatar.jpg';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
    (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);
    (comp as any).service.canUseChatwoot.and.returnValue(true);
    Object.defineProperty(comp, 'isTenantNetwork', {
      value: false,
      writable: true,
    });

    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).service.showBubble).not.toHaveBeenCalled();
    expect((comp as any).service.hideBubble).not.toHaveBeenCalled();
  }));

  it('should reset chatwoot', () => {
    (comp as any).resetChatwoot();
    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
  });

  describe('onBubbleClick', () => {
    it('should handle bubble click when current chatwoot user has an email', fakeAsync(() => {
      (comp as any).window.$chatwoot.user = { email: 'noreply@minds.com' };

      (comp as any).onBubbleClick(new Event('click'));
      tick();

      expect(
        (comp as any).emailAddressService.getEmailAddress
      ).not.toHaveBeenCalled();
    }));

    it('should handle bubble click when current chatwoot user is not set', fakeAsync(() => {
      const mockHmac: string = 'abcdef123456';
      const avatarSrc: string = 'localhost/avatar.jpg';

      (comp as any).emailAddressService.getEmailAddress.and.returnValue(
        Promise.resolve('noreply@minds.com')
      );
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).window.$chatwoot.user = undefined;
      (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));
      (comp as any).userAvatar.getSrc.and.returnValue(avatarSrc);

      (comp as any).onBubbleClick(new Event('click'));
      tick();

      expect((comp as any).window.$chatwoot.reset).toHaveBeenCalled();
      expect((comp as any).window.$chatwoot.setUser).toHaveBeenCalledWith(
        userMock.guid,
        {
          name: `@${userMock.username}`,
          identifier_hash: mockHmac,
          avatar_url: avatarSrc,
          email: 'noreply@minds.com',
        }
      );
      expect(
        (comp as any).emailAddressService.getEmailAddress
      ).toHaveBeenCalled();
    }));

    it('should handle bubble click when current chatwoot user has no email', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (window as any).$chatwoot = {
        user: { username: '@minds' },
        setUser: jasmine.createSpy('setUser'),
        reset: jasmine.createSpy('reset'),
      };
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).emailAddressService.getEmailAddress.and.returnValue(
        Promise.resolve('noreply@minds.com')
      );

      (comp as any).onBubbleClick(new Event('click'));
      tick();

      expect(
        (comp as any).emailAddressService.getEmailAddress
      ).toHaveBeenCalled();
    }));
  });
});
