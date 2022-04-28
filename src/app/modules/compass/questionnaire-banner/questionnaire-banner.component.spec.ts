import { ComponentFixture, TestBed } from '@angular/core/testing';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { MockComponent, MockService } from '../../../utils/mock';
import { CompassService } from '../compass.service';

import { CompassQuestionnaireBannerComponent } from './questionnaire-banner.component';
import { ModalService } from '../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../tests/modal-service-mock.spec';
import { ExperimentsService } from '../../experiments/experiments.service';

describe('CompassQuestionnaireBannerComponent', () => {
  let component: CompassQuestionnaireBannerComponent;
  let fixture: ComponentFixture<CompassQuestionnaireBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompassQuestionnaireBannerComponent,
        MockComponent({
          selector: 'm-button',
        }),
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: CompassService, useValue: compassServiceMock },
        { provide: Storage, useValue: MockService(Storage) },
        { provide: ModalService, useValue: modalServiceMock },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassQuestionnaireBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
