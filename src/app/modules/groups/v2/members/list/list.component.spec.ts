import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersListComponent } from './list.component';

describe('GroupMembersListComponent', () => {
  let component: GroupMembersListComponent;
  let fixture: ComponentFixture<GroupMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMembersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
