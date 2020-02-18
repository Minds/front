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
  buttonTextWidth: number = 0;
  @ViewChild('buttonTextContainer', { static: false })
  buttonTextContainer: ElementRef;

  @Input() saving: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'green' | 'grey' | 'red' = 'green';
  constructor() {}

  ngAfterViewInit() {
    if (this.buttonTextContainer.nativeElement) {
      this.setSavingWidth();
    }
  }

  // Prevent button width from shrinking during saving animation
  @HostListener('window:resize')
  setSavingWidth() {
    this.buttonTextWidth = this.buttonTextContainer.nativeElement.clientWidth;
  }
}
