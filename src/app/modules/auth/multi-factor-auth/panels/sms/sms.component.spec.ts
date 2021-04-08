import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../../utils/mock';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { MultiFactorAuthSMSComponent } from './sms.component';

describe('MultiFactorAuthSMSComponent', () => {
  let comp: MultiFactorAuthSMSComponent;
  let fixture: ComponentFixture<MultiFactorAuthSMSComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MultiFactorAuthSMSComponent],
        providers: [
          {
            provide: MultiFactorAuthService,
            useValue: MockService(MultiFactorAuthService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthSMSComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to validate sms code on verify click', () => {
    comp.onVerifyClick();

    expect((comp as any).service.validateSMSCode).toHaveBeenCalled();
  });

  it('should call to resend sms and start retry timer', () => {
    comp.resendSMSTimer();

    expect((comp as any).service.resendSMS).toHaveBeenCalled();
    const sub = comp.timer$.subscribe(val => {
      expect(val > 0);
    });
  });
});
