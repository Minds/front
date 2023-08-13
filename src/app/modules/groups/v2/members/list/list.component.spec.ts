import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersListComponent } from './list.component';
import { GroupMembersListService } from './list.service';
import { MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../services/session';

describe('GroupMembersListComponent', () => {
  let component: GroupMembersListComponent;
  let fixture: ComponentFixture<GroupMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMembersListComponent],
      providers: [
        {
          provide: GroupMembersListService,
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
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
