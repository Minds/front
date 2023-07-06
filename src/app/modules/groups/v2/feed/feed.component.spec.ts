import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFeedComponent } from './feed.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';
import { GroupsService } from '../../groups.service';

describe('GroupFeedComponent', () => {
  let component: GroupFeedComponent;
  let fixture: ComponentFixture<GroupFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
