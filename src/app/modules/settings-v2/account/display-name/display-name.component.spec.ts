import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsV2DisplayNameComponent } from './display-name.component';
import { Client } from '../../../../services/api';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { SettingsV2Service } from '../../settings-v2.service';

describe('SettingsV2DisplayNameComponent', () => {
  let component: SettingsV2DisplayNameComponent;
  let fixture: ComponentFixture<SettingsV2DisplayNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2DisplayNameComponent],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: FormToastService, useValue: MockService(FormToastService) },
        { provide: DialogService, useValue: MockService(DialogService) },
        {
          provide: SettingsV2Service,
          useValue: MockService(SettingsV2Service),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2DisplayNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
