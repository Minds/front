import { of } from 'rxjs';
import { EnvironmentSelectorService } from './environment-selector.service';

export let cookieServiceMock = new (function() {
  this.put = jasmine.createSpy('put');
  this.remove = jasmine.createSpy('remove');
})();

export let sessionMock = new (function() {
  this.isLoggedIn = jasmine.createSpy('isLoggedIn');
  this.getLoggedInUser = jasmine.createSpy('getLoggedInUser');
})();

export let apiServiceMock = new (function() {
  this.get = jasmine.createSpy('get');
  this.put = jasmine.createSpy('put');
  this.delete = jasmine.createSpy('delete');
})();

export let configsServiceMock = new (function() {
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

    (service as any).reloadPage = () => null;

    (service as any).api.delete.calls.reset();
    (service as any).cookies.put.calls.reset();
    (service as any).cookies.remove.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should determine whether canary option should be shown', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    expect(service.shouldShowCanaryOption()).toBeTrue();
  });

  it('should determine whether canary option should NOT be shown', () => {
    (service as any).session.isLoggedIn.and.returnValue(false);
    expect(service.shouldShowCanaryOption()).toBeFalse();
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

  it('should determine whether canary is enabled by logged in user', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: true }));

    await expectAsync(service.isCanaryEnabled()).toBeResolvedTo(true);
  });

  it('should determine whether canary is disabled by logged in user', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: false }));

    await expectAsync(service.isCanaryEnabled()).toBeResolvedTo(false);
  });

  it('should determine whether canary is enabled by for logged out user by cookie', async () => {
    (service as any).session.isLoggedIn.and.returnValue(false);
    (service as any).configs.get.and.returnValue('canary');

    await expectAsync(service.isCanaryEnabled()).toBeResolvedTo(true);
  });

  it('should switch environment to production and disable canary', async () => {
    (service as any).session.isLoggedIn.and.returnValue(false);
    (service as any).configs.get.and.returnValue('production');

    await expectAsync(service.isCanaryEnabled()).toBeResolvedTo(false);
  });

  it('should switch environment to production and disable canary if it is enabled', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: true }));
    (service as any).api.delete.and.returnValue(of({ status: 'success' }));

    await service.switchToEnvironment('production');

    expect((service as any).api.delete).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.remove).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.put).toHaveBeenCalledWith('canary', '0', {
      path: '/',
    });
  });

  it('should switch environment to production and NOT disable canary if it is NOT enabled', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: false }));

    await service.switchToEnvironment('production');

    expect((service as any).api.delete).not.toHaveBeenCalledWith(
      'api/v2/canary'
    );
    expect((service as any).cookies.remove).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.put).not.toHaveBeenCalledWith(
      'canary',
      '0',
      { path: '/' }
    );
  });

  it('should switch environment to canary', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: false }));
    (service as any).api.put.and.returnValue(of({ status: 'success' }));

    await service.switchToEnvironment('canary');

    expect((service as any).api.delete).not.toHaveBeenCalledWith(
      'api/v2/canary'
    );
    expect((service as any).cookies.remove).toHaveBeenCalledWith('staging');
    expect((service as any).api.put).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.put).not.toHaveBeenCalledWith(
      'canary',
      '0',
      { path: '/' }
    );
  });

  it('should switch environment to staging', async () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).api.get.and.returnValue(of({ enabled: true }));
    (service as any).api.delete.and.returnValue(of({ status: 'success' }));

    await service.switchToEnvironment('staging');

    expect((service as any).api.delete).toHaveBeenCalledWith('api/v2/canary');
    expect((service as any).cookies.remove).toHaveBeenCalledWith('staging');
    expect((service as any).cookies.put).toHaveBeenCalledWith('canary', '0', {
      path: '/',
    });
    expect((service as any).cookies.put).toHaveBeenCalledWith('staging', '1', {
      path: '/',
    });
  });
});
