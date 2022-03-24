import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Hacky component used solely to apply styles to this apps body for the Transak modal,
 * which is directly injected into this apps body from the transakSDK. This solution
 * avoids us having to drop in Transak specific scss (out of place) into the `app.component.scss`.
 *
 * This component uses ViewEncapsulation.None, meaning that it can style elements
 * OUTSIDE of the host component scope. No template is attached, this component
 * solely applies CSS for the app body.
 */
@Component({
  selector: 'm-transak__globalStyle',
  encapsulation: ViewEncapsulation.None, // styles will apply globally.
  template: ``, // forced to provide a null template
  styleUrls: ['./transak-global-style.ng.scss'],
})
export class TransakGlobalStyleComponent {}
