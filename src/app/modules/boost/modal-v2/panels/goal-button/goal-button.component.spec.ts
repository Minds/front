import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostModalV2GoalButtonSelectorComponent } from './goal-button.component';
import { MockService } from '../../../../../utils/mock';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { BoostGoalsExperimentService } from '../../../../experiments/sub-services/boost-goals-experiment.service';
import { BehaviorSubject } from 'rxjs';
import { BoostModalPanel } from '../../boost-modal-v2.types';
import { BoostGoal } from '../../../boost.types';

describe('BoostModalV2GoalButtonSelectorComponent', () => {
  let fixture: ComponentFixture<BoostModalV2GoalButtonSelectorComponent>;
  let comp: BoostModalV2GoalButtonSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostModalV2GoalButtonSelectorComponent],
      providers: [
        FormBuilder,
        {
          provide: BoostModalV2Service,
          useValue: MockService(BoostModalV2Service),
        },
        {
          provide: BoostGoalsExperimentService,
          useValue: MockService(BoostGoalsExperimentService, {
            has: ['activePanel$', 'goal$', 'goalButtonText$', 'goalButtonUrl$'],
            props: {
              activePanel$: {
                get: () => new BehaviorSubject<any>(BoostModalPanel.AUDIENCE),
              },
              goal$: {
                get: () => new BehaviorSubject<any>(BoostGoal.SUBSCRIBERS),
              },
              goalButtonText$: { get: () => new BehaviorSubject<any>(null) },
              goalButtonUrl$: { get: () => new BehaviorSubject<any>(null) },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostModalV2GoalButtonSelectorComponent);
    comp = fixture.componentInstance;
  });

  it('should create the BoostModalV2GoalButtonSelectorComponent', () => {
    expect(comp).toBeTruthy();
  });

  it('should not validate a totally invalid URL', () => {
    expect(
      comp.goalButtonUrlValidator('goal_button_url')(
        new FormControl('invalidUrl')
      )
    ).toEqual({
      error: true,
      customMessage: "Please enter a valid URL (starting 'http')",
    });
  });

  it('should not validate an invalid URL without protocol', () => {
    expect(
      comp.goalButtonUrlValidator('goal_button_url')(
        new FormControl('www.minds.com')
      )
    ).toEqual({
      error: true,
      customMessage: "Please enter a valid URL (starting 'http')",
    });
  });

  it('should not validate an invalid URL without protocol or subdomain', () => {
    expect(
      comp.goalButtonUrlValidator('goal_button_url')(
        new FormControl('minds.com')
      )
    ).toEqual({
      error: true,
      customMessage: "Please enter a valid URL (starting 'http')",
    });
  });

  it('should validate a valid URL', () => {
    expect(
      comp.goalButtonUrlValidator('goal_button_url')(
        new FormControl('https://www.minds.com/')
      )
    ).toBeUndefined();
  });
});
