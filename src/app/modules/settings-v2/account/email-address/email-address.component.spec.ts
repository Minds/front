import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { SettingsV2EmailAddressComponent } from './email-address.component';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { SettingsV2Service } from '../../settings-v2.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('SettingsV2EmailAddressComponent', () => {
  let component: SettingsV2EmailAddressComponent;
  let fixture: ComponentFixture<SettingsV2EmailAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        SettingsV2EmailAddressComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
        }),
      ],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        { provide: Session, useValue: sessionMock },
        {
          provide: SettingsV2Service,
          useValue: MockService(SettingsV2Service, {
            has: ['settings$'],
            props: {
              settings$: {
                get: () =>
                  new BehaviorSubject<any>({
                    email: 'test@minds.com',
                  }),
              },
            },
          }),
        },
        { provide: DialogService, useValue: MockService(DialogService) },
        { provide: ModalService, useValue: MockService(ModalService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2EmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', async () => {
    spyOn(component.formSubmitted, 'emit');
    (component as any).settingsService.updateSettings.and.returnValue(
      Promise.resolve({
        status: 'success',
      })
    );

    await component.submit();

    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      formSubmitted: true,
    });
    expect(component.user.email_confirmed).toBe(false);
  });

  it('should emit with error message on submit when there is an error', async () => {
    spyOn(component.formSubmitted, 'emit');
    (component as any).settingsService.updateSettings.and.returnValue(
      Promise.resolve({
        status: 'error',
        message: '~errorMessage~',
      })
    );

    await component.submit();

    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      formSubmitted: false,
      error: '~errorMessage~',
    });
  });

  it('should emit with generic error if error message is null on submit when there is an error', async () => {
    spyOn(component.formSubmitted, 'emit');
    (component as any).settingsService.updateSettings.and.returnValue(
      Promise.resolve({})
    );

    await component.submit();

    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      formSubmitted: false,
      error: 'An error has occurred',
    });
  });
});
