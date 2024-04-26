import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { MockService } from '../../../../../utils/mock';
import { BoostModalV2GoalSelectorComponent } from './goal.component';
import { BoostGoal, BoostGoalButtonText } from '../../../boost.types';
import {
  DEFAULT_BUTTON_TEXT_FOR_CLICKS_GOAL,
  DEFAULT_BUTTON_TEXT_FOR_SUBSCRIBER_GOAL,
} from '../../boost-modal-v2.constants';

describe('BoostModalV2GoalSelectorComponent', () => {
  let comp: BoostModalV2GoalSelectorComponent;
  let fixture: ComponentFixture<BoostModalV2GoalSelectorComponent>;

  const getSelectedRadioButtonLabel = (): DebugElement =>
    fixture.debugElement.query(
      By.css('.m-boostGoalSelector__radioButtonRow--selected label')
    );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [BoostModalV2GoalSelectorComponent],
      providers: [
        {
          provide: BoostModalV2Service,
          useValue: MockService(BoostModalV2Service, {
            has: ['goal$'],
            props: {
              goal$: {
                get: () => new BehaviorSubject<BoostGoal>(BoostGoal.VIEWS),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostModalV2GoalSelectorComponent);
    comp = fixture.componentInstance;

    (comp as any).service.goal$.next(BoostGoal.VIEWS);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should update service when engagement is selected', (done: DoneFn) => {
    (comp as any).service.goal$.next(BoostGoal.ENGAGEMENT);
    comp.selectRadioButton(BoostGoal.ENGAGEMENT);

    (comp as any).service.goal$.subscribe((goal: BoostGoal) => {
      expect(goal).toBe(BoostGoal.ENGAGEMENT);
      done();
    });
  });

  it('should update service when views is selected', (done: DoneFn) => {
    (comp as any).service.goal$.next(BoostGoal.VIEWS);
    comp.selectRadioButton(BoostGoal.VIEWS);

    (comp as any).service.goal$.subscribe((goal: BoostGoal) => {
      expect(goal).toBe(BoostGoal.VIEWS);
      done();
    });
  });

  it('should update service when subscribers is selected', (done: DoneFn) => {
    (comp as any).service.goal$.next(BoostGoal.SUBSCRIBERS);
    comp.selectRadioButton(BoostGoal.SUBSCRIBERS);

    (comp as any).service.goal$.subscribe((goal: BoostGoal) => {
      expect(goal).toBe(BoostGoal.SUBSCRIBERS);
      done();
    });
  });

  it('should update service when clicks is selected', (done: DoneFn) => {
    (comp as any).service.goal$.next(BoostGoal.CLICKS);
    comp.selectRadioButton(BoostGoal.CLICKS);

    (comp as any).service.goal$.subscribe((goal: BoostGoal) => {
      expect(goal).toBe(BoostGoal.CLICKS);
      done();
    });
  });
});
