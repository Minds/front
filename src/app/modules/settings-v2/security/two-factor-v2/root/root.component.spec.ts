import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockService } from '../../../../../utils/mock';
import { SettingsTwoFactorV2RootComponent } from './root.component';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';
import { ButtonComponent } from '../../../../../common/components/button/button.component';

xdescribe('SettingsTwoFactorV2RootComponent', () => {
  let comp: SettingsTwoFactorV2RootComponent;
  let fixture: ComponentFixture<SettingsTwoFactorV2RootComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsTwoFactorV2RootComponent, ButtonComponent],
      providers: [
        {
          provide: SettingsTwoFactorV2Service,
          useValue: MockService(SettingsTwoFactorV2Service),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorV2RootComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should show totp as enabled when no intent override and enable set to true', () => {
    (comp as any).service.totpEnabled$ = new BehaviorSubject<boolean>(true);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({ panel: 'root' });

    comp.totpEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should NOT show totp as enabled when intent overridden to enabled', () => {
    (comp as any).service.totpEnabled$ = new BehaviorSubject<boolean>(false);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
        intent: 'enabled-totp',
      });

    comp.totpEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should show totp as DISABLED when intent overridden to disabled', () => {
    (comp as any).service.totpEnabled$ = new BehaviorSubject<boolean>(true);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
        intent: 'disabled-totp',
      });

    comp.totpEnabled$.subscribe((val) => {
      expect(val).toBeFalsy();
    });
  });

  it('should show sms as enabled when no intent override and enable set to true', () => {
    (comp as any).service.smsEnabled$ = new BehaviorSubject<boolean>(true);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({ panel: 'root' });

    comp.smsEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should NOT show sms as enabled when intent overridden to enabled', () => {
    (comp as any).service.smsEnabled$ = new BehaviorSubject<boolean>(false);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
        intent: 'enabled-sms',
      });

    comp.smsEnabled$.subscribe((val) => {
      expect(val).toBeTruthy();
    });
  });

  it('should show sms as DISABLED when intent overridden to disabled', () => {
    (comp as any).service.smsEnabled$ = new BehaviorSubject<boolean>(true);
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
        intent: 'disabled-sms',
      });

    comp.smsEnabled$.subscribe((val) => {
      expect(val).toBeFalsy();
    });
  });

  it('should show password panel with disable intent on integration click function firing', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
      });

    comp.onDisableIntegrationClick();

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toEqual({
        panel: 'password',
        intent: 'disable',
      });
    });
  });

  it('should show password panel with setup intent on setup app click function fired', () => {
    (comp as any).service.smsEnabled$ = new BehaviorSubject<boolean>(false);

    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'root',
      });

    comp.onSetupAppClick();

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toEqual({
        panel: 'password',
        intent: 'setup-app',
      });
    });
  });
});
