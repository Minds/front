import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryRecord } from '../polygon.types';
/**
 * Polygon component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon-progress-modal',
  templateUrl: 'progress-modal.component.html',
  styleUrls: ['./progress-modal.component.ng.scss'],
})
export class PolygonProgressModalComponent {
  @Output() goBack = new EventEmitter();
  @Input() transaction: HistoryRecord;

  navigate() {
    this.goBack.emit();
  }
}
