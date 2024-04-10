import { of, throwError } from 'rxjs';
import { RestrictedAddressService } from './restricted-address.service';

let apiMock = new (function () {
  this.get = jasmine.createSpy('get');
})();

describe('RestrictedAddressService', () => {
  let service: RestrictedAddressService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new RestrictedAddressService(apiMock);
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check and return false if wallet is not restricted', (done) => {
    (service as any).api.get.and.returnValue(
      of({
        status: 'success',
      })
    );

    const address = '0x00';

    service.isRestricted(address).subscribe((response) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/rewards/check/${address}`
      );
      expect(response).toBe(false);
      done();
    });
  });

  it('should check and return true if endpoint returns non success stats', (done) => {
    (service as any).api.get.and.returnValue(
      of({
        status: 'error',
      })
    );

    const address = '0x00';

    service.isRestricted(address).subscribe((response) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/rewards/check/${address}`
      );
      expect(response).toBe(true);
      done();
    });
  });

  it('should check and return true if endpoint causes error to be thrown', (done) => {
    (service as any).api.get.and.returnValue(
      throwError('Expected error thrown')
    );

    const address = '0x00';

    service.isRestricted(address).subscribe((response) => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/rewards/check/${address}`
      );
      expect(response).toBe(true);
      done();
    });
  });
});
