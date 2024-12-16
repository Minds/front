import { of } from 'rxjs';
import { EnvironmentSelectorService } from './environment-selector.service';

export let cookieServiceMock = new (function () {
  this.get = jasmine.createSpy('get');
  this.set = jasmine.createSpy('set');
  this.delete = jasmine.createSpy('delete');
})();

export let sessionMock = new (function () {
  this.isLoggedIn = jasmine.createSpy('isLoggedIn');
  this.getLoggedInUser = jasmine.createSpy('getLoggedInUser');
})();

export let apiServiceMock = new (function () {
  this.get = jasmine.createSpy('get');
  this.put = jasmine.createSpy('put');
  this.delete = jasmine.createSpy('delete');
})();

export let configsServiceMock = new (function () {
  this.get = jasmine.createSpy('get');
})();

describe('EnvironmentSelectorService', () => {
  let service: EnvironmentSelectorService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    service = new EnvironmentSelectorService(
      cookieServiceMock,
      sessionMock,
      apiServiceMock,
      configsServiceMock
    );

    // override fn behavior as it performs window.navigate which breaks the testbed.
    (service as any).reloadPage = () => void 0;

    (service as any).api.get.calls.reset();
    (service as any).api.put.calls.reset();
    (service as any).api.delete.calls.reset();

    (service as any).cookies.get.calls.reset();
    (service as any).cookies.set.calls.reset();
    (service as any).cookies.delete.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should determine whether staging is enabled', () => {
    (service as any).configs.get.and.returnValue('staging');
    expect(service.isStagingEnabled()).toBeTrue();
  });

  it('should determine whether staging is NOT enabled', () => {
    (service as any).configs.get.and.returnValue('canary');
    expect(service.isStagingEnabled()).toBeFalse();

    (service as any).configs.get.and.returnValue('production');
    expect(service.isStagingEnabled()).toBeFalse();
  });

  it('should determine whether canary is enabled', () => {
    (service as any).configs.get.and.returnValue('canary');
    expect(service.isCanaryEnabled()).toBeTrue();
  });

  it('should determine whether canary is NOT enabled', () => {
    (service as any).configs.get.and.returnValue('staging');
    expect(service.isCanaryEnabled()).toBeFalse();

    (service as any).configs.get.and.returnValue('production');
    expect(service.isCanaryEnabled()).toBeFalse();
  });

  it('should switch environment to production and disable canary if it is enabled when user is logged in', async () => {
    (service as any).configs.get.and.returnValue('canary');
    (service as any).api.delete.and.returnValue(of({ status: 'success' }));
    (service as any).session.isLoggedIn.and.returnValue(true);

    await service.switchToEnvironment('production');

    expect((service as any).api.delete).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.delete).toHaveBeenCalledWith('staging');
  });

  it('should switch environment to production and disable canary if it is enabled when user is NOT logged in', async () => {
    (service as any).configs.get.and.returnValue('canary');
    (service as any).api.delete.and.returnValue(of({ status: 'success' }));
    (service as any).session.isLoggedIn.and.returnValue(false);

    await service.switchToEnvironment('production');

    expect((service as any).api.delete).not.toHaveBeenCalledWith(
      'api/v2/canary'
    );
    expect((service as any).cookies.delete).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.set).toHaveBeenCalledWith('canary', '0', {
      path: '/',
    });
  });

  it('should switch environment to production and NOT disable canary if it is NOT enabled', async () => {
    (service as any).configs.get.and.returnValue('staging');

    await service.switchToEnvironment('production');

    expect((service as any).api.delete).not.toHaveBeenCalledWith(
      'api/v2/canary'
    );
    expect((service as any).cookies.delete).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.set).not.toHaveBeenCalledWith(
      'canary',
      '0',
      { path: '/' }
    );
  });

  it('should switch environment to canary', async () => {
    (service as any).configs.get.and.returnValue('staging');
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: false }));
    (service as any).api.put.and.returnValue(of({ status: 'success' }));

    await service.switchToEnvironment('canary');

    expect((service as any).api.delete).not.toHaveBeenCalledWith(
      'api/v2/canary'
    );
    expect((service as any).cookies.delete).toHaveBeenCalledWith('staging');
    expect((service as any).api.put).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.set).not.toHaveBeenCalledWith(
      'canary',
      '0',
      { path: '/' }
    );
  });

  it('should switch environment to staging', async () => {
    (service as any).configs.get.and.returnValue('canary');
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: true }));
    (service as any).api.delete.and.returnValue(of({ status: 'success' }));

    await service.switchToEnvironment('staging');

    expect((service as any).api.delete).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.delete).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.set).toHaveBeenCalledWith('staging', '1', {
      path: '/',
    });
  });
});
