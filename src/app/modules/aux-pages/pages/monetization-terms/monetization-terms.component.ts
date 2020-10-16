import { Component } from '@angular/core';
import { MarkedDirective } from '../../../../common/directives/marked.directive';

@Component({
  selector: 'm-aux__monetizationTerms',
  templateUrl: './monetization-terms.component.html',
  providers: [MarkedDirective],
})
export class AuxMonetizationTermsComponent {
  init: boolean = false;

  constructor(private markedDirective: MarkedDirective) {}
}
