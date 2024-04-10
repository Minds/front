import { TestBed } from '@angular/core/testing';
import { GiftCardClaimExperimentGuard } from './gift-card-claim-experiment.guard';
import { MockService } from '../../../utils/mock';
import { ExperimentsService } from '../experiments.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../common/services/toaster.service';

describe('GiftCardClaimExperimentGuard', () => {
  let service: GiftCardClaimExperimentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftCardClaimExperimentGuard,
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(GiftCardClaimExperimentGuard);
  });

  it('SHOULD allow activation when experiment is ON', () => {
    expect(service.canActivate()).toBeTruthy();

    expect((service as any).toast.warn).not.toHaveBeenCalled();
    expect((service as any).router.navigate).not.toHaveBeenCalled();
  });
});
