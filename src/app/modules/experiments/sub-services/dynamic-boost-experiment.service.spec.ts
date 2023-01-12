// ojm uncomment
// import { DynamicBoostExperimentService } from './dynamic-boost-experiment.service';

// export let experimentsServiceMock = new (function() {
//   this.hasVariation = jasmine.createSpy('hasVariation');
// })();

// describe('DynamicBoostExperimentService', () => {
//   let service: DynamicBoostExperimentService;

//   beforeEach(() => {
//     jasmine.clock().uninstall();
//     jasmine.clock().install();

//     service = new DynamicBoostExperimentService(experimentsServiceMock);
//   });

//   afterEach(() => {
//     jasmine.clock().uninstall();
//   });

//   it('should be instantiated', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should return true if experiment is active', () => {
//     (service as any).experiments.hasVariation.and.returnValue(true);
//     expect(service.isActive()).toBeTruthy();
//     expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
//       'epic-293-dynamic-boost',
//       true
//     );
//   });

//   it('should return false if experiment is NOT active', () => {
//     (service as any).experiments.hasVariation.and.returnValue(false);
//     expect(service.isActive()).toBeFalsy();
//     expect((service as any).experiments.hasVariation).toHaveBeenCalledWith(
//       'epic-293-dynamic-boost',
//       true
//     );
//   });
// });
