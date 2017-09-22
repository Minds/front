import { WireRewardsType } from './interfaces/wire.interfaces';

type WireTypeLabelsStruc = Array<{ type: WireRewardsType, label: string }>;

export const WireTypeLabels: WireTypeLabelsStruc = [
  { type: 'points', label: 'Points' },
  { type: 'money', label: '$ USD' },
  // { type: 'bitcoin', label: 'Bitcoin' },
];
