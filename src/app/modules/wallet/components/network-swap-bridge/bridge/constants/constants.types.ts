import { Network } from '../../../../../../common/services/network-switch-service';
import { BigNumber, BigNumberish } from 'ethers';
import { Observable } from 'rxjs';

export interface BridgeService {
  approve(amount?: BigNumberish): Promise<void>;
  withdraw(amount: BigNumber): Promise<void>;
  deposit(amount: BigNumber): Promise<void>;

  getLoadingState(): Observable<boolean>;
}

export interface InputBalance {
  root: number;
  child: number;
}

export enum RecordType {
  DEPOSIT,
  WITHDRAW,
}

export enum RecordStatus {
  PENDING = 'pending',
  UNKNOWN = 'unknown',
  ACTION_REQUIRED = 'action_required',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type HistoryRecord = DepositRecord | WithdrawRecord;

export interface Record {
  type: RecordType;
  status: RecordStatus;
  amount: string; // in wei
  timestamp?: number;
}

export interface DepositRecord extends Record {
  type: RecordType.DEPOSIT;
  txHash: string;
  txBlock: number;
  txPolygon?: string;
}

export interface WithdrawRecord extends Record {
  type: RecordType.WITHDRAW;
  txBurn: string;
  txHash?: string;
  txBlock?: number;
}

export interface CurrentStepData {
  amount?: string;
  from?: string;
  to?: string;
  title?: string;
  subtitle?: string;
}

export type CurrentStep =
  | {
      step: BridgeStep.SWAP | BridgeStep.PENDING;
      data?: {
        amount?: string;
      };
    }
  | {
      step: BridgeStep.CONFIRMATION | BridgeStep.APPROVAL;
      data: {
        amount: string;
        from: Network;
        to: Network;
      };
    }
  | {
      step: BridgeStep.ERROR;
      data: ErrorStepData;
    }
  | {
      step: BridgeStep.ACTION_REQUIRED;
      data: WithdrawRecord;
    };

export interface ErrorStepData {
  title?: string;
  subtitle?: string;
}

export enum BridgeStep {
  SWAP,
  APPROVAL,
  CONFIRMATION,
  PENDING,
  ERROR,
  ACTION_REQUIRED,
}

export enum DepositState {
  APPROVE,
  CONFIRM,
  COMPLETE,
}

export enum WithdrawState {
  INITIALIZE,
  WITHDRAW,
  COMPLETE,
}

export interface BridgeComponent {
  data: any;
}

export enum Titles {
  'Transaction in progress',
  'Transaction en-route',
  'Transfer complete',
}

export enum Descriptions {
  'Your transfer is currently in progress. We expect that it will ~2 minutes. You can close this window if you wish. We will notify you once the transaction is complete',
  'Your transfer is currently in progress. We expect that it will ~8 minutes. You can close this window if you wish. We will notify you once the transaction is complete',
  'Your transfer is now complete. Add summary.',
}
