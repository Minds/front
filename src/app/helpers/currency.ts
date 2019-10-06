export type Currency = 'usd' | 'tokens';

export const tokenRate = 4;

// TODO: Move to an async service

export default function currency(tokens: number, currency: Currency): string {
  switch (currency) {
    case 'usd':
      return `$${(tokens / tokenRate).toLocaleString()}`;
    case 'tokens':
      return `${tokens.toLocaleString()} tokens`;
  }
}
