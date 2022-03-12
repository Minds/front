export interface InputBalance {
  root: number;
  child: number;
}

export enum RecordType {
  DEPOSIT,
  WITHDRAW,
}

export enum RecordStatus {
  PENDING,
  UNKNOWN,
  ACTION_REQUIRED,
  SUCCESS,
  ERROR,
}

export type HistoryRecord = DepositRecord | WithdrawRecord;

export interface Record {
  type: RecordType;
  status: RecordStatus;
  amount: string; // in wei
}

export interface DepositRecord extends Record {
  type: RecordType.DEPOSIT;
  txHash: string;
  txBlock: number;
}

export interface WithdrawRecord extends Record {
  type: RecordType.WITHDRAW;
  txBurn: string;
  txHash?: string;
  txBlock?: number;
}

export enum BridgeStep {
  SWAP,
  APPROVAL,
  CONFIRMATION,
  ERROR,
}

export interface BridgeComponent {
  data: any;
}
