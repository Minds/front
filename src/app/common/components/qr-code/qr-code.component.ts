import { Component, Input, ElementRef } from '@angular/core';

declare var require: any;
let QRCode: any;

@Component({
  selector: 'm-qr-code',
  template: '',
})
export class QRCodeComponent {
  qrcode;
  @Input() data: string = '';

  constructor(public el: ElementRef) {}

  ngOnInit() {
    if (!QRCode) {
      QRCode = require('qrcodejs2');
    }
    this.qrcode = new QRCode(this.el.nativeElement, {
      colorDark: '#000',
      colorLight: '#FFF',
      correctLevel: QRCode.CorrectLevel['M'],
      height: 300,
      text: this.data || ' ',
      useSVG: true,
      width: 300,
    });
  }
}
