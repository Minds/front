import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostGoal, BoostGoalButtonText } from '../../../boost.types';
import { BoostGoalsExperimentService } from '../../../../experiments/sub-services/boost-goals-experiment.service';
import { BoostModalPanel } from '../../boost-modal-v2.types';
import {
  DEFAULT_BUTTON_TEXT_FOR_CLICKS_GOAL,
  DEFAULT_BUTTON_TEXT_FOR_SUBSCRIBER_GOAL,
} from '../../boost-modal-v2.constants';

/**
 * Goal button selector panel for boost modal V2. Allows selection of
 * the goal button text for the boost (e.g. 'Stay in the loop') and
 * the goal button url, if applicable for the selected goal
 */
@Component({
  selector: 'm-boostModalV2__goalButtonSelector',
  templateUrl: './goal-button.component.html',
  styleUrls: ['goal-button.component.ng.scss'],
})
export class BoostModalV2GoalButtonSelectorComponent
  implements OnInit, OnDestroy {
  public BoostGoal: typeof BoostGoal = BoostGoal;
  public BoostGoalButtonText: typeof BoostGoalButtonText = BoostGoalButtonText;
  public form: FormGroup;
  private subscriptions: Subscription[] = [];
  private currentGoal: BoostGoal;

  constructor(
    protected service: BoostModalV2Service,
    private formBuilder: FormBuilder,
    private boostGoalsExperiment: BoostGoalsExperimentService
  ) {}

  ngOnInit(): void {
    // Don't show this panel if the experiment is off
    if (!this.boostGoalsExperiment.isActive()) {
      this.service.activePanel$.next(BoostModalPanel.AUDIENCE);
    }

    this.subscriptions.push(
      // initialize form with existing values,
      // or with defaults if values don't already exist
      combineLatest([
        this.service.goal$,
        this.service.goalButtonText$,
        this.service.goalButtonUrl$,
      ])
        .pipe(take(1))
        .subscribe(
          ([goal, buttonText, buttonUrl]: [
            BoostGoal,
            BoostGoalButtonText,
            string
          ]): void => {
            this.currentGoal = goal;

            if (goal === BoostGoal.SUBSCRIBERS) {
              this.form = this.formBuilder.group({
                goal_button_text: new FormControl<BoostGoalButtonText>(
                  buttonText,
                  Validators.required
                ),
              });
            } else if (goal === BoostGoal.CLICKS) {
              this.form = this.formBuilder.group({
                goal_button_text: new FormControl<BoostGoalButtonText>(
                  buttonText,
                  Validators.required
                ),
                goal_button_url: new FormControl<string>(
                  buttonUrl ? buttonUrl : null,
                  Validators.required
                ),
              });
            }
          }
        ),

      // change goal button text in service on value form control change.
      this.form.controls.goal_button_text.valueChanges.subscribe(
        (goalButtonText: BoostGoalButtonText) => {
          this.service.goalButtonText$.next(goalButtonText);
        }
      )
    );

    // change goal button url in service on value form control change.
    if (this.currentGoal === BoostGoal.CLICKS) {
      this.subscriptions.push(
        this.form.controls.goal_button_url.valueChanges.subscribe(
          (goalButtonUrl: string) => {
            this.service.goalButtonUrl$.next(goalButtonUrl);
          }
        )
      );
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * On radio button select, change form value
   * @param { BoostGoalButtonText } goalButtonText - button text selected.
   * @returns { void }
   */
  public selectRadioButton(goalButtonText: BoostGoalButtonText): void {
    this.form.controls.goal_button_text.setValue(goalButtonText);
  }
}
