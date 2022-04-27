import { ObjectLocalStorageService } from './object-local-storage.service';

describe('ObjectLocalStorageService', () => {
  let service: ObjectLocalStorageService;

  beforeEach(() => {
    service = new ObjectLocalStorageService('browser');
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });
});
