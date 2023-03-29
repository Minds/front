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
import { ChatwootWidgetComponent } from './chatwoot-widget.component';

let configMock = new (function() {
  this.get = jasmine.createSpy('get').and.returnValue({
    website_token: '~website_token~',
    base_url: '~base_url~',
    script_url: '~script_url~',
  });
})();

describe('ChatwootWidgetComponent', () => {
  let comp: ChatwootWidgetComponent;
  let fixture: ComponentFixture<ChatwootWidgetComponent>;

  beforeEach(
    waitForAsync(() => {
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
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
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

  it('should init chatwoot for logged out user', () => {
    (comp as any).onChatwootLoad();
    (comp as any).session.isLoggedIn.and.returnValue(false);

    expect((window as any).chatwootSDK.run).toHaveBeenCalledOnceWith({
      websiteToken: (comp as any).websiteToken,
      baseUrl: (comp as any).baseUrl,
    });

    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
    expect((comp as any).loggedInSubscription).toBeTruthy();
  });

  it('should reset chatwoot on log out', fakeAsync(() => {
    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(false);
    tick();
    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
  }));

  it('should init chatwoot for logged in user', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));

    (comp as any).onChatwootLoad();
    tick();

    expect((window as any).chatwootSDK.run).toHaveBeenCalledOnceWith({
      websiteToken: (comp as any).websiteToken,
      baseUrl: (comp as any).baseUrl,
    });

    expect((comp as any).api.get).toHaveBeenCalledWith(
      '/api/v3/helpdesk/chatwoot/hmac'
    );
    expect((window as any).$chatwoot.setUser).toHaveBeenCalledWith(
      mockUser.guid,
      {
        name: `@${mockUser.username}`,
        identifier_hash: mockHmac,
      }
    );

    expect((comp as any).loggedInSubscription).toBeTruthy();
  }));

  it('should set user for chatwoot on log in', fakeAsync(() => {
    const mockHmac: string = 'abcdef123456';
    const mockUser: Partial<MindsUser> = {
      guid: '123',
      username: 'testaccount',
    };
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);
    (comp as any).api.get.and.returnValue(of({ hmac: mockHmac }));

    (comp as any).initLoginStateSubscription();
    (comp as any).session.loggedinEmitter.emit(true);
    tick();

    expect((comp as any).api.get).toHaveBeenCalledWith(
      '/api/v3/helpdesk/chatwoot/hmac'
    );
    expect((window as any).$chatwoot.setUser).toHaveBeenCalledWith(
      mockUser.guid,
      {
        name: `@${mockUser.username}`,
        identifier_hash: mockHmac,
      }
    );

    expect((comp as any).loggedInSubscription).toBeTruthy();
  }));

  it('should reset chatwoot', () => {
    (comp as any).resetChatwoot();
    expect((window as any).$chatwoot.reset).toHaveBeenCalled();
  });
});
