import { Component } from '@angular/core';

/**
 * Wrap this component around a text input element
 * to get a dropdown menu of autocomplete suggestions
 * as you type
 *
 * Suggestions can either be users or hashtags
 */
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
