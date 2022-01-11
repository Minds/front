export interface InputBalance {
  root: number;
  child: number;
}

enum RecordType {
  DEPOSIT,
  WITHDRAW,
}

export type HistoryRecord = DepositRecord | WithdrawRecord;

export interface Record {
  type: RecordType;
  amount: string; // in wei
  createdAt: Date;
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
