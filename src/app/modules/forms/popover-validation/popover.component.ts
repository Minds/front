import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-popover',
  templateUrl: 'popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  @ViewChild('content', { static: true }) content: ElementRef;

  lengthCheck: boolean = false;
  specialCharCheck: boolean = false;
  mixedCaseCheck: boolean = false;
  numbersCheck: boolean = false;
  spacesCheck: boolean = false;

  hidden: boolean = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(protected cd: ChangeDetectorRef) {}

  show(): void {
    if (!this.hidden) {
      this.content.nativeElement.classList.add('m-popover__content--visible');
      this.detectChanges();
    }
  }

  hide(keepHidden: boolean = false): void {
    this.content.nativeElement.classList.remove('m-popover__content--visible');
    this.hidden = keepHidden;
    this.detectChanges();
  }

  checkRules(str: string): void {
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
      this.change.emit(true);
      setTimeout(() => this.hide(true), 500);
    } else {
      this.change.emit(false);
    }
    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
