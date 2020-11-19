import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'm-shadowboxSubmitButton',
  templateUrl: './shadowbox-submit-button.component.html',
  styleUrls: ['./shadowbox-submit-button.component.ng.scss'],
})
export class ShadowboxSubmitButtonComponent implements AfterViewInit {
  buttonTextWidth: number;
  @ViewChild('buttonTextContainer')
  buttonTextContainer: ElementRef;

  @Input() type: string = 'submit';
  @Input() disabled: boolean = false;
  @Input() overlay: boolean = false;
  @Input() color: 'blue' | 'grey' | 'red' = 'grey';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private _saving: boolean;
  @Input() set saving(value: boolean) {
    if (value && !this.buttonTextWidth) {
      // Handles width for buttons that are not visible onInit
      this.setSavingWidth();
    }
    this._saving = value;
  }
  get saving(): boolean {
    return this._saving;
  }

  constructor() {}

  ngAfterViewInit() {
    this.setSavingWidth();
  }

  // Prevent button width from shrinking during saving animation
  @HostListener('window:resize')
  resize() {
    this.setSavingWidth();
  }

  setSavingWidth() {
    if (this.buttonTextContainer && !this.saving) {
      const elWidth = this.buttonTextContainer.nativeElement.clientWidth || 0;
      this.buttonTextWidth = elWidth > 0 ? elWidth : this.buttonTextWidth;
    }
  }
}
