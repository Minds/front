import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberActionsComponent } from './member-actions.component';
import { GroupService } from '../../group.service';
import { MockService } from '../../../../../utils/mock';
import { GroupInviteService } from '../../invite/invite.service';
import { Session } from '../../../../../services/session';

describe('GroupMemberActionsComponent', () => {
  let component: GroupMemberActionsComponent;
  let fixture: ComponentFixture<GroupMemberActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMemberActionsComponent],
      providers: [
        { provide: GroupService, useValue: MockService(GroupService) },
        {
          provide: GroupInviteService,
          useValue: MockService(GroupInviteService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMemberActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
