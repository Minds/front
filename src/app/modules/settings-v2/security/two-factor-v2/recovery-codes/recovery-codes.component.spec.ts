import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { sessionMock } from '../../../../../../tests/session-mock.spec';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Session } from '../../../../../services/session';
import { MockService } from '../../../../../utils/mock';
import { SettingsTwoFactorRecoveryCodeComponent } from './recovery-codes.component';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';
import { ButtonComponentMock } from '../../../../../mocks/common/components/button/button.component';
import { modalServiceMock } from '../../../../../../tests/modal-service-mock.spec';
import { ModalService } from '../../../../../services/ux/modal.service';

describe('SettingsTwoFactorRecoveryCodeComponent', () => {
  let comp: SettingsTwoFactorRecoveryCodeComponent;
  let fixture: ComponentFixture<SettingsTwoFactorRecoveryCodeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SettingsTwoFactorRecoveryCodeComponent,
          ButtonComponentMock,
        ],
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
            provide: ModalService,
            useValue: modalServiceMock,
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
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

  it('should download code and enable progress', () => {
    (comp as any).service.recoveryCode$ = new BehaviorSubject<string>('123');
    comp.disabled$.next(true);

    (comp as any).downloadRecoveryCode();

    comp.disabled$.subscribe(val => {
      expect(val).toBeFalsy();
    });
  });
});
