import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { MockService } from '../../../../../../utils/mock';
import { SettingsTwoFactorV2Service } from '../../two-factor-v2.service';

import { SettingsTwoFactorDisableSMSComponent } from './confirm-disable-sms.component';

describe('SettingsTwoFactorDisableSMSComponent', () => {
  let comp: SettingsTwoFactorDisableSMSComponent;
  let fixture: ComponentFixture<SettingsTwoFactorDisableSMSComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsTwoFactorDisableSMSComponent],
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorDisableSMSComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set next panel on save', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<unknown>(null);
    comp.onSave();

    expect((comp as any).toast.success).toHaveBeenCalled();
    expect((comp as any).service.reloadSettings).toHaveBeenCalled();
    (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toEqual({ panel: 'root', intent: 'enabled-sms' });
    });
  });

  it('should set next panel on disable', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<unknown>(null);
    comp.onDisable();

    expect((comp as any).toast.success).toHaveBeenCalled();
    expect((comp as any).service.reloadSettings).toHaveBeenCalled();
    (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toEqual({ panel: 'root', intent: 'disabled-sms' });
    });
  });
});
