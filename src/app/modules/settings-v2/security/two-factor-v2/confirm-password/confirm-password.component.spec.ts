import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ButtonComponentMock } from '../../../../../mocks/common/components/button/button.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiFactorPanel } from '../../../../auth/multi-factor-auth/services/multi-factor-auth-service';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';

import { SettingsTwoFactorPasswordComponent } from './confirm-password.component';

let apiServiceMock = new (function () {
  this.post = jasmine
    .createSpy('success')
    .and.returnValue(new BehaviorSubject<any>(null));
})();

describe('SettingsTwoFactorPasswordComponent', () => {
  let comp: SettingsTwoFactorPasswordComponent;
  let fixture: ComponentFixture<SettingsTwoFactorPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SettingsTwoFactorPasswordComponent, ButtonComponentMock],
      providers: [
        {
          provide: SettingsTwoFactorV2Service,
          useValue: MockService(SettingsTwoFactorV2Service),
        },
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorPasswordComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to validate password on confirm click', () => {
    comp.password$.next('123');

    comp.onConfirmClick();

    expect((comp as any).api.post).toHaveBeenCalledWith(
      'api/v2/settings/password/validate',
      {
        password: '123',
      }
    );
  });

  it('should pass to app-connect panel from setup-app intent', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'password',
        intent: 'setup-app',
      });
    (comp as any).service.passwordConfirmed$ = new BehaviorSubject<boolean>(
      false
    );

    (comp as any).onSuccess();

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toEqual({
        panel: 'app-connect',
      });
    });
  });

  it('should pass to disable panel from disable intent', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'password',
        intent: 'disable',
      });
    (comp as any).service.passwordConfirmed$ = new BehaviorSubject<boolean>(
      false
    );

    (comp as any).onSuccess();

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toEqual({
        panel: 'disable',
      });
    });
  });

  it('should pass to sms panel from sms panel', () => {
    (comp as any).service.activePanel$ =
      new BehaviorSubject<TwoFactorSetupPanel>({
        panel: 'password',
        intent: 'sms',
      });
    (comp as any).service.passwordConfirmed$ = new BehaviorSubject<boolean>(
      false
    );

    (comp as any).onSuccess();

    (comp as any).service.activePanel$.subscribe((val) => {
      expect(val).toEqual({
        panel: 'sms',
      });
    });
  });
});
