import { ChangeDetectorRef } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Client } from '../../../../services/api';
import { MockComponent, MockService } from '../../../../utils/mock';

import { SettingsV2DeactivateAccountComponent } from './deactivate-account.component';

describe('DeactivateAccountComponent', () => {
  let component: SettingsV2DeactivateAccountComponent;
  let fixture: ComponentFixture<SettingsV2DeactivateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        SettingsV2DeactivateAccountComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
        }),
        MockComponent({
          selector: 'm-formInput__checkbox',
        }),
        MockComponent({
          selector: 'form',
          inputs: ['formGroup'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving', 'color'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        { provide: Client, useValue: MockService(Client) },
        { provide: Router, useValue: MockService(Router) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2DeactivateAccountComponent);
    component = fixture.componentInstance;

    (component as any).inProgress = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit to deactivate account', fakeAsync(() => {
    component.inProgress = true; // simulate this happening after calling function
    (component as any).client.delete.and.returnValue(
      Promise.resolve({ status: 'success' })
    );

    component.submit();
    tick();

    expect((component as any).router.navigate).toHaveBeenCalled();
    expect(component.inProgress).toBeFalse();
  }));

  it('should show error toast if there is an error when deactivating account', fakeAsync(() => {
    component.inProgress = true; // simulate this happening after calling function
    (component as any).client.delete.and.returnValue(
      Promise.reject({ status: 'error', message: 'error message' })
    );

    component.submit();
    tick();

    expect((component as any).router.navigate).not.toHaveBeenCalled();
    expect((component as any).toasterService.error).toHaveBeenCalledWith(
      'Sorry, we could not disable your account'
    );
    expect(component.inProgress).toBeFalse();
  }));
});
