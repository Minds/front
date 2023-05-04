import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberPreviewsComponent } from './member-previews.component';

describe('GroupMemberPreviewsComponent', () => {
  let component: GroupMemberPreviewsComponent;
  let fixture: ComponentFixture<GroupMemberPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMemberPreviewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMemberPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
