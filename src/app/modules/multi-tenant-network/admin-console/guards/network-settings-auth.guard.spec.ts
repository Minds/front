import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { NetworkSettingsAuthGuard } from './network-settings-auth.guard';
import { PermissionsService } from '../../../../common/services/permissions.service';

const configsMock: jasmine.SpyObj<ConfigsService> =
  jasmine.createSpyObj<ConfigsService>(['get']);
const sessionMock: jasmine.SpyObj<Session> = jasmine.createSpyObj<Session>([
  'isAdmin',
  'isLoggedIn',
]);
const routerMock: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>([
  'navigate',
]);
const toasterServiceMock: jasmine.SpyObj<ToasterService> =
  jasmine.createSpyObj<ToasterService>(['warn']);
const permissionsMock: jasmine.SpyObj<PermissionsService> =
  jasmine.createSpyObj<PermissionsService>(['canModerateContent']);

describe('NetworkSettingsAuthGuard', () => {
  let service: NetworkSettingsAuthGuard;
  let mockRouterStateSnapshot: RouterStateSnapshot;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkSettingsAuthGuard,
        { provide: ConfigsService, useValue: configsMock },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: routerMock },
        { provide: ToasterService, useValue: toasterServiceMock },
        { provide: PermissionsService, useValue: permissionsMock },
      ],
    });

    service = TestBed.inject(NetworkSettingsAuthGuard);
    mockRouterStateSnapshot = { url: '/some-url' } as RouterStateSnapshot; // Mock RouterStateSnapshot
    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot; // Mock ActivatedRouteSnapshot
  });

  afterEach(() => {
    configsMock.get.calls.reset();
    sessionMock.isAdmin.calls.reset();
    sessionMock.isLoggedIn.calls.reset();
    routerMock.navigate.calls.reset();
    toasterServiceMock.warn.calls.reset();
    permissionsMock.canModerateContent.calls.reset();
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should be able to activate when user is admin on tenant network', () => {
      sessionMock.isAdmin.and.returnValue(true);
      configsMock.get.and.returnValue(true);

      expect(
        service.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      ).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).not.toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to activate when user is NOT admin and does NOT have canModerateContent permission on tenant network', () => {
      sessionMock.isAdmin.and.returnValue(false);
      permissionsMock.canModerateContent.and.returnValue(false);
      sessionMock.isLoggedIn.and.returnValue(true);
      configsMock.get.and.returnValue(true);

      expect(
        service.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      ).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to activate when user is an admin, but NOT on tenant network', () => {
      sessionMock.isAdmin.and.returnValue(true);
      configsMock.get.and.returnValue(false);
      sessionMock.isLoggedIn.and.returnValue(true);

      expect(
        service.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      ).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to activate when user is NOT an admin, OR on a tenant network', () => {
      sessionMock.isAdmin.and.returnValue(false);
      configsMock.get.and.returnValue(false);
      sessionMock.isLoggedIn.and.returnValue(true);

      expect(
        service.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)
      ).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should be able to activate for non-admin tenant users with canModerateContent permission on /moderation/reports route', () => {
      configsMock.get.and.returnValue(true);
      sessionMock.isAdmin.and.returnValue(false);
      permissionsMock.canModerateContent.and.returnValue(true);
      sessionMock.isLoggedIn.and.returnValue(true);

      const routeMock: any = { url: '/moderation/reports' };
      const stateMock: RouterStateSnapshot = {
        url: '/moderation/reports',
      } as RouterStateSnapshot;

      expect(service.canActivate(routeMock, stateMock)).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).not.toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to activate for non-admin tenant users without canModerateContent permission on /moderation/reports route', () => {
      configsMock.get.and.returnValue(true);
      sessionMock.isAdmin.and.returnValue(false);
      permissionsMock.canModerateContent.and.returnValue(false);
      sessionMock.isLoggedIn.and.returnValue(true);
      const routeMock: any = { url: '/moderation/reports' };

      expect(
        service.canActivate(routeMock, mockRouterStateSnapshot)
      ).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(toasterServiceMock.warn).toHaveBeenCalledWith(
        'You do not have permission to access this route.'
      );
    });

    it('should NOT be able to activate for not logged in tenant users', () => {
      configsMock.get.and.returnValue(true);
      sessionMock.isAdmin.and.returnValue(false);
      permissionsMock.canModerateContent.and.returnValue(false);
      sessionMock.isLoggedIn.and.returnValue(false);
      const routeMock: any = { url: '/general' };

      expect(
        service.canActivate(routeMock, mockRouterStateSnapshot)
      ).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirectUrl: mockRouterStateSnapshot.url },
      });
    });
  });

  it('should redirect to moderation reports for non-admin tenant users with canModerateContent permission on non-moderation route', () => {
    configsMock.get.and.returnValue(true);
    sessionMock.isAdmin.and.returnValue(false);
    permissionsMock.canModerateContent.and.returnValue(true);
    mockRouterStateSnapshot.url = '/network/admin/general';

    const canActivate = service.canActivate(
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/network/admin/moderation/reports',
    ]);
    expect(toasterServiceMock.warn).not.toHaveBeenCalled();
  });
});
