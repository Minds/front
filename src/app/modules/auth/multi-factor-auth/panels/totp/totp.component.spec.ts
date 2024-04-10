import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ButtonComponentMock } from '../../../../../mocks/common/components/button/button.component';

import { MockService } from '../../../../../utils/mock';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
} from '../../services/multi-factor-auth-service';

import { MultiFactorAuthTOTPComponent } from '../totp/totp.component';

xdescribe('MultiFactorAuthTOTPComponent', () => {
  let comp: MultiFactorAuthTOTPComponent;
  let fixture: ComponentFixture<MultiFactorAuthTOTPComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MultiFactorAuthTOTPComponent, ButtonComponentMock],
      providers: [
        {
          provide: MultiFactorAuthService,
          useValue: MockService(MultiFactorAuthService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthTOTPComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to validate sms code on verify click', () => {
    comp.onVerifyClick();
    expect((comp as any).service.validateCode).toHaveBeenCalled();
  });

  it('should open recovery code panel', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<MultiFactorPanel>(
      'totp'
    );
    comp.onRecoveryCodeClick();

    const sub = (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toBe('totp-recovery');
    });
  });
});
