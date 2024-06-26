import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupReviewComponent } from './review.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('GroupReviewComponent', () => {
  let component: GroupReviewComponent;
  let fixture: ComponentFixture<GroupReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupReviewComponent],
      providers: [
        { provide: GroupService, useValue: MockService(GroupService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
