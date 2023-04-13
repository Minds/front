import { TestBed } from '@angular/core/testing';
import {
  ExperimentCacheObject,
  ExperimentsCacheService,
} from '../../modules/experiments/experiments-cache.service';
import { MockService } from '../../utils/mock';
import { FeatureDefinition } from '@growthbook/growthbook';
import { ObjectLocalStorageService } from '../../common/services/object-local-storage.service';

const mockFeature1: FeatureDefinition = {
  feature1: {
    defaultValue: false,
    rules: [
      {
        force: true,
      },
    ],
  },
};

const mockFeature2: FeatureDefinition = {
  feature2: {
    defaultValue: true,
  },
};

const mockExperiment1: FeatureDefinition = {
  experiment1: {
    defaultValue: true,
    rules: [
      {
        variations: [true, false],
        weights: [0.5, 0.5],
        hashAttribute: 'id',
      },
    ],
  },
};

const mockExperiment2: FeatureDefinition = {
  experiment2: {
    defaultValue: false,
    rules: [
      {
        force: true,
      },
      {
        variations: [false, true],
        weights: [0.5, 0.5],
        key: 'experiment2',
        hashAttribute: 'id',
      },
    ],
  },
};

const mockCachedExperimentResult1: ExperimentCacheObject = {
  experiment1: {
    result: {
      value: true,
      on: true,
      off: false,
      source: 'experiment',
      experiment: {
        variations: [true, false],
        key: 'experiment2',
        weights: [0.5, 0.5],
        hashAttribute: 'id',
      },
      experimentResult: {
        inExperiment: true,
        variationId: 0,
        value: true,
        hashAttribute: 'id',
        hashValue: '1285556899399340038',
      },
    },
    updated_timestamp: 1681398146725,
  },
};

const mockCachedExperimentResult2: ExperimentCacheObject = {
  experiment2: {
    result: {
      value: true,
      on: true,
      off: false,
      source: 'experiment',
      experiment: {
        variations: [true, false],
        key: 'experiment2',
        weights: [0.5, 0.5],
        hashAttribute: 'id',
      },
      experimentResult: {
        inExperiment: true,
        variationId: 0,
        value: true,
        hashAttribute: 'id',
        hashValue: '1285556899399340038',
      },
    },
    updated_timestamp: 1681398146725,
  },
};

describe('ExperimentsCacheService', () => {
  let service: ExperimentsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExperimentsCacheService,
        {
          provide: ObjectLocalStorageService,
          useValue: MockService(ObjectLocalStorageService),
        },
      ],
    });
    service = TestBed.inject(ExperimentsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a result', () => {
    const experimentId: string = 'experiment1';
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });
    expect(service.getResult(experimentId)).toBe(
      mockCachedExperimentResult1[experimentId]
    );
  });

  it('should get null result when not found', () => {
    const experimentId: string = 'experiment1239';
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });
    expect(service.getResult(experimentId)).toBeUndefined();
  });

  it('should set a result', () => {
    const experimentId: string = 'experiment1';
    service.setResult(experimentId, mockExperiment1);

    expect(
      (service as any).objectLocalStorageService.setSingle
    ).toHaveBeenCalledWith((service as any).storageKey, {
      [experimentId]: {
        result: mockExperiment1,
        updated_timestamp: jasmine.any(Number),
      },
    });
  });

  it('should NOT prune items from cache when not necessary', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
      ...mockExperiment2,
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).not.toHaveBeenCalled();
  });

  it('should prune item from cache when there is no matching feature', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).toHaveBeenCalledWith(
      (service as any).storageKey,
      Object.keys(mockCachedExperimentResult2)[0]
    );
  });

  it('should prune item from cache when there is a matching feature with NO rules', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
      ...{
        experiment2: {
          defaultValue: false,
        },
      },
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).toHaveBeenCalledWith(
      (service as any).storageKey,
      Object.keys(mockCachedExperimentResult2)[0]
    );
  });

  it('should prune item from cache when there is a matching feature with empty rules', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
      ...{
        experiment2: {
          defaultValue: false,
          rules: [],
        },
      },
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).toHaveBeenCalledWith(
      (service as any).storageKey,
      Object.keys(mockCachedExperimentResult2)[0]
    );
  });

  it('should prune item from cache when there is a matching feature with rules with no variations', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
      ...{
        experiment2: {
          defaultValue: true,
          rules: [
            {
              variations: [],
              weights: [0.5, 0.5],
              hashAttribute: 'id',
            },
          ],
        },
      },
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).toHaveBeenCalledWith(
      (service as any).storageKey,
      Object.keys(mockCachedExperimentResult2)[0]
    );
  });

  it('should prune item from cache when there is a matching feature with rules with 1 variations', () => {
    (service as any).objectLocalStorageService.getAll.and.returnValue({
      ...mockCachedExperimentResult1,
      ...mockCachedExperimentResult2,
    });

    service.pruneRemovedFeatures({
      ...mockFeature1,
      ...mockFeature2,
      ...mockExperiment1,
      ...{
        experiment2: {
          defaultValue: true,
          rules: [
            {
              variations: [true],
              weights: [1],
              hashAttribute: 'id',
            },
          ],
        },
      },
    });

    expect(
      (service as any).objectLocalStorageService.removeSingle
    ).toHaveBeenCalledWith(
      (service as any).storageKey,
      Object.keys(mockCachedExperimentResult2)[0]
    );
  });
});
