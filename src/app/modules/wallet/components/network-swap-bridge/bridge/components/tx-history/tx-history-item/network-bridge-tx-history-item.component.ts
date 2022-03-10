import { Component, Input, OnInit } from '@angular/core';
import { RecordStatus } from '../../../constants/constants.types';

@Component({
  selector: 'm-networkBridgeTxHistoryItem',
  templateUrl: 'network-bridge-tx-history-item.component.html',
  styleUrls: ['./network-bridge-tx-history-item.ng.scss'],
})
export class NetworkBridgeTxHistoryItemComponent implements OnInit {
  @Input() item;

  constructor() {}
  ngOnInit(): void {}

  isPendingAction(item): boolean {
    return item.status === RecordStatus.PENDING;
  }

  isActionRequired(item): boolean {
    return item.status === RecordStatus.ACTION_REQUIRED;
  }

  isSuccess(item): boolean {
    return item.status === RecordStatus.SUCCESS;
  }
}
