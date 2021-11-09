import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassQuestionnaireBannerComponent } from './compass-questionnaire-banner.component';

describe('CompassQuestionnaireBannerComponent', () => {
  let component: CompassQuestionnaireBannerComponent;
  let fixture: ComponentFixture<CompassQuestionnaireBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassQuestionnaireBannerComponent],
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
