import { Component, Input } from '@angular/core';

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
})
export class QRCodeComponent {
  @Input() data: string = '';
  @Input() width: number = 200;
}
