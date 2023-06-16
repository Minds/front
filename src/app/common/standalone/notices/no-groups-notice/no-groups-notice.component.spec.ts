import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGroupsNoticeComponent } from './no-groups-notice.component';

describe('NoGroupsNoticeComponent', () => {
  let component: NoGroupsNoticeComponent;
  let fixture: ComponentFixture<NoGroupsNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoGroupsNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoGroupsNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
