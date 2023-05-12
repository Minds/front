import { TestBed } from '@angular/core/testing';
import { ExperimentsService } from '../experiments.service';
import { SidebarV2ReorgExperimentService } from './front-5924-sidebar-v2-reorg.service';
import { MockService } from '../../../utils/mock';

describe('SidebarV2ReorgExperimentService', () => {
  let service: SidebarV2ReorgExperimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SidebarV2ReorgExperimentService,
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
      ],
    });
    service = TestBed.inject(SidebarV2ReorgExperimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return active variation', () => {
    (service as any).experiments.run.and.returnValue('0');
    expect(service.getActiveVariation()).toEqual(0);

    (service as any).experiments.run.and.returnValue('1');
    expect(service.getActiveVariation()).toEqual(1);

    (service as any).experiments.run.and.returnValue('2');
    expect(service.getActiveVariation()).toEqual(2);
  });

  it('should detect if a sidebar V2 variation is active', () => {
    (service as any).experiments.run.and.returnValue('1');
    expect(service.isSidebarV2VariationActive()).toBeTrue();

    (service as any).experiments.run.and.returnValue('2');
    expect(service.isSidebarV2VariationActive()).toBeTrue();

    (service as any).experiments.run.and.returnValue('0');
    expect(service.isSidebarV2VariationActive()).toBeFalse();
  });

  it('should detect if the reorg variation is active', () => {
    (service as any).experiments.run.and.returnValue('2');
    expect(service.isReorgVariationActive()).toBeTrue();

    (service as any).experiments.run.and.returnValue('1');
    expect(service.isReorgVariationActive()).toBeFalse();

    (service as any).experiments.run.and.returnValue('0');
    expect(service.isReorgVariationActive()).toBeFalse();
  });
});
