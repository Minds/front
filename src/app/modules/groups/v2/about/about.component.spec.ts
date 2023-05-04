import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAboutComponent } from './about.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';

describe('GroupAboutComponent', () => {
  let component: GroupAboutComponent;
  let fixture: ComponentFixture<GroupAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupAboutComponent],
      providers: [
        { provide: GroupService, useValue: MockService(GroupService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
