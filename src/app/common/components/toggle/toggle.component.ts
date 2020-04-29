import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'm-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toggle.component.html',
})
export class ToggleComponent {
  @Input('leftValue') leftValue: any;

  @Input('rightValue') rightValue: any;

  @Input('mModel') mModel: any;

  @Input('disabled') @HostBinding('class.disabled') disabled: boolean = false;

  @Output('mModelChange') mModelChange: EventEmitter<any> = new EventEmitter<
    any
  >();

  @HostListener('click') toggle() {
    if (this.disabled) {
      return;
    }
    if (this.mModel === this.leftValue) {
      this.mModelChange.emit(this.rightValue);
    } else {
      this.mModelChange.emit(this.leftValue);
    }
  }
}
