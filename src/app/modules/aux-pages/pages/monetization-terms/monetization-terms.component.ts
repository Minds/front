import { Component } from '@angular/core';
import { MarkedDirective } from '../../../../common/directives/marked.directive';

/**
 * Page describing the terms of service for
 * monetized accounts
 */
@Component({
  selector: 'm-aux__monetizationTerms',
  templateUrl: './monetization-terms.component.html',
  providers: [MarkedDirective],
})
export class AuxMonetizationTermsComponent {
  init: boolean = false;

  constructor(private markedDirective: MarkedDirective) {}
}
