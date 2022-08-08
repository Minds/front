import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ButtonComponent } from '../../../../../../common/components/button/button.component';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { MockService } from '../../../../../../utils/mock';
import { SettingsTwoFactorV2Service } from '../../two-factor-v2.service';
import { SettingsTwoFactorDisableTOTPComponent } from './confirm-disable-totp.component';

describe('SettingsTwoFactorDisableTOTPComponent', () => {
  let comp: SettingsTwoFactorDisableTOTPComponent;
  let fixture: ComponentFixture<SettingsTwoFactorDisableTOTPComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SettingsTwoFactorDisableTOTPComponent, ButtonComponent],
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorDisableTOTPComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
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
});
