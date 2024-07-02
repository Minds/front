import { TestBed } from '@angular/core/testing';
import { ComposerBoostService } from './boost.service';
import { BoostModalV2LazyService } from '../../boost/modal-v2/boost-modal-v2-lazy.service';
import { MockService } from '../../../utils/mock';
import { BoostableEntity } from '../../boost/modal-v2/boost-modal-v2.types';

describe('ComposerBoostService', () => {
  let service: ComposerBoostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComposerBoostService,
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
      ],
    });

    service = TestBed.inject(ComposerBoostService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should reset', () => {
    service.isBoostMode$.next(true);
    service.reset();
    expect(service.isBoostMode$.getValue()).toBeFalse();
  });

  it('should open boost modal', () => {
    const activity: BoostableEntity = {
      guid: '123',
      type: 'activity',
    };
    service.openBoostModal(activity);
    expect((service as any).boostModal.open).toHaveBeenCalledWith(activity);
  });
});
