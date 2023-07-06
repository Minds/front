import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberPreviewsComponent } from './member-previews.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';

describe('GroupMemberPreviewsComponent', () => {
  let component: GroupMemberPreviewsComponent;
  let fixture: ComponentFixture<GroupMemberPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMemberPreviewsComponent],
      providers: [
        { provide: GroupService, useValue: MockService(GroupService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMemberPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
