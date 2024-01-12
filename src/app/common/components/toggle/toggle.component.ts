import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

export type ToggleDirection = 'left' | 'right';
export type ToggleSize = 'small' | 'large';
export type GenericToggleValue = 'off' | 'on';
@Component({
  selector: 'm-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toggle.component.html',
  styleUrls: ['toggle.component.ng.scss'],
})
export class ToggleComponent {
  @Input('leftValue') leftValue: any;

  @Input('rightValue') rightValue: any;

  @Input('offState') offState: any;

  @Input('mModel') mModel: any;

  @Input('disabled') @HostBinding('class.disabled') disabled: boolean = false;

  /**
   * SMALL: simple toggle/track element only (no text)
   * LARGE: Display text on the toggle button itself
   * (offState style not yet implemented for large size)
   * */
  @Input('size')
  size: ToggleSize = 'small';

  @Output('mModelChange') mModelChange: EventEmitter<any> = new EventEmitter<
    any
  >();

  @HostBinding('class.m-toggle--large')
  get isLarge() {
    return this.size === 'large';
  }

  /**
   * Switch the value on the small toggle
   */
  protected clickedSmallToggle() {
    if (this.disabled) {
      return;
    }
    if (this.mModel === this.leftValue) {
      this.mModelChange.emit(this.rightValue);
    } else {
      this.mModelChange.emit(this.leftValue);
    }
  }

  /**
   * Switch the value on the toggle
   * with text on it to the value that was clicked
   */
  protected clickedLargeToggle(value) {
    if (this.disabled) {
      return;
    }

    this.mModelChange.emit(value);
  }

  // Get the text to display on the toggle
  protected getToggleText(toggleDirection): string {
    return this.size === 'large'
      ? toggleDirection === 'left'
        ? this.leftValue
        : this.rightValue
      : '';
  }
}
