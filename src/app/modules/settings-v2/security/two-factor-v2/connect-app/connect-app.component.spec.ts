import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { sessionMock } from '../../../../../../tests/session-mock.spec';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Session } from '../../../../../services/session';
import { MockService } from '../../../../../utils/mock';
import { SettingsTwoFactorConnectAppComponent } from './connect-app.component';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../../tests/modal-service-mock.spec';

xdescribe('SettingsTwoFactorConnectAppComponent', () => {
  let comp: SettingsTwoFactorConnectAppComponent;
  let fixture: ComponentFixture<SettingsTwoFactorConnectAppComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SettingsTwoFactorConnectAppComponent, ButtonComponent],
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
    fixture = TestBed.createComponent(SettingsTwoFactorConnectAppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and fetch a new secret', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).service.fetchNewSecret).toHaveBeenCalled();
  });

  it('should derive secret object from secret and username', () => {
    (comp as any).service.secret$ = new BehaviorSubject<string>('123');

    comp.secretObject$.subscribe(val => {
      expect(val).toEqual('otpauth://totp/Minds:test?secret=123&issuer=Minds');
    });
  });

  it('should be disabled unless code length is 6', () => {
    comp.code$.next('123');
    comp.disabled$.pipe(take(1)).subscribe(val => {
      expect(val).toBeTruthy();
    });

    comp.code$.next('123456');
    comp.disabled$.pipe(take(1)).subscribe(val => {
      expect(val).toBeFalsy();
    });

    comp.code$.next('1234567');
    comp.disabled$.pipe(take(1)).subscribe(val => {
      expect(val).toBeTruthy();
    });
  });

  it('should call to submit code on enable button click', () => {
    (comp as any).service.inProgress$ = new BehaviorSubject<boolean>(false);
    (comp as any).service.passwordConfirmed$ = new BehaviorSubject<boolean>(
      true
    );
    (comp as any).code$ = new BehaviorSubject<string>('123');

    comp.enableButtonClick();
    expect((comp as any).service.submitCode).toHaveBeenCalledWith('123');
  });

  it('should set current panel to root on back button click', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<
      TwoFactorSetupPanel
    >(null);

    comp.backButtonClick();

    (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toEqual({ panel: 'root' });
    });
  });
});
