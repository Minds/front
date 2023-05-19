// ojm todo
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAvatarComponent } from './avatar.component';

describe('ActivityAvatarComponent', () => {
  let component: ActivityAvatarComponent;
  let fixture: ComponentFixture<ActivityAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
