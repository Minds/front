import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2TwoFactorComponent } from './two-factor.component';

describe('TwoFactorComponent', () => {
  let component: SettingsV2TwoFactorComponent;
  let fixture: ComponentFixture<TwoFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2TwoFactorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2TwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
