import { ApiResponse } from '../../../../../common/api/api.service';
import { MindsUser } from '../../../../../interfaces/entities';

// api response
export type WithdrawalApiResponse =
  | {
      withdrawals: Withdrawal[];
    }
  | ApiResponse;

// withdrawal entity returned by endpoint
export type Withdrawal = {
  timestamp: number;
  amount: string;
  user_guid: string;
  tx: string;
  status: WithdrawalStatus;
  completed: boolean;
  completed_tx: string;
  user: MindsUser;
};

// valid statuses
export type WithdrawalStatus =
  | 'approved'
  | 'pending'
  | 'pending_review'
  | 'failed'
  | 'rejected'
  | '';
