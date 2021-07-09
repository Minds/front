import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../../utils/mock';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { MultiFactorAuthTOTPRecoveryComponent } from './recovery-code.component';

describe('MultiFactorAuthTOTPRecoveryComponent', () => {
  let comp: MultiFactorAuthTOTPRecoveryComponent;
  let fixture: ComponentFixture<MultiFactorAuthTOTPRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiFactorAuthTOTPRecoveryComponent],
      providers: [
        {
          provide: MultiFactorAuthService,
          useValue: MockService(MultiFactorAuthService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthTOTPRecoveryComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to validate recovery code on verify click', () => {
    comp.onVerifyClick();

    expect((comp as any).service.validateRecoveryCode).toHaveBeenCalled();
  });
});
