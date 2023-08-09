import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersListComponent } from './list.component';
import { GroupMembersListService } from './list.service';
import { MockService } from '../../../../../utils/mock';

describe('GroupMembersListComponent', () => {
  let component: GroupMembersListComponent;
  let fixture: ComponentFixture<GroupMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMembersListComponent],
      providers: [
        {
          provide: GroupMembersListService,
          useValue: MockService(GroupMembersListService),
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
