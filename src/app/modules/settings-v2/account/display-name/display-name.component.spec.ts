import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2DisplayNameComponent } from './display-name.component';

describe('SettingsV2DisplayNameComponent', () => {
  let component: SettingsV2DisplayNameComponent;
  let fixture: ComponentFixture<SettingsV2DisplayNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2DisplayNameComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2DisplayNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
