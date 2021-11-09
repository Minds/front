import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassQuestionnaireModalComponent } from './compass-questionnaire-modal.component';

describe('CompassQuestionnaireModalComponent', () => {
  let component: CompassQuestionnaireModalComponent;
  let fixture: ComponentFixture<CompassQuestionnaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassQuestionnaireModalComponent],
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
