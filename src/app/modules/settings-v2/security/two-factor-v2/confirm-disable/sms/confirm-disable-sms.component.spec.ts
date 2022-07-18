import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { clientMock } from '../../../../../../../tests/client-mock.spec';
import { ButtonComponent } from '../../../../../../common/components/button/button.component';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { Client } from '../../../../../../services/api';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { SettingsTwoFactorV2Service } from '../../two-factor-v2.service';

import { SettingsTwoFactorDisableSMSComponent } from './confirm-disable-sms.component';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../../../tests/modal-service-mock.spec';

describe('SettingsTwoFactorDisableSMSComponent', () => {
  let comp: SettingsTwoFactorDisableSMSComponent;
  let fixture: ComponentFixture<SettingsTwoFactorDisableSMSComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          SettingsTwoFactorDisableSMSComponent,
          MockComponent({
            selector: 'm-settings--two-factor',
            outputs: ['onSave', 'onDisable'],
          }),
          ButtonComponent,
        ],
        providers: [
          {
            provide: SettingsTwoFactorV2Service,
            useValue: MockService(SettingsTwoFactorV2Service),
          },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
          {
            provide: Client,
            useValue: clientMock,
          },
          { provide: ModalService, useValue: modalServiceMock },
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

    (comp as any).service.activePanel$.subscribe(
      val => {
        expect(val).toEqual({ panel: 'root', intent: 'disabled-sms' });
      },
      err => {
        console.error(err);
        fail('An error occurred in confirm-disable-sms');
      }
    );
  });
});
