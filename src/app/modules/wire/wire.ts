import { WireRewardsType } from './interfaces/wire.interfaces';

type WireTypeLabelsStruc = Array<{ type: WireRewardsType, label: string }>;

export const WireTypeLabels: WireTypeLabelsStruc = [
  { type: 'tokens', label: 'Tokens' }
];
