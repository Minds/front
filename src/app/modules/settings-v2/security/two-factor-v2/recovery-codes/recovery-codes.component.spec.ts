import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { sessionMock } from '../../../../../../tests/session-mock.spec';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Session } from '../../../../../services/session';
import { StackableModalService } from '../../../../../services/ux/stackable-modal.service';
import { MockService } from '../../../../../utils/mock';
import { SettingsTwoFactorRecoveryCodeComponent } from './recovery-codes.component';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';

describe('SettingsTwoFactorRecoveryCodeComponent', () => {
  let comp: SettingsTwoFactorRecoveryCodeComponent;
  let fixture: ComponentFixture<SettingsTwoFactorRecoveryCodeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsTwoFactorRecoveryCodeComponent],
        providers: [
          {
            provide: SettingsTwoFactorV2Service,
            useValue: MockService(SettingsTwoFactorV2Service),
          },
          {
            provide: Session,
            useValue: sessionMock,
          },
          {
            provide: StackableModalService,
            useValue: MockService(StackableModalService),
          },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorRecoveryCodeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should reload settings and redirect to root with enable-totp intent', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<
      TwoFactorSetupPanel
    >(null);

    comp.continueButtonClick();

    expect((comp as any).service.reloadSettings).toHaveBeenCalled();

    (comp as any).activePanel$.subscribe(val => {
      expect(val).toEqual({ panel: 'root', intent: 'enabled-totp' });
    });
  });

  it('should copy code to clipboard and enable progress', () => {
    (comp as any).service.recoveryCode$ = new BehaviorSubject<string>('123');
    comp.disabled$.next(true);

    (comp as any).copyToClipboard();

    comp.disabled$.subscribe(val => {
      expect(val).toBeFalsy();
    });
  });

  it('should copy code to clipboard and enable progress', () => {
    (comp as any).service.recoveryCode$ = new BehaviorSubject<string>('123');
    comp.disabled$.next(true);

    (comp as any).downloadRecoveryCode();

    comp.disabled$.subscribe(val => {
      expect(val).toBeFalsy();
    });
  });
});
