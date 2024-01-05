// import {
//   ComponentFixture,
//   TestBed,
//   fakeAsync,
//   tick,
// } from '@angular/core/testing';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { MockService } from '../../../../../utils/mock';
// import { MultiTenantNetworkConfigService } from '../../../services/config.service';
// import { ToasterService } from '../../../../../common/services/toaster.service';
// import { MetaService } from '../../../../../common/services/meta.service';
// import { multiTenantConfigMock } from '../../../../../mocks/responses/multi-tenant-config.mock';
// import { NetworkAdminConsoleGeneralComponent } from './federation-settings.component';
// import { ConfigsService } from '../../../../../common/services/configs.service';
// import { BehaviorSubject, of } from 'rxjs';
// import { MultiTenantConfig } from '../../../../../../graphql/generated.engine';

// describe('NetworkAdminConsoleGeneralComponent', () => {
//   let comp: NetworkAdminConsoleGeneralComponent;
//   let fixture: ComponentFixture<NetworkAdminConsoleGeneralComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [NetworkAdminConsoleGeneralComponent],
//       imports: [ReactiveFormsModule],
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
//         { provide: MetaService, useValue: MockService(MetaService) },
//         { provide: ConfigsService, useValue: MockService(ConfigsService) },
//       ],
//     });

//     fixture = TestBed.createComponent(NetworkAdminConsoleGeneralComponent);
//     comp = fixture.componentInstance;

//     (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
//   });

//   it('should create the component', fakeAsync(() => {
//     expect(comp).toBeTruthy();
//     comp.ngOnInit();
//     tick();

//     expect(comp.networkNameFormControl.getRawValue()).toBe(
//       multiTenantConfigMock.siteName
//     );
//   }));

//   describe('onSubmit', () => {
//     it('should submit changes', fakeAsync(() => {
//       const siteName: string = 'Test site 2';
//       comp.networkNameFormControl.setValue(siteName);

//       (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
//         of(true)
//       );

//       comp.onSubmit();
//       tick();

//       expect((comp as any).configs.set).toHaveBeenCalledWith(
//         'site_name',
//         siteName
//       );
//       expect((comp as any).metaService.reset).toHaveBeenCalled();
//       expect((comp as any).toaster.success).toHaveBeenCalledWith(
//         'Successfully updated settings.'
//       );
//     }));
//   });
// });
