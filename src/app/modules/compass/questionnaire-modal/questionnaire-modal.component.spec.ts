import { ComponentFixture, TestBed } from '@angular/core/testing';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { MockComponent } from '../../../utils/mock';
import { CompassService } from '../compass.service';

import { CompassQuestionnaireModalComponent } from './questionnaire-modal.component';

describe('CompassQuestionnaireModalComponent', () => {
  let component: CompassQuestionnaireModalComponent;
  let fixture: ComponentFixture<CompassQuestionnaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompassQuestionnaireModalComponent,
        MockComponent({
          selector: 'm-button',
        }),
        MockComponent({
          selector: 'm-compassForm',
        }),
      ],
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
