import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCashOnboardingComponent } from './cash-onboarding.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('WalletCashOnboardingComponent', () => {
  let component: WalletCashOnboardingComponent;
  let fixture: ComponentFixture<WalletCashOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletCashOnboardingComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCashOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
