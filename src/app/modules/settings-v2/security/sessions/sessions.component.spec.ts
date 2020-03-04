import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2SessionsComponent } from './sessions.component';

describe('SessionsComponent', () => {
  let component: SettingsV2SessionsComponent;
  let fixture: ComponentFixture<SessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2SessionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2SessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
