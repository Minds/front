import { ComponentFixture, TestBed } from '@angular/core/testing';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { MockService } from '../../../utils/mock';
import { CompassService } from '../compass.service';

import { CompassQuestionnaireBannerComponent } from './compass-questionnaire-banner.component';

describe('CompassQuestionnaireBannerComponent', () => {
  let component: CompassQuestionnaireBannerComponent;
  let fixture: ComponentFixture<CompassQuestionnaireBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassQuestionnaireBannerComponent],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: CompassService, useValue: compassServiceMock },
        { provide: Storage, useValue: MockService(Storage) },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
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
