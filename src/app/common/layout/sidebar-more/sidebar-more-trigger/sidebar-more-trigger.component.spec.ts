import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMoreTriggerComponent } from './sidebar-more-trigger.component';

describe('SidebarMoreTriggerComponent', () => {
  let component: SidebarMoreTriggerComponent;
  let fixture: ComponentFixture<SidebarMoreTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarMoreTriggerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMoreTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
