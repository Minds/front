export type Currency = 'tokens' | 'usd';

export default function currency(value: number, type: Currency) {
  switch (type) {
    case 'tokens':
      return `${value.toLocaleString()} tokens`;
    case 'usd':
      return `$ ${value.toLocaleString()}`;
  }
}
