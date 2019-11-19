import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-popover--validation',
  templateUrl: 'popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef;

  lengthCheck: boolean = false;
  specialCharCheck: boolean = false;
  mixedCaseCheck: boolean = false;
  numbersCheck: boolean = false;
  spacesCheck: boolean = false;

  hidden: boolean = false;

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit() {}

  show() {
    if (!this.hidden) {
      this.content.nativeElement.classList.add('m-popover__content--visible');
      this.detectChanges();
    }
  }

  hide(keepHidden: boolean = false) {
    this.content.nativeElement.classList.remove('m-popover__content--visible');
    this.hidden = keepHidden;
    this.detectChanges();
  }

  checkRules(str: string) {
    this.lengthCheck = str.length >= 8;
    this.specialCharCheck = /[^a-zA-Z\d]/.exec(str) !== null;
    this.mixedCaseCheck =
      /[a-z]/.exec(str) !== null && /[A-Z]/.exec(str) !== null;
    this.numbersCheck = /\d/.exec(str) !== null;
    this.spacesCheck = /\s/.exec(str) === null;

    // if everything is right, wait a bit and hide
    if (
      this.lengthCheck &&
      this.specialCharCheck &&
      this.mixedCaseCheck &&
      this.numbersCheck &&
      this.spacesCheck
    ) {
      setTimeout(() => this.hide(true), 500);
    }
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
