import { Component } from '@angular/core';

@Component({
  selector: 'm-text-input--autocomplete-container',
  styles: [
    `
      :host {
        position: relative;
        display: block;
      }
    `,
  ],
  template: '<ng-content></ng-content>',
})
export class TextInputAutocompleteContainerComponent {}
