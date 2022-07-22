// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { YoutubeMigrationConfigComponent } from './config.component';
// import { Session } from '../../../../services/session';
// import { sessionMock } from '../../../../../tests/session-mock.spec';
// import { YoutubeMigrationService } from '../youtube-migration.service';
// import { MockService } from '../../../../utils/mock';
// import { ToasterService } from '../../../../common/services/toaster.service';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';

// // let routerMock = new (function() {
// //   this.navigate = jasmine.createSpy('navigate');
// // })();

// describe('YoutubeMigrationConfigComponent', () => {
//   let component: YoutubeMigrationConfigComponent;
//   let fixture: ComponentFixture<YoutubeMigrationConfigComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [YoutubeMigrationConfigComponent],
//       imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
//       providers: [
//         { provide: Session, useValue: sessionMock },
//         {
//           provide: YoutubeMigrationService,
//           useValue: MockService(YoutubeMigrationService),
//         },
//         {
//           provide: ToasterService,
//           useValue: MockService(ToasterService),
//         },
//         // { provide: Router, useValue: routerMock },
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(YoutubeMigrationConfigComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
