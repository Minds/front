import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MultiFactorAuthService } from './multi-factor-auth-service';

let routerMock = new (function() {
  this.navigate = jasmine.createSpy('navigate');
})();

export let toastServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

let apiServiceMock = new (function() {
  this.post = jasmine
    .createSpy('success')
    .and.returnValue(new BehaviorSubject<any>(null));
})();

describe('MultiFactorAuthService', () => {
  let service: MultiFactorAuthService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new MultiFactorAuthService(
      toastServiceMock,
      apiServiceMock,
      routerMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should set the MFA request object', () => {
    const req = {
      secret: 'sec',
      username: 'user',
      password: 'pass',
    };
    service.setMFARequest(req);
    (service as any).mfaRequest$.subscribe(val => {
      expect(val).toBe(req);
    });
  });

  it('should validate totp code', () => {
    const req = {
      secret: 'sec',
      username: 'user',
      password: 'pass',
    };
    service.setMFARequest(req);

    service.validateCode('123');

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v1/authenticate',
      {
        username: 'user',
        password: 'pass',
      },
      { headers: { 'X-MINDS-2FA-CODE': '123' } }
    );
  });

  it('should validate sms code', () => {
    const req = {
      secretKeyId: 'sec',
      username: 'user',
      password: 'pass',
    };
    service.setMFARequest(req);

    service.validateSMSCode('123');

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v1/authenticate',
      {
        username: 'user',
        password: 'pass',
      },
      {
        headers: {
          'X-MINDS-2FA-CODE': '123',
          'X-MINDS-SMS-2FA-KEY': 'sec',
        },
      }
    );
  });

  it('should resend sms code', () => {
    const req = {
      username: 'user',
      password: 'pass',
    };
    service.setMFARequest(req);

    service.resendSMS();

    expect((service as any).api.post).toHaveBeenCalledWith(
      'api/v1/authenticate',
      {
        username: 'user',
        password: 'pass',
      }
    );
  });
});
