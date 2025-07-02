import { Component, Input } from '@angular/core';
import { QRCodeComponent as AngularQRCodeComponent } from 'angularx-qrcode';

/**
 * Displays a QR code with associated data
 *
 * Width is configurable
 */
@Component({
  selector: 'm-qr-code',
  template: `
    <qrcode
      [qrdata]="data"
      [width]="width"
      [errorCorrectionLevel]="'M'"
    ></qrcode>
  `,
  standalone: true,
  imports: [AngularQRCodeComponent],
})
export class QRCodeComponent {
  @Input() data: string = '';
  @Input() width: number = 200;
}
