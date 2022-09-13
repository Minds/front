import { of } from 'rxjs';
import { ApiResponse } from '../../../common/api/api.service';
import { SupermindConsoleService } from './console.service';

describe('SupermindConsoleService', () => {
  let service: SupermindConsoleService;

  let apiMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  beforeEach(() => {
    service = new SupermindConsoleService(apiMock);
  });

  afterEach(() => {
    (service as any).api.get.calls.reset();
    service.listType$.next('inbox');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get inbox list without offset', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 0;

    service.listType$.next('inbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$().subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/inbox',
        {
          limit: 12,
          offset: offset,
        }
      );
      expect(list).toEqual(response);
      done();
    });
  });

  it('should get inbox list with offset', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 12;

    service.listType$.next('inbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$(offset).subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/inbox',
        {
          limit: 12,
          offset: offset,
        }
      );
      expect(list).toEqual(response);
      done();
    });
  });

  it('should get outbox list without offset', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 0;

    service.listType$.next('outbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$().subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/outbox',
        {
          limit: 12,
          offset: offset,
        }
      );
      expect(list).toEqual(response);
      done();
    });
  });

  it('should get outbox list with offset', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 12;

    service.listType$.next('outbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$(offset).subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/outbox',
        {
          limit: 12,
          offset: offset,
        }
      );
      expect(list).toEqual(response);
      done();
    });
  });
});
