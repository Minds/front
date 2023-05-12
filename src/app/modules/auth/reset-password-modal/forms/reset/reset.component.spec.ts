import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordModalResetFormComponent } from './reset.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockService } from '../../../../../utils/mock';
import { ResetPasswordModalService } from '../../reset-password-modal.service';
import { FormBuilder } from '@angular/forms';
import { Session } from '../../../../../services/session';
import { sessionMock } from '../../../../../services/session-mock';
import { PasswordRiskValidator } from '../../../../forms/password-risk.validator';

describe('ResetPasswordModalResetFormComponent', () => {
  let component: ResetPasswordModalResetFormComponent;
  let fixture: ComponentFixture<ResetPasswordModalResetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordModalResetFormComponent],
      providers: [
        { provide: Session, useValue: sessionMock },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: FormBuilder,
          userValue: MockService(FormBuilder),
        },
        {
          provide: ResetPasswordModalService,
          useValue: MockService(ResetPasswordModalService),
        },
        {
          provide: PasswordRiskValidator,
          useValue: MockService(PasswordRiskValidator),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordModalResetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
