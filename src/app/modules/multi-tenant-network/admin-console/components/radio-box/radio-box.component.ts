import {
  Component,
  Input,
  Self,
  OnInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '../../../../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

/**
 * Radio box - selection box where different ng-content (e.g. images)
 * can be chosen between with radio buttons. Can be used as a
 * form control.
 */
@Component({
  selector: 'm-networkAdminConsole__radioBox',
  templateUrl: 'radio-box.component.html',
  styleUrls: ['./radio-box.component.ng.scss'],
  host: { '(click)': 'onClick()' },
  standalone: true,
  imports: [NgCommonModule, CommonModule],
})
export class NetworkAdminConsoleRadioBoxComponent<T>
  implements ControlValueAccessor, OnInit, OnDestroy {
  /** Title of box. */

  @Input() public title: string;

  /** Subtitle of box. */
  @Input() public subtitle: string;

  /** Whether component is in a saving state. */
  @HostBinding('class.m-radioBox__host--inProgress')
  @Input()
  public saving: boolean = false;

  /** Input value */
  @Input('value') inputValue: T;

  /** Currently held value by the control */
  public controlValue: T;

  /** Function to fire on change. */
  public onChange: (value: T) => void = (value: T) => {};

  /** Function to fire on touched. */
  public onTouched: () => void = () => {};

  // subscription.
  private valueChangeSubscription: Subscription;

  constructor(@Self() private ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.valueChangeSubscription = this.ngControl.control.valueChanges.subscribe(
      (value: T): void => {
        this.writeValue(value);
      }
    );
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }

  /**
   * Register the onChange function.
   * @param { (value: T) => void } fn - Function to fire on change.
   * @returns { void }
   */
  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  /**
   * Register the onTouched function.
   * @param { () => void } fn - Function to fire on touched.
   * @returns { void }
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Write a value to current control value.
   * @param { T } value - value to write.
   * @returns { void }
   */
  public writeValue(value: T): void {
    this.controlValue = value;
  }

  /**
   * Handles on click behavior for radio box.
   * @returns { void }
   */
  public onClick(): void {
    // prevent double clicks or clicks whilst saving.
    if (this.saving || this.controlValue === this.inputValue) {
      return;
    }

    this.controlValue = this.inputValue;
    this.onChange(this.controlValue);
  }
}
