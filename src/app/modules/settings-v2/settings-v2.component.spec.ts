import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2Component } from './settings-v2.component';

describe('SettingsV2Component', () => {
  let component: SettingsV2Component;
  let fixture: ComponentFixture<SettingsV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
