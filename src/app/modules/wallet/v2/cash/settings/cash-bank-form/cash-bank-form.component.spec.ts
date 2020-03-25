import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';

import { WalletCashBankFormComponent } from './cash-bank-form.component';

describe('WalletCashBankFormComponent', () => {
  let component: WalletCashBankFormComponent;
  let fixture: ComponentFixture<WalletCashBankFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletCashBankFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCashBankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
