import { Component } from '@angular/core';

/**
 * Invisible component to capture autofocus in ng-bootstrap modals (ngb-modal).
 * Can be inserted into a template when focus needs to be captured within the modal for
 * accessibility but there is no suitable focusable element - OR the style clashes with
 * the first detected element cause issues for keyboard and mouse users.
 *
 * If there is a focusable element already available, you should use ngbAutofocus on it directly.
 */
@Component({
  selector: 'm-ngbAutofocus-capture',
  template: `
    <input type="text" ngbAutofocus />
  `,
  styleUrls: ['./ngb-autofocus-capture.ng.scss'],
})
export class NgbAutofocusCaptureComponent {}
