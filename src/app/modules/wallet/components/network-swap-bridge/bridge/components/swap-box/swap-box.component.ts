import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'm-networkSwapBox',
  templateUrl: 'swap-box.component.html',
  styleUrls: [
    '../../../network-swap-bridge-common.ng.scss',
    './swap-box.ng.scss',
  ],
})
export class NetworkBridgeSwapBoxComponent implements OnInit {
  // amount we are transacting.
  public amount = 0;

  // form for input amount
  public form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });
  }
}
