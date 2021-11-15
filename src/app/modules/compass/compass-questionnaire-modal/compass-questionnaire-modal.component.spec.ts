import { ComponentFixture, TestBed } from '@angular/core/testing';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { CompassService } from '../compass.service';

import { CompassQuestionnaireModalComponent } from './compass-questionnaire-modal.component';

describe('CompassQuestionnaireModalComponent', () => {
  let component: CompassQuestionnaireModalComponent;
  let fixture: ComponentFixture<CompassQuestionnaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassQuestionnaireModalComponent],
      providers: [{ provide: CompassService, useValue: compassServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassQuestionnaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
