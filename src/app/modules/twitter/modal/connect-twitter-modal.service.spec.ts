import { ConnectTwitterModalService } from './connect-twitter-modal.service';

describe('ConnectTwitterModalService', () => {
  let service: ConnectTwitterModalService;

  let injectorMock = new (function () {})();

  let modalMock = new (function () {
    this.present = jasmine.createSpy('present');
  })();

  beforeEach(() => {
    service = new ConnectTwitterModalService(injectorMock, modalMock);
  });

  afterEach(() => {
    (service as any).modal.present.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
