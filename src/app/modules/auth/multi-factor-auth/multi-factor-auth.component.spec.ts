import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { MultiFactorAuthBaseComponent } from './multi-factor-auth.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject } from 'rxjs';
import {
  MultiFactorAuthService,
  MultiFactorRootPanel,
} from './services/multi-factor-auth-service';
import { EmailConfirmationService } from '../../../common/components/email-confirmation/email-confirmation.service';

describe('MultiFactorAuthBaseComponent', () => {
  let comp: MultiFactorAuthBaseComponent;
  let fixture: ComponentFixture<MultiFactorAuthBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MultiFactorAuthBaseComponent],
      providers: [
        {
          provide: MultiFactorAuthService,
          useValue: MockService(MultiFactorAuthService),
        },
        {
          provide: EmailConfirmationService,
          useValue: MockService(EmailConfirmationService),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthBaseComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set auth type in service', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<MultiFactorRootPanel>('totp');

    comp.authType = 'sms';

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toBe('sms');
    });
  });

  it('should set opts', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<MultiFactorRootPanel>('totp');

    comp.setModalData({
      onDismissIntent: () => {},
      onSaveIntent: () => {},
      authType: 'sms',
    });

    const sub = (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toBe('sms');
    });
  });

  it('should determine whether a user has confirmed their email', () => {
    (comp as any).emailConfirmation.requiresEmailConfirmation.and.returnValue(
      true
    );

    expect(comp.isConfirmingEmail()).toBeTruthy();
    expect(
      (comp as any).emailConfirmation.requiresEmailConfirmation
    ).toHaveBeenCalled();
  });

  it('should determine whether a user has not confirmed their email', () => {
    (comp as any).emailConfirmation.requiresEmailConfirmation.and.returnValue(
      false
    );

    expect(comp.isConfirmingEmail()).toBeFalsy();
    expect(
      (comp as any).emailConfirmation.requiresEmailConfirmation
    ).toHaveBeenCalled();
  });
});
