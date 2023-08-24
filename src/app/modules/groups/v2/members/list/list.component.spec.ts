import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupMembersListComponent } from './list.component';
import { GroupMembersListService } from './list.service';
import { MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../services/session';

describe('GroupMembersListComponent', () => {
  let component: GroupMembersListComponent;
  let fixture: ComponentFixture<GroupMembersListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GroupMembersListComponent],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
        ],
      })
        .overrideProvider(GroupMembersListService, {
          useValue: MockService(GroupMembersListService, {
            has: ['group$', 'groupMembershipLevel$', 'membershipLevelGte$'],
            props: {
              group$: {
                get: () => new BehaviorSubject<any>(''),
              },
              groupMembershipLevel$: {
                get: () => new BehaviorSubject<any>(''),
              },
              membershipLevelGte$: { get: () => new BehaviorSubject<any>('') },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupMembersListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
