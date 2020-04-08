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
})
export class ShadowboxSubmitButtonComponent implements AfterViewInit {
  buttonTextWidth: number;
  @ViewChild('buttonTextContainer', { static: false })
  buttonTextContainer: ElementRef;

  @Input() disabled: boolean = false;
  @Input() color: 'green' | 'grey' | 'red' = 'green';

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
