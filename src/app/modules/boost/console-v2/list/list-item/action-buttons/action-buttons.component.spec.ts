// OJM TODO spec tests
// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
//   waitForAsync,
// } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { Session } from '../../../../../../services/session';
// import { MockComponent, MockService } from '../../../../../../utils/mock';
// import { SupermindReplyService } from '../../../../supermind-reply.service';
// import { Supermind, SupermindState } from '../../../../supermind.types';
// import { SupermindConsoleExpirationService } from '../../../services/supermind-expiration.service';
// import { SupermindConsoleActionButtonsComponent } from './action-buttons.component';

// describe('SupermindConsoleActionButtonsComponent', () => {
//   let comp: SupermindConsoleActionButtonsComponent;
//   let fixture: ComponentFixture<SupermindConsoleActionButtonsComponent>;

//   const mockSupermind: Supermind = {
//     guid: '123',
//     activity_guid: '234',
//     sender_guid: '345',
//     receiver_guid: '456',
//     status: 1,
//     payment_amount: 1,
//     payment_method: 1,
//     payment_txid: '567',
//     created_timestamp: 1662715004,
//     updated_timestamp: 1662715004,
//     expiry_threshold: 604800,
//     twitter_required: true,
//     reply_type: 1,
//     entity: { guid: '123' },
//   };

//   beforeEach(
//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         declarations: [
//           SupermindConsoleActionButtonsComponent,
//           MockComponent({
//             selector: 'm-button',
//             inputs: ['saving'],
//             outputs: ['onAction'],
//           }),
//         ],
//         providers: [
//           {
//             provide: SupermindConsoleExpirationService,
//             useValue: MockService(SupermindConsoleExpirationService),
//           },
//           {
//             provide: Session,
//             useValue: MockService(Session),
//           },
//           {
//             provide: Router,
//             useValue: MockService(Router),
//           },
//         ],
//       })
//         .overrideProvider(SupermindReplyService, {
//           useValue: MockService(SupermindReplyService),
//         })
//         .compileComponents();
//     })
//   );

//   beforeEach(done => {
//     fixture = TestBed.createComponent(SupermindConsoleActionButtonsComponent);
//     comp = fixture.componentInstance;
//     comp.supermind = mockSupermind;

//     (comp as any).supermindReplyService.startReply.calls.reset();
//     (comp as any).supermindReplyService.decline.calls.reset();
//     (comp as any).supermindReplyService.cancel.calls.reset();
//     (comp as any).router.navigate.calls.reset();
//     (comp as any).expirationService.getTimeTillExpiration.calls.reset();

//     fixture.detectChanges();

//     if (fixture.isStable()) {
//       done();
//     } else {
//       fixture.whenStable().then(() => {
//         done();
//       });
//     }
//   });

//   it('should initialize', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('it should call reply service to start reply on accept', fakeAsync(() => {
//     comp.onAccept(null);
//     tick();
//     expect((comp as any).supermindReplyService.startReply).toHaveBeenCalledWith(
//       comp.supermind
//     );
//   }));

//   it('it should call reply service to decline on decline', () => {
//     comp.onDecline(null);
//     expect((comp as any).supermindReplyService.decline).toHaveBeenCalledWith(
//       comp.supermind
//     );
//   });

//   it('it should call reply service to cancel on cancel', () => {
//     comp.onCancel(null);
//     expect((comp as any).supermindReplyService.cancel).toHaveBeenCalledWith(
//       comp.supermind
//     );
//   });

//   it('it should call navigate to single entity page on view reply click', () => {
//     comp.supermind.reply_activity_guid = '123';
//     comp.onViewReply(null);
//     expect((comp as any).router.navigate).toHaveBeenCalledWith([
//       `/newsfeed/${comp.supermind.reply_activity_guid}`,
//     ]);
//   });

//   it('should determine if inbox action buttons should be shown', () => {
//     comp.supermind.status = SupermindState.CREATED;
//     (comp as any).expirationService.getTimeTillExpiration.and.returnValue('4h');
//     (comp as any).session.getLoggedInUser.and.returnValue({
//       guid: comp.supermind.receiver_guid,
//     });

//     expect(comp.shouldShowAcceptAndDeclineButtons()).toBeTrue();
//   });

//   it('should determine if inbox action buttons should NOT be shown because expiry time was elapsed', () => {
//     comp.supermind.status = SupermindState.CREATED;
//     (comp as any).expirationService.getTimeTillExpiration.and.returnValue('');
//     (comp as any).session.getLoggedInUser.and.returnValue({
//       guid: comp.supermind.receiver_guid,
//     });

//     expect(comp.shouldShowAcceptAndDeclineButtons()).toBeFalse();
//   });

//   it('should determine if inbox action buttons should NOT be shown because state is not CREATED', () => {
//     comp.supermind.status = SupermindState.ACCEPTED;
//     (comp as any).expirationService.getTimeTillExpiration.and.returnValue('4h');
//     (comp as any).session.getLoggedInUser.and.returnValue({
//       guid: comp.supermind.receiver_guid,
//     });

//     expect(comp.shouldShowAcceptAndDeclineButtons()).toBeFalse();
//   });

//   it('should determine if inbox action buttons should NOT be shown because receiver guid is not the logged in user', () => {
//     comp.supermind.status = SupermindState.CREATED;
//     (comp as any).expirationService.getTimeTillExpiration.and.returnValue('4h');
//     (comp as any).session.getLoggedInUser.and.returnValue({
//       guid: comp.supermind.receiver_guid + '123',
//     });

//     expect(comp.shouldShowAcceptAndDeclineButtons()).toBeFalse();
//   });

//   it('it determine if show view reply button should be shown', () => {
//     comp.supermind.status = SupermindState.ACCEPTED;
//     comp.supermind.reply_activity_guid = '123';

//     expect(comp.shouldShowViewReplyButton()).toBeTrue();
//   });

//   it('it determine if show view reply button should NOT be shown because state is not ACCEPTED', () => {
//     comp.supermind.status = SupermindState.CREATED;
//     comp.supermind.reply_activity_guid = '123';

//     expect(comp.shouldShowViewReplyButton()).toBeFalse();
//   });

//   it('it determine if show view reply button should NOT be shown because there is no reply activity guid', () => {
//     comp.supermind.status = SupermindState.ACCEPTED;
//     comp.supermind.reply_activity_guid = null;

//     expect(comp.shouldShowViewReplyButton()).toBeFalse();
//   });
// });
