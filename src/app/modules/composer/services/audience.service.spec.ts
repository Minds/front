import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { ComposerAudienceSelectorService } from './audience.service';
import { MockService } from '../../../utils/mock';

describe('ComposerAudienceSelectorService', () => {
  let service: ComposerAudienceSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComposerAudienceSelectorService,
        { provide: ApiService, useValue: MockService(ApiService) },
      ],
    });

    service = TestBed.get(ComposerAudienceSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch groups', (done: DoneFn) => {
    const mockResponse = {
      'load-next': 123,
      groups: [{ guid: '1', type: 'group', name: 'Group 1' }],
    };

    (service as any).api.get.and.returnValue(of(mockResponse));

    service.groupsPage$.subscribe(response => {
      expect(response).toEqual(mockResponse.groups);
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v1/groups/member',
        {
          offset: 0,
          limit: 12,
        }
      );
      done();
    });
  });

  it('should handle errors when fethcing groups', (done: DoneFn) => {
    (service as any).api.get.and.returnValue(
      throwError(() => new Error('error'))
    );

    service.groupsPage$.subscribe(response => {
      expect(response).toBeNull();
      expect((service as any).api.get).toHaveBeenCalledWith(
        'api/v1/groups/member',
        {
          offset: 0,
          limit: 12,
        }
      );
      done();
    });
  });

  it('should load the next batch of groups', () => {
    const nextPagingToken = 12;
    (service as any).groupsNextPagingToken$.next(nextPagingToken);

    (service as any).loadNextGroups();

    expect((service as any).groupsPagingToken$.getValue()).toBe(
      nextPagingToken
    );
  });

  it('should reset the state', () => {
    (service as any).groupsPagingToken$.next(12);
    (service as any).groupsNextPagingToken$.next(24);

    service.reset();

    expect((service as any).groupsPagingToken$.getValue()).toBe(0);
    expect((service as any).groupsNextPagingToken$.getValue()).toBe(0);
  });
});
