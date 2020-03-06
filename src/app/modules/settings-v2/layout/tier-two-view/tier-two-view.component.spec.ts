import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2TierTwoViewComponent } from './tier-two-view.component';
import { NestedMenuComponent } from '../../../../common/layout/nested-menu/nested-menu.component';
import { RouterOutlet, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SettingsV2TierTwoViewComponent', () => {
  let component: SettingsV2TierTwoViewComponent;
  let fixture: ComponentFixture<SettingsV2TierTwoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsV2TierTwoViewComponent,
        NestedMenuComponent,
        RouterOutlet,
      ],
      providers: [{ provide: Router, useValue: RouterTestingModule }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2TierTwoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
