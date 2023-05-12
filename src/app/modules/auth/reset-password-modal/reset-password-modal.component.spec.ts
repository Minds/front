import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';
import { ResetPasswordModalService } from './reset-password-modal.service';
import { FormBuilder } from '@angular/forms';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { Session } from 'protractor';
import { sessionMock } from '../../../services/session-mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordModalComponent', () => {
  let component: ResetPasswordModalComponent;
  let fixture: ComponentFixture<ResetPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ResetPasswordModalComponent],
      providers: [
        { provide: Session, useValue: sessionMock },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: ResetPasswordModalService,
          useValue: MockService(ResetPasswordModalService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
