import { TestBed } from '@angular/core/testing';
import { SettingsTwoFactorV2Service } from './two-factor-v2.service';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

let routerMock = new (function () {
  this.navigate = jasmine.createSpy('navigate');
  this.events = new BehaviorSubject<any>(null);
})();

export let toasterServiceMock = new (function () {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

export let settingsServiceMock = new (function () {
  this.loadSettings = jasmine.createSpy('loadSettings');
})();

xdescribe('SettingsTwoFactorV2Service', () => {
  let service: SettingsTwoFactorV2Service;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new SettingsTwoFactorV2Service(
      toasterServiceMock,
      new (() => {})(),
      settingsServiceMock,
      sessionMock,
      routerMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
    expect((service as any).reloadSettings());
  });

  it('should report whether totp is enabled', () => {
    (service as any).settings.settings$ = new BehaviorSubject<any>({
      has2fa: {
        totp: true,
        sms: false,
      },
    });

    service.totpEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should report whether sms is enabled', () => {
    (service as any).settings.settings$ = new BehaviorSubject<any>({
      has2fa: {
        totp: false,
        sms: true,
      },
    });

    service.smsEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should reset state', () => {
    service.inProgress$.next(false);
    service.activePanel$.next(null);
    service.passwordConfirmed$.next(true);
    service.secret$.next('123');
    service.reset();

    return combineLatest([
      service.inProgress$,
      service.activePanel$,
      service.passwordConfirmed$,
      service.secret$,
    ])
      .pipe(
        map(([inProgress, activePanel, passwordConfirmed, secret]) => {
          expect(inProgress).toBeFalsy();
          expect(activePanel).toEqual({ panel: 'root' });
          expect(passwordConfirmed).toBe(false);
          expect(secret).toBe('');
        })
      )
      .subscribe();
  });

  it('should fetch a new secret and set value of local secret$', () => {
    const response = {
      status: 'success',
      secret: '123',
    };

    (service as any).api = {
      get(endpoint) {
        return new BehaviorSubject<any>(response);
      },
    };

    spyOn((service as any).api, 'get').and.returnValue(
      new BehaviorSubject<any>(response)
    );

    service.fetchNewSecret();
    expect((service as any).api.get).toHaveBeenCalledWith(
      'api/v3/security/totp/new'
    );
    service.secret$.subscribe((val) => {
      expect(val).toBe('123');
    });
  });

  it('should submit a totp code', () => {
    const response = {
      status: 'success',
      'recovery-code': '123',
    };

    (service as any).api = {
      post(endpoint) {
        return new BehaviorSubject<any>(response);
      },
    };

    spyOn((service as any).api, 'post').and.returnValue(
      new BehaviorSubject<any>(response)
    );

    service.submitCode('123');

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v3/security/totp/new',
      {
        code: '123',
        secret: '',
      }
    );
  });

  it('should delete totp', () => {
    const response = {
      status: 'success',
    };

    (service as any).api = {
      delete(endpoint) {
        return new BehaviorSubject<any>(response);
      },
    };

    spyOn((service as any).api, 'delete').and.returnValue(
      new BehaviorSubject<any>(response)
    );

    service.removeTotp('123');

    expect((service as any).api.delete).toHaveBeenCalledWith(
      'api/v3/security/totp',
      {},
      {},
      { code: '123' }
    );
  });
});
