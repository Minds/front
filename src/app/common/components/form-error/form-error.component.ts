import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { NgStyleValue } from '../../types/angular.types';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { GrowShrinkFast } from '../../../animations';

/**
 * Error display for a form - intended to be used alongside of an input with
 * validators that may display an error.
 *
 * Custom error messages can be added by custom validated providing their error
 * has the `message` property.
 */
@Component({
  selector: 'm-formError',
  template: `
    <div
      *ngIf="errorString$ | async"
      [@growShrink]="(errorString$ | async)?.length"
      [ngStyle]="customStyle"
    >
      {{ errorString$ | async }}
    </div>
  `,
  styleUrls: ['./form-error.component.ng.scss'],
  animations: [GrowShrinkFast],
})
export class FormErrorComponent {
  /** String of concatenated, parsed errors. */
  private readonly _errorString$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);

  /** Exposed error string, debounced to avoid jumping in the event of rapid change when typing. */
  protected readonly errorString$: Observable<string> = this._errorString$.pipe(
    debounceTime(300)
  );

  /**
   * Validation errors from form control.
   */
  @Input() set errors(errors: ValidationErrors) {
    this._errorString$.next(this.stringifyValidationErrors(errors));
  }

  /**
   * Pass custom styles in like this to avoid ng-deep.
   * Padding the bottom margin this way also makes the animation function fluidly.
   */
  @Input() protected customStyle: NgStyleValue = {
    margin: '0 0 20px 0',
  };

  /**
   * Stringify validation errors into a human readable comma separated string.
   * @param { ValidationErrors } errors - valiation errors to be parsed.
   * @returns { string } concatenated, parsed string for end-user consumption.
   */
  private stringifyValidationErrors(errors: ValidationErrors): string {
    if (!errors) {
      return null;
    }

    let errorStrings: string[] = [];

    // Text for inbuilt validators. Add as needed.
    if (errors.required) {
      errorStrings.push('Cannot be blank');
    }
    if (errors.minlength && errors.minlength.requiredLength) {
      errorStrings.push(
        `Must be at least ${errors.minlength.requiredLength} characters long`
      );
    }
    if (errors.maxlength && errors.maxlength.requiredLength) {
      errorStrings.push(
        `Must be at most ${errors.maxlength.requiredLength} characters long`
      );
    }

    // Custom messages - note multiple custom validators all passing "message"
    // will overwrite this property.
    if (errors.customMessage) {
      errorStrings.push(errors.customMessage);
    }

    return errorStrings.length ? errorStrings.join('. ') + '.' : null;
  }
}
