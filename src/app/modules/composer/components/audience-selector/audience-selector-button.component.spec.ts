// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { MockComponent, MockService } from '../../../../utils/mock';
// import { TitleBarComponent } from './title-bar.component';
// import { ComposerService } from '../../services/composer.service';

// describe('Composer Title Bar', () => {
//   let comp: TitleBarComponent;
//   let fixture: ComponentFixture<TitleBarComponent>;

//   let containerGuid;

//   const composerServiceMock: any = MockService(ComposerService, {
//     getContainerGuid: () => containerGuid,
//   });

//   beforeEach(
//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         declarations: [
//           TitleBarComponent,
//           MockComponent({
//             selector: 'm-icon',
//             inputs: ['from', 'iconId', 'sizeFactor'],
//           }),
//         ],
//         providers: [
//           {
//             provide: ComposerService,
//             useValue: composerServiceMock,
//           },
//         ],
//       }).compileComponents();
//     })
//   );

//   beforeEach(done => {
//     jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
//     fixture = TestBed.createComponent(TitleBarComponent);
//     comp = fixture.componentInstance;
//     fixture.detectChanges();

//     if (fixture.isStable()) {
//       done();
//     } else {
//       fixture.whenStable().then(() => {
//         fixture.detectChanges();
//         done();
//       });
//     }
//   });
// });
