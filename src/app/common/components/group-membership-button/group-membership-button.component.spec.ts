import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembershipButtonComponent } from './group-membership-button.component';
describe('GroupMembershipButtonComponent', () => {
  let component: GroupMembershipButtonComponent;
  let fixture: ComponentFixture<GroupMembershipButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMembershipButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMembershipButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// v1 tests to adapt/copy
// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
//   waitForAsync,
// } from '@angular/core/testing';
// import { DebugElement } from '@angular/core';

// import { By } from '@angular/platform-browser';

// import { SignupOnActionModalMock } from '../../mocks/modules/modals/signup/signup-on-action.mock';
// import { clientMock } from '../../../tests/client-mock.spec';
// import { uploadMock } from '../../../tests/upload-mock.spec';

// import { GroupMembershipButton } from './group-membership-button';
// import { GroupsService } from './groups.service';
// import { Session } from '../../services/session';
// import { sessionMock } from '../../../tests/session-mock.spec';
// import { RouterTestingModule } from '@angular/router/testing';
// import { LoginReferrerService } from '../../services/login-referrer.service';
// import { loginReferrerServiceMock } from '../../mocks/services/login-referrer-service-mock.spec';
// import { MockService } from '../../utils/mock';
// import { ButtonComponent } from '../../common/components/button/button.component';
// import { ToasterService } from '../../common/services/toaster.service';

// describe('GroupMembershipButton', () => {
//   let fixture: ComponentFixture<GroupMembershipButton>;
//   let comp: GroupMembershipButton;

//   /** Helpers */

//   function setGroup(props: any) {
//     comp._group = Object.assign(
//       {
//         guid: 1000,
//         'is:banned': false,
//         'is:awaiting': false,
//         'is:invited': false,
//         'is:member': false,
//         membership: 2,
//       },
//       props
//     );
//   }

//   function getJoinButtons(): DebugElement[] {
//     return fixture.debugElement.queryAll(
//       By.css('.m-group__membershipButton--join')
//     );
//   }

//   function getAcceptAndDeclineButtons(): DebugElement[] {
//     return fixture.debugElement.queryAll(
//       By.css('.m-group__membershipButton--verdict')
//     );
//   }

//   function getLeaveButton(): DebugElement {
//     return fixture.debugElement.query(
//       By.css('.m-group__membershipButton--leave')
//     );
//   }

//   function getCancelRequestButton(): DebugElement {
//     return fixture.debugElement.query(
//       By.css('.m-group__membershipButton--cancel')
//     );
//   }

//   /** /Helpers */

//   beforeEach(
//     waitForAsync(() => {
//       TestBed.configureTestingModule({
//         declarations: [
//           SignupOnActionModalMock,
//           GroupMembershipButton,
//           ButtonComponent,
//         ],
//         imports: [RouterTestingModule],
//         providers: [
//           { provide: Session, useValue: sessionMock },
//           { provide: GroupsService, useValue: MockService(GroupsService) },
//           { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
//           {
//             provide: ToasterService,
//             useValue: MockService(ToasterService),
//           },
//         ],
//       }).compileComponents();
//     })
//   );

//   beforeEach(done => {
//     fixture = TestBed.createComponent(GroupMembershipButton);
//     comp = fixture.componentInstance;

//     setGroup({});
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

//   it('should render a button to join', () => {
//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': false,
//     });
//     fixture.detectChanges();

//     expect(getJoinButtons().length).toBe(1);
//   });

//   it('should not render a button to join if banned', () => {
//     setGroup({
//       'is:banned': true,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': false,
//     });
//     fixture.detectChanges();

//     expect(getJoinButtons().length).toBe(0);
//   });

//   it('should render a button to accept or decline an invitation', () => {
//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': true,
//       'is:member': false,
//     });
//     fixture.detectChanges();

//     expect(getAcceptAndDeclineButtons().length).toBe(2);
//   });

//   it('should render a button to leave', () => {
//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': true,
//     });
//     fixture.detectChanges();

//     expect(getLeaveButton()).toBeTruthy();
//   });

//   it('should render a button to cancel join request', () => {
//     setGroup({
//       'is:banned': false,
//       'is:awaiting': true,
//       'is:invited': false,
//       'is:member': false,
//     });
//     fixture.detectChanges();

//     expect(getCancelRequestButton()).toBeTruthy();
//   });

//   it('should join a public group', fakeAsync(() => {
//     expect(comp.inProgress).toBeFalse();
//     expect(comp.group['is:member']).toBeFalse();

//     (comp as any).service.join.and.returnValue(Promise.resolve(true));

//     spyOn(comp.membership, 'next');

//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': false,
//     });

//     comp.join();
//     expect(comp.inProgress).toBeTrue();

//     tick();

//     expect(comp.inProgress).toBeFalse();
//     expect(comp.group['is:member']).toBeTrue();
//     expect(comp.membership.next).toHaveBeenCalled();
//     expect(comp.membership.next).toHaveBeenCalledWith({ member: true });
//   }));

//   it('should join a closed group', fakeAsync(() => {
//     expect(comp.inProgress).toBeFalse();
//     expect(comp.group['is:awaiting']).toBeFalse();

//     (comp as any).service.join.and.returnValue(Promise.resolve(true));

//     spyOn(comp.membership, 'next');

//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': false,
//       membership: 0,
//     });

//     comp.join();
//     expect(comp.inProgress).toBeTrue();

//     tick();

//     expect(comp.inProgress).toBeFalse();
//     expect(comp.group['is:awaiting']).toBeTrue();
//     expect(comp.membership.next).toHaveBeenCalled();
//     expect(comp.membership.next).toHaveBeenCalledWith({});
//   }));

//   it('should handle errors joining groups appropriately', fakeAsync(() => {
//     const errorText = 'You are banned from this group';

//     (comp as any).service.join.and.returnValue(
//       Promise.reject({
//         error: errorText,
//       })
//     );

//     spyOn(comp.membership, 'next');

//     setGroup({
//       'is:banned': false,
//       'is:awaiting': false,
//       'is:invited': false,
//       'is:member': false,
//     });

//     expect(comp.inProgress).toBeFalse();
//     comp.join();
//     expect(comp.inProgress).toBeTrue();

//     tick();

//     expect((comp as any).toast.error).toHaveBeenCalledWith(errorText);
//     expect(comp.group['is:member']).toBeFalse();
//     expect(comp.group['is:awaiting']).toBeFalse();
//     expect(comp.membership.next).toHaveBeenCalled();
//     expect(comp.membership.next).toHaveBeenCalledWith({ error: 'banned' });
//     expect(comp.inProgress).toBeFalse();
//   }));
// });
