import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordModalRequestFormComponent } from './request.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockService } from '../../../../../utils/mock';
import {
  ResetPasswordModalPanel,
  ResetPasswordModalService,
} from '../../reset-password-modal.service';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

describe('ResetPasswordModalRequestFormComponent', () => {
  let component: ResetPasswordModalRequestFormComponent;
  let fixture: ComponentFixture<ResetPasswordModalRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordModalRequestFormComponent],
      providers: [
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
          useValue: MockService(ResetPasswordModalService, {
            has: ['activePanel$', 'inProgress$', 'canSendEmail$'],
            props: {
              activePanel$: {
                get: () =>
                  new BehaviorSubject<ResetPasswordModalPanel>('enterUsername'),
              },
              inProgress$: { get: () => new BehaviorSubject<boolean>(false) },
              canSendEmail$: { get: () => new BehaviorSubject<boolean>(true) },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordModalRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
