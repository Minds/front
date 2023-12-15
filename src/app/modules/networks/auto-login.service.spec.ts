import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApiService } from '../../common/api/api.service';
import { AutoLoginService } from './auto-login.service';
import { ToasterService } from '../../common/services/toaster.service';
import { DOCUMENT } from '@angular/common';
import { MockService } from '../../utils/mock';
import { of } from 'rxjs';

describe('AutoLoginService', () => {
  let service: AutoLoginService;
  const mockForm = {
    method: '',
    target: '',
    action: '',
    append: jasmine.createSpy('append'),
    submit: jasmine.createSpy('submit'),
  };
  const mockInput = {
    type: '',
    name: '',
    value: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutoLoginService,
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: DOCUMENT,
          useValue: {
            createElement: jasmine.createSpy('createElement'),
            body: {
              appendChild: jasmine.createSpy('appendChild'),
              removeChild: jasmine.createSpy('removeChild'),
            },
          },
        },
      ],
    });

    service = TestBed.inject(AutoLoginService);

    (service as any).document.createElement.calls.reset();
    (service as any).document.body.appendChild.calls.reset();
    (service as any).document.body.removeChild.calls.reset();
    mockForm.append.calls.reset();
    mockForm.submit.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', fakeAsync(() => {
    const tenantId: number = 123;
    const loginUrl: string = 'http://example.com';
    const jwtToken: string = 'ey123';

    (service as any).document.createElement
      .withArgs('form')
      .and.returnValue(mockForm);

    (service as any).document.createElement
      .withArgs('input')
      .and.returnValue(mockInput);

    (service as any).api.get.and.returnValue(
      of({
        login_url: loginUrl,
        jwt_token: jwtToken,
      })
    );

    service.login(tenantId);
    tick();

    expect((service as any).api.get).toHaveBeenCalledWith(
      'api/v3/multi-tenant/auto-login/login-url',
      {
        tenant_id: tenantId,
      }
    );
    expect((service as any).document.createElement).toHaveBeenCalledWith(
      'form'
    );
    expect((service as any).document.createElement).toHaveBeenCalledWith(
      'input'
    );
    expect(mockForm.append).toHaveBeenCalledWith({
      type: 'hidden',
      name: 'jwt_token',
      value: 'ey123',
    });
    expect((service as any).document.body.appendChild).toHaveBeenCalledWith(
      mockForm
    );
    expect(mockForm.submit).toHaveBeenCalled();
    expect((service as any).document.body.removeChild).toHaveBeenCalledWith(
      mockForm
    );
  }));

  it('should NOT login if no login url is returned', fakeAsync(() => {
    const tenantId: number = 123;
    const jwtToken: string = 'ey123';

    (service as any).api.get.and.returnValue(
      of({
        login_url: null,
        jwt_token: jwtToken,
      })
    );

    service.login(tenantId);
    tick();

    expect((service as any).toaster.error).toHaveBeenCalledWith(
      'Unable to login to network'
    );
    expect(mockForm.submit).not.toHaveBeenCalled();
  }));

  it('should NOT login if no jwt token is returned', fakeAsync(() => {
    const tenantId: number = 123;
    const loginUrl: string = 'http://example.com';

    (service as any).api.get.and.returnValue(
      of({
        login_url: loginUrl,
        jwt_token: null,
      })
    );

    service.login(tenantId);
    tick();

    expect((service as any).toaster.error).toHaveBeenCalledWith(
      'Unable to login to network'
    );
    expect(mockForm.submit).not.toHaveBeenCalled();
  }));
});
