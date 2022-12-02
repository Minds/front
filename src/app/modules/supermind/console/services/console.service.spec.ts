import { of } from 'rxjs';
import { ApiResponse } from '../../../../common/api/api.service';
import { SupermindState } from '../../supermind.types';
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

  it('should get error when single supermind access is forbidden', (done: DoneFn) => {
    let listType = '123456789';
    const offset = 0;

    service.listType$.next(listType);
    (service as any).api.get.and.throwError({
      status: 403,
      error: { message: 'Error' },
    });

    service.getList$().subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}`,
        {}
      );
      expect(list as any).toEqual({ redirect: true, errorMessage: 'Error' });
      done();
    });
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

    service.getList$(12, offset).subscribe(list => {
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

  it('should get inbox list with status', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 12;
    const status = SupermindState.REVOKED;

    service.listType$.next('inbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$(12, offset, status).subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/inbox',
        {
          limit: 12,
          offset: offset,
          status: status,
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

    service.getList$(12, offset).subscribe(list => {
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

  it('should get outbox list with status', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }, { guid: 2 }, { guid: 3 }],
    };

    const offset = 12;
    const status = SupermindState.REVOKED;

    service.listType$.next('outbox');
    (service as any).api.get.and.returnValue(of(response));

    service.getList$(12, offset, status).subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v3/supermind/outbox',
        {
          limit: 12,
          offset: offset,
          status: status,
        }
      );
      expect(list).toEqual(response);
      done();
    });
  });

  it('should get single entity page', (done: DoneFn) => {
    const response: ApiResponse = {
      status: 'success',
      0: [{ guid: 1 }],
    };

    const listType = '123456789';

    service.listType$.next(listType);
    (service as any).api.get.and.returnValue(of(response));

    service.getList$().subscribe(list => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}`,
        {}
      );
      expect(list).toEqual(response);
      done();
    });
  });

  it('should get a count for inbox with no status', (done: DoneFn) => {
    const expectedCount: number = 999;
    const response: ApiResponse = {
      status: 'success',
      count: expectedCount,
    };
    const listType = 'inbox';

    service.listType$.next(listType);
    (service as any).api.get.and.returnValue(of(response));

    service.countAll$().subscribe(count => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}/count`,
        {}
      );
      expect(count).toEqual(expectedCount);
      done();
    });
  });

  it('should get a count for inbox with status', (done: DoneFn) => {
    const expectedCount: number = 999;
    const status: SupermindState = 7;
    const response: ApiResponse = {
      status: 'success',
      count: expectedCount,
    };
    const listType = 'inbox';

    service.listType$.next(listType);
    (service as any).api.get.and.returnValue(of(response));

    service.countAll$(status).subscribe(count => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}/count`,
        {
          status: status,
        }
      );
      expect(count).toEqual(expectedCount);
      done();
    });
  });

  it('should get a count for outbox with no status', (done: DoneFn) => {
    const expectedCount: number = 999;
    const response: ApiResponse = {
      status: 'success',
      count: expectedCount,
    };
    const listType = 'outbox';

    service.listType$.next(listType);
    (service as any).api.get.and.returnValue(of(response));

    service.countAll$().subscribe(count => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}/count`,
        {}
      );
      expect(count).toEqual(expectedCount);
      done();
    });
  });

  it('should get a count for outbox with status', (done: DoneFn) => {
    const expectedCount: number = 999;
    const status: SupermindState = 7;
    const response: ApiResponse = {
      status: 'success',
      count: expectedCount,
    };
    const listType = 'outbox';

    service.listType$.next(listType);
    (service as any).api.get.and.returnValue(of(response));

    service.countAll$(status).subscribe(count => {
      expect((service as any).api.get).toHaveBeenCalledWith(
        `api/v3/supermind/${listType}/count`,
        {
          status: status,
        }
      );
      expect(count).toEqual(expectedCount);
      done();
    });
  });

  it('should NOT call endpoint for single entity lists', (done: DoneFn) => {
    const expectedCount: number = 1;
    const listType = '123456789';

    service.listType$.next(listType);

    service.countAll$().subscribe(count => {
      expect((service as any).api.get).not.toHaveBeenCalled();
      expect(count).toEqual(expectedCount);
      done();
    });
  });

  it('should determine if value is a numeric string', () => {
    expect(service.isNumericListType('123')).toBeTrue();
  });

  it('should determine if value is a number', () => {
    expect(service.isNumericListType(123)).toBeTrue();
  });

  it('should determine if value is a non-numeric string', () => {
    expect(service.isNumericListType('inbox')).toBeFalse();
  });
});
