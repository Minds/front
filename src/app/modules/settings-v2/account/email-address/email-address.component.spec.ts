// import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Client } from '../../../../services/api';
// import { clientMock } from '../../../../../tests/client-mock.spec';
// import { FormToastService } from '../../../../common/services/form-toast.service';
// import { MockService } from '../../../../utils/mock';
// import { Session } from '../../../../services/session';
// import { sessionMock } from '../../../../../tests/session-mock.spec';
// import { SettingsV2EmailAddressComponent } from './email-address.component';
// import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
// import { SettingsV2Service } from '../../settings-v2.service';

// describe('SettingsV2EmailAddressComponent', () => {
//   let component: SettingsV2EmailAddressComponent;
//   let fixture: ComponentFixture<SettingsV2EmailAddressComponent>;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [SettingsV2EmailAddressComponent],
//       providers: [
//         { provide: Client, useValue: clientMock },
//         { provide: Session, useValue: sessionMock },
//         { provide: FormToastService, useValue: MockService(FormToastService) },
//         { provide: DialogService, useValue: MockService(DialogService) },
//         {
//           provide: SettingsV2Service,
//           useValue: MockService(SettingsV2Service),
//         },
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SettingsV2EmailAddressComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
