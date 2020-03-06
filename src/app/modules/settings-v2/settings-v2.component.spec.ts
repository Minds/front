import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2Component } from './settings-v2.component';
import { RouterOutlet, Router } from '@angular/router';
import { NestedMenuComponent } from '../../common/layout/nested-menu/nested-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SettingsV2Component', () => {
  let component: SettingsV2Component;
  let fixture: ComponentFixture<SettingsV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2Component, RouterOutlet, NestedMenuComponent],
      providers: [{ provide: Router, useValue: RouterTestingModule }],
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
