import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2TierTwoViewComponent } from './tier-two-view.component';

describe('SettingsV2TierTwoViewComponent', () => {
  let component: SettingsV2TierTwoViewComponent;
  let fixture: ComponentFixture<SettingsV2TierTwoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2TierTwoViewComponent],
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
