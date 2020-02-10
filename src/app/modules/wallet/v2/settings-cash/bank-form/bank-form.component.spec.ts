import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBankFormComponent } from './bank-form.component';

describe('WalletBankFormComponent', () => {
  let component: WalletBankFormComponent;
  let fixture: ComponentFixture<WalletBankFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletBankFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
