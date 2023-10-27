import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { NetworkSettingsAuthGuard } from './network-settings-auth.guard';

const configsMock: jasmine.SpyObj<ConfigsService> = jasmine.createSpyObj<
  ConfigsService
>(['get']);

const sessionMock: jasmine.SpyObj<Session> = jasmine.createSpyObj<Session>([
  'isAdmin',
]);

const routerMock: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>([
  'navigate',
]);

const toasterServiceMock: jasmine.SpyObj<ToasterService> = jasmine.createSpyObj<
  ToasterService
>(['warn']);

describe('NetworkSettingsAuthGuard', () => {
  let service: NetworkSettingsAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkSettingsAuthGuard,
        { provide: ConfigsService, useValue: configsMock },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: routerMock },
        { provide: ToasterService, useValue: toasterServiceMock },
      ],
    });

    service = TestBed.inject(NetworkSettingsAuthGuard);
  });

  afterEach(() => {
    configsMock.get.calls.reset();
    sessionMock.isAdmin.calls.reset();
    routerMock.navigate.calls.reset();
    toasterServiceMock.warn.calls.reset();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should be able to active when user is admin on tenant network', () => {
      (service as any).session.isAdmin.and.returnValue(true);
      (service as any).configs.get.and.returnValue(true);

      expect(service.canActivate(null, null)).toBeTrue();
      expect((service as any).router.navigate).not.toHaveBeenCalledWith(['/']);
      expect((service as any).toaster.warn).not.toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to active when user is NOT admin on tenant network', () => {
      (service as any).session.isAdmin.and.returnValue(false);
      (service as any).configs.get.and.returnValue(true);

      expect(service.canActivate(null, null)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect((service as any).toaster.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to active when user is an admin, but NOT on tenant network', () => {
      (service as any).session.isAdmin.and.returnValue(true);
      (service as any).configs.get.and.returnValue(false);

      expect(service.canActivate(null, null)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect((service as any).toaster.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to active when user is NOT an admin, OR on a tenant network', () => {
      (service as any).session.isAdmin.and.returnValue(true);
      (service as any).configs.get.and.returnValue(false);

      expect(service.canActivate(null, null)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect((service as any).toaster.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });
  });
});
