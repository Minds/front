import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2EmailAddressComponent } from './email-address.component';

describe('SettingsV2EmailAddressComponent', () => {
  let component: SettingsV2EmailAddressComponent;
  let fixture: ComponentFixture<SettingsV2EmailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2EmailAddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2EmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
