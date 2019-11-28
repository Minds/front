import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSettingsBTCComponent } from './settings-btc.component';

describe('WalletSettingsBTCComponent', () => {
  let component: WalletSettingsBTCComponent;
  let fixture: ComponentFixture<WalletSettingsBTCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletSettingsBTCComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSettingsBTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
