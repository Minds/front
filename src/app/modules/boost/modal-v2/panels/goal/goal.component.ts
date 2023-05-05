import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostGoal } from '../../../boost.types';
import { BoostGoalsExperimentService } from '../../../../experiments/sub-services/boost-goals-experiment.service';
import { BoostModalPanel } from '../../boost-modal-v2.types';

/**
 * Goal selector panel for boost modal V2. Allows selection of
 * the goal for the boost (e.g. subscribers, clicks)
 */
@Component({
  selector: 'm-boostModalV2__goalSelector',
  templateUrl: './goal.component.html',
  styleUrls: ['goal.component.ng.scss'],
})
export class BoostModalV2GoalSelectorComponent implements OnInit, OnDestroy {
  public BoostGoal: typeof BoostGoal = BoostGoal;
  public form: FormGroup; // form group

  private goalChangeSubscription: Subscription; // change goal in service on value change.
  private goalInitSubscription: Subscription; // init the form using existing goal or default.

  constructor(
    private service: BoostModalV2Service,
    private formBuilder: FormBuilder,
    private boostGoalsExperiment: BoostGoalsExperimentService
  ) {}

  ngOnInit(): void {
    // Don't show this panel if the experiment is off
    if (!this.boostGoalsExperiment.isActive()) {
      this.service.activePanel$.next(BoostModalPanel.AUDIENCE);
    }

    this.goalInitSubscription = this.service.goal$
      .pipe(take(1))
      .subscribe((initialGoal: BoostGoal): void => {
        this.form = this.formBuilder.group({
          goal: new FormControl<BoostGoal>(initialGoal, Validators.required),
        });
      });

    // When the value form control changes, set the new value in the service
    this.goalChangeSubscription = this.form.controls.goal.valueChanges.subscribe(
      (goal: BoostGoal) => {
        this.service.goal$.next(goal);
      }
    );
  }

  ngOnDestroy(): void {
    this.goalInitSubscription?.unsubscribe();
    this.goalChangeSubscription?.unsubscribe();
  }

  /**
   * On radio button select, change form value
   * @param { BoostGoal } goal - goal selected.
   * @returns { void }
   */
  public selectRadioButton(goal: BoostGoal): void {
    this.form.controls.goal.setValue(goal);
  }
}
