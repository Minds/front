import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { EnvironmentSelectorService } from './environment-selector.service';

/**
 * Allows user to switch between different environments.
 */
@Component({
  selector: 'm-devTools__environmentSelector',
  templateUrl: 'environment-selector.component.html',
  styleUrls: ['environment-selector.component.ng.scss'],
})
export class EnvironmentSelectorComponent implements OnInit {
  /** @type { boolean } - whether a switch is in progress */
  inProgress = false;

  /** @type { FormGroup } - Radio button FormGroup */
  form: UntypedFormGroup;

  constructor(private service: EnvironmentSelectorService) {}

  ngOnInit(): void {
    const currentEnv = this.service.getCurrentEnvironment();

    this.form = new UntypedFormGroup({
      environment: new UntypedFormControl(currentEnv),
    });
  }

  /**
   * Switch environments based on currently selected radio button.
   * @returns { Promise<void> }
   */
  public async switchToEnvironment(): Promise<void> {
    this.inProgress = true;
    await this.service.switchToEnvironment(this.form.get('environment').value);
    this.inProgress = true;
  }

  /**
   * Whether form can be submitted.
   * @returns { boolean } true if form can be submitted.
   */
  public canSubmit(): boolean {
    return Boolean(this.form.get('environment').value) && !this.inProgress;
  }
}
