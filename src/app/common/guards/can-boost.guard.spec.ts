import { TestBed } from '@angular/core/testing';
import { ConfigsService } from '../services/configs.service';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { boostEnabledGuard } from './can-boost.guard';

describe('boostEnabledGuard', () => {
  const configServiceMock: jasmine.SpyObj<ConfigsService> =
    jasmine.createSpyObj<ConfigsService>(['get']);
  const toasterServiceMock: jasmine.SpyObj<ToasterService> =
    jasmine.createSpyObj<ToasterService>(['warn']);
  const routerMock: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>([
    'navigateByUrl',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigsService, useValue: configServiceMock },
        { provide: ToasterService, useValue: toasterServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    configServiceMock.get.calls.reset();
    toasterServiceMock.warn.calls.reset();
    routerMock.navigateByUrl.calls.reset();
  });

  it('should return true when no tenant config is returned', () => {
    configServiceMock.get.and.returnValue(null);
    expect(
      TestBed.runInInjectionContext(() => boostEnabledGuard()(null, null))
    ).toBeTrue();
  });

  it('should return true when tenant config is returned with boost_enabled true', () => {
    configServiceMock.get.and.returnValue({ boost_enabled: true });
    expect(
      TestBed.runInInjectionContext(() => boostEnabledGuard()(null, null))
    ).toBeTrue();
  });

  it('should return false when tenant config is returned with boost_enabled false', () => {
    configServiceMock.get.and.returnValue({ boost_enabled: false });
    expect(
      TestBed.runInInjectionContext(() => boostEnabledGuard()(null, null))
    ).toBeFalse();
    expect(toasterServiceMock.warn).toHaveBeenCalledWith(
      'Boosting is not currently enabled'
    );
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should return false when tenant config is returned with boost_enabled false and redirect to passed path', () => {
    const redirectPath: string = '/path';

    configServiceMock.get.and.returnValue({ boost_enabled: false });
    expect(
      TestBed.runInInjectionContext(() =>
        boostEnabledGuard(redirectPath)(null, null)
      )
    ).toBeFalse();
    expect(toasterServiceMock.warn).toHaveBeenCalledWith(
      'Boosting is not currently enabled'
    );
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(redirectPath);
  });
});
