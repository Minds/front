import { TestBed } from '@angular/core/testing';
import { MembershipsCountService } from './membership-count.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';

describe('MembershipsCountService', () => {
  let service: MembershipsCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MembershipsCountService,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    service = TestBed.inject(MembershipsCountService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should incremenet membership count', () => {
    service.count$.next(0);
    service.incrementMembershipCount();
    expect(service.count$.getValue()).toBe(1);
  });

  it('should decrement membership count', () => {
    service.count$.next(1);
    service.decrementMembershipCount();
    expect(service.count$.getValue()).toBe(0);
  });

  it('should NOT decrement the membership count past 0', () => {
    service.count$.next(0);
    service.decrementMembershipCount();
    expect(service.count$.getValue()).toBe(0);
  });
});
