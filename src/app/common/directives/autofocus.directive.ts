import { Directive, ElementRef } from '@angular/core';

/**
 * Autofocus host element after view init.
 * Based on example from Netanel Basal's blog:
 * https://netbasal.com/autofocus-that-works-anytime-in-angular-apps-68cb89a3f057
 */
@Directive({
  selector: '[mAutofocus]',
})
export class AutofocusDirective {
  constructor(private host: ElementRef) {}

  /**
   * After view init force element focus.
   * @returns { void }
   */
  ngAfterViewInit(): void {
    this.host.nativeElement.focus();
  }
}
