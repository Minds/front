// ojm scavenge things to use in policyform
// import {
//   ComponentFixture,
//   TestBed,
//   fakeAsync,
//   tick,
// } from '@angular/core/testing';
// import { BehaviorSubject, of, throwError } from 'rxjs';
// import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
// import { ToasterService } from '../../../../../../common/services/toaster.service';
// import { NetworkAdminConsoleModerationGuidelinesComponent } from './moderation-guidelines.component';
// import { MockService } from '../../../../../../utils/mock';
// import { FormBuilder } from '@angular/forms';
// import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
// import { multiTenantConfigMock } from '../../../../../../mocks/responses/multi-tenant-config.mock';

// describe('NetworkAdminConsoleModerationGuidelinesComponent', () => {
//   let comp: NetworkAdminConsoleModerationGuidelinesComponent;
//   let fixture: ComponentFixture<NetworkAdminConsoleModerationGuidelinesComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [NetworkAdminConsoleModerationGuidelinesComponent],
//       providers: [
//         {
//           provide: MultiTenantNetworkConfigService,
//           useValue: MockService(MultiTenantNetworkConfigService, {
//             has: ['config$'],
//             props: {
//               config$: {
//                 get: () =>
//                   new BehaviorSubject<MultiTenantConfig>(multiTenantConfigMock),
//               },
//             },
//           }),
//         },
//         FormBuilder,
//         { provide: ToasterService, useValue: MockService(ToasterService) },
//       ],
//     });

//     fixture = TestBed.createComponent(
//       NetworkAdminConsoleModerationGuidelinesComponent
//     );
//     comp = fixture.componentInstance;

//     (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
//   });

//   describe('init', () => {
//     it('should init', fakeAsync(() => {
//       expect(comp).toBeTruthy();
//     }));

//     it('should set the community guidelines form control on init', fakeAsync(() => {
//       comp.ngOnInit();
//       tick();
//       expect(comp.communityGuidelinesFormControl.value).toBe(
//         multiTenantConfigMock.communityGuidelines
//       );
//     }));
//   });

//   describe('onSubmit', () => {
//     it('should show an error message if submitted while form is pristine', fakeAsync(() => {
//       comp.communityGuidelinesFormControl.markAsPristine();

//       comp.onSubmit();
//       tick();

//       expect((comp as any).toaster.error).toHaveBeenCalledWith(
//         'There are no changes to save'
//       );
//       expect(
//         (comp as any).multiTenantConfigService.updateConfig
//       ).not.toHaveBeenCalled();
//       expect((comp as any).toaster.success).not.toHaveBeenCalled();
//       expect((comp as any).formGroup.pristine).toBeTrue();
//     }));

//     it('should save the community guidelines and show a success message', fakeAsync(() => {
//       const communityGuidelines: string = 'Community Guidelines Test';
//       (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
//         of(true)
//       );
//       comp.communityGuidelinesFormControl.markAsDirty();
//       comp.communityGuidelinesFormControl.setValue(communityGuidelines);

//       comp.onSubmit();
//       tick();

//       expect((comp as any).toaster.error).not.toHaveBeenCalled();
//       expect(
//         (comp as any).multiTenantConfigService.updateConfig
//       ).toHaveBeenCalledWith({ communityGuidelines: communityGuidelines });
//       expect((comp as any).toaster.success).toHaveBeenCalledWith(
//         'Network community guidelines updated'
//       );
//       expect((comp as any).formGroup.pristine).toBeTrue();
//     }));

//     it('should remove the community guidelines and show a success message', fakeAsync(() => {
//       const communityGuidelines: string = '';
//       (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
//         of(true)
//       );
//       comp.communityGuidelinesFormControl.markAsDirty();
//       comp.communityGuidelinesFormControl.setValue(communityGuidelines);

//       comp.onSubmit();
//       tick();

//       expect((comp as any).toaster.error).not.toHaveBeenCalled();
//       expect(
//         (comp as any).multiTenantConfigService.updateConfig
//       ).toHaveBeenCalledWith({ communityGuidelines: communityGuidelines });
//       expect((comp as any).toaster.success).toHaveBeenCalledWith(
//         'Network community guidelines removed'
//       );
//       expect((comp as any).formGroup.pristine).toBeTrue();
//     }));

//     it('should show an error message if an unknown error occurs', fakeAsync(() => {
//       const communityGuidelines: string = 'Community Guidelines Test';
//       const errorMessage: string = 'Test Error';
//       (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
//         throwError(() => errorMessage)
//       );
//       comp.communityGuidelinesFormControl.markAsDirty();
//       comp.communityGuidelinesFormControl.setValue(communityGuidelines);

//       comp.onSubmit();
//       tick();

//       expect((comp as any).toaster.error).toHaveBeenCalled();
//       expect(
//         (comp as any).multiTenantConfigService.updateConfig
//       ).toHaveBeenCalledWith({ communityGuidelines: communityGuidelines });
//       expect((comp as any).toaster.success).not.toHaveBeenCalled();
//       expect((comp as any).formGroup.pristine).toBeFalse();
//     }));
//   });
// });
