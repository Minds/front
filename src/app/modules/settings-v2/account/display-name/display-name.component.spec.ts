import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2DisplayNameComponent } from './display-name.component';

describe('DisplayNameComponent', () => {
  let component: DisplayNameComponent;
  let fixture: ComponentFixture<DisplayNameComponent>;

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
