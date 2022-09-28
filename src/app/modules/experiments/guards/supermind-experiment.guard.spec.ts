import { SupermindExperimentGuard } from './supermind-experiment.guard';

describe('SupermindExperimentGuard', () => {
  let service: SupermindExperimentGuard;

  let supermindExperimentMock = new (function() {
    this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
  })();

  let routerMock = new (function() {
    this.navigate = jasmine.createSpy('navigate');
  })();

  beforeEach(() => {
    service = new SupermindExperimentGuard(supermindExperimentMock, routerMock);
  });

  afterEach(() => {
    (service as any).supermindExperiment.isActive.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return that route can be activated if experiment is on', () => {
    (service as any).supermindExperiment.isActive.and.returnValue(true);
    expect(service.canActivate()).toBeTrue();
  });

  it('should return that route cannot be activated and redirect if experiment is off', () => {
    (service as any).supermindExperiment.isActive.and.returnValue(false);
    expect(service.canActivate()).toBeFalse();
    expect((service as any).router.navigate).toHaveBeenCalledWith(['/']);
  });
});
