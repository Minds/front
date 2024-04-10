import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { MockService } from '../../../../../utils/mock';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { MultiFactorAuthTOTPRecoveryComponent } from './recovery-code.component';

// ERROR: 'Error during cleanup of component
// TypeError: Cannot read property 'next' of null
xdescribe('MultiFactorAuthTOTPRecoveryComponent', () => {
  let comp: MultiFactorAuthTOTPRecoveryComponent;
  let fixture: ComponentFixture<MultiFactorAuthTOTPRecoveryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MultiFactorAuthTOTPRecoveryComponent, ButtonComponent],
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
