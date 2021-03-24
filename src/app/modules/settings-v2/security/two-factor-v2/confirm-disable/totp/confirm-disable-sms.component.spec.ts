import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { MockService } from '../../../../../../utils/mock';
import { SettingsTwoFactorV2Service } from '../../two-factor-v2.service';
import { SettingsTwoFactorDisableTOTPComponent } from './confirm-disable-totp.component';

describe('SettingsTwoFactorDisableTOTPComponent', () => {
  let comp: SettingsTwoFactorDisableTOTPComponent;
  let fixture: ComponentFixture<SettingsTwoFactorDisableTOTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsTwoFactorDisableTOTPComponent],
      providers: [
        {
          provide: SettingsTwoFactorV2Service,
          useValue: MockService(SettingsTwoFactorV2Service),
        },
        {
          provide: FormToastService,
          useValue: MockService(FormToastService),
        },
      ],
    }).compileComponents();
  }));

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
