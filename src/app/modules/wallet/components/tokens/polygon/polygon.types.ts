export interface InputBalance {
  root: number;
  child: number;
}

export enum RecordType {
  DEPOSIT,
  WITHDRAW,
}

export enum RecordStatus {
  ACTION_REQUIRED,
  SUCCESS,
  ERROR,
}

export type HistoryRecord = DepositRecord | WithdrawRecord;

export type HistoryStatus =
  | RecordStatus.ACTION_REQUIRED
  | RecordStatus.SUCCESS
  | RecordStatus.ERROR;

export interface Record {
  type: HistoryRecord;
  amount: string; // in wei
  createdAt: Date;
  status: HistoryStatus;
}

export interface DepositRecord {
  type: RecordType.DEPOSIT;
  txHash: string;
}

export interface WithdrawRecord {
  type: RecordType.WITHDRAW;
  txHash?: string;
  txBurn: string;
}
