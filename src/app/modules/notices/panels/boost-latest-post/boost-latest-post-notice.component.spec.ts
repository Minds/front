// ojm do this
// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
//   waitForAsync,
// } from '@angular/core/testing';
// import { MockComponent, MockService } from '../../../../utils/mock';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
// import { Session } from '../../../../services/session';
// import { FeedNoticeService } from '../../services/feed-notice.service';
// import { Subject } from 'rxjs';
// import { BoostLatestPostNoticeComponent } from './boost-latest-post-notice.component';

// describe('BoostLatestPostNoticeComponent', () => {
//   let comp: BoostLatestPostNoticeComponent;
//   let fixture: ComponentFixture<BoostLatestPostNoticeComponent>;

//   const mockUser: { guid: string } = {
//     guid: '123',
//   };

//   beforeEach(
//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         imports: [RouterTestingModule],
//         declarations: [
//           BoostLatestPostNoticeComponent,
//           MockComponent({
//             selector: 'm-feedNotice',
//             inputs: ['icon', 'dismissible'],
//             outputs: ['dismissClick'],
//           }),
//           MockComponent({
//             selector: 'm-button',
//             inputs: ['color', 'solid', 'size'],
//             outputs: ['onAction'],
//           }),
//         ],
//         providers: [
//           {
//             provide: FeedNoticeService,
//             useValue: MockService(FeedNoticeService),
//           },
//           {
//             provide: BoostModalLazyService,
//             useValue: MockService(BoostModalLazyService, {
//               has: ['onComplete$'],
//               props: {
//                 onComplete$: { get: () => new Subject<boolean>() },
//               },
//             }),
//           },
//           {
//             provide: Session,
//             useValue: MockService(Session),
//           },
//         ],
//       }).compileComponents();
//     })
//   );

//   beforeEach(done => {
//     fixture = TestBed.createComponent(BoostLatestPostNoticeComponent);
//     comp = fixture.componentInstance;
//     fixture.detectChanges();

//     (comp as any).feedNotice.dismiss.calls.reset();
//     (comp as any).session.getLoggedInUser.calls.reset();
//     (comp as any).session.getLoggedInUser.and.returnValue(mockUser);

//     spyOn(window, 'open');

//     if (fixture.isStable()) {
//       done();
//     } else {
//       fixture.whenStable().then(() => {
//         fixture.detectChanges();
//         done();
//       });
//     }
//   });

//   it('should instantiate', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('should open boost modal on primary option click', () => {
//     comp.onPrimaryOptionClick();
//     expect((comp as any).session.getLoggedInUser).toHaveBeenCalledTimes(1);
//     expect((comp as any).boostModal.open).toHaveBeenCalledOnceWith(mockUser);
//   });

//   it('should call to dismiss on dismiss click', () => {
//     comp.onDismissClick();
//     expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
//       'boost-latest-post'
//     );
//   });

//   it('should dismiss on boost completion', fakeAsync(() => {
//     (comp as any).boostModal.onComplete$.next(true);
//     tick();
//     expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
//       'boost-latest-post'
//     );
//   }));
// });
