import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSettingsETHComponent } from './settings-eth.component';

describe('WalletSettingsETHComponent', () => {
  let component: WalletSettingsETHComponent;
  let fixture: ComponentFixture<WalletSettingsETHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletSettingsETHComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSettingsETHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
