import { Component, Input, OnInit } from '@angular/core';
import { BridgeComponent } from '../../constants/constants.types';

@Component({
  selector: 'm-networkError',
  templateUrl: 'error-dialog.component.html',
  styleUrls: ['./error-dialog.ng.scss'],
})
export class NetworkBridgeErrorComponent implements OnInit, BridgeComponent {
  @Input() data;

  constructor() {}

  ngOnInit(): void {}
}
