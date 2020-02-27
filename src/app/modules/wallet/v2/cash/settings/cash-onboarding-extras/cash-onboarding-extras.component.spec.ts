import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCashOnboardingExtrasComponent } from './cash-onboarding-extras.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('WalletCashOnboardingExtrasComponent', () => {
  let component: WalletCashOnboardingExtrasComponent;
  let fixture: ComponentFixture<WalletCashOnboardingExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletCashOnboardingExtrasComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCashOnboardingExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
