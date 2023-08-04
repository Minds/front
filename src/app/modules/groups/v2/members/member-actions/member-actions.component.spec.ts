import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberActionsComponent } from './member-actions.component';

describe('GroupMemberActionsComponent', () => {
  let component: GroupMemberActionsComponent;
  let fixture: ComponentFixture<GroupMemberActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMemberActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMemberActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
