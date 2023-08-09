import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersComponent } from './members.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';

describe('GroupMembersComponent', () => {
  let component: GroupMembersComponent;
  let fixture: ComponentFixture<GroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMembersComponent],
      providers: [
        { provide: GroupService, useValue: MockService(GroupService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
