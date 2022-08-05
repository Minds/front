export type Reason = {
  code: number; // numerical code for the reason
  label: string; // text label for the reason
  deprecated?: boolean; // hide the option from selection by admins.
};

export const rejectionReasons: Array<Reason> = [
  { code: 0, label: 'Illegal' },
  { code: 1, label: 'Explicit' },
  { code: 2, label: 'Encourages or incites violence' },
  {
    code: 3,
    label: 'Threatens, harasses, bullies or encourages others to do so',
  },
  { code: 4, label: 'Personal and confidential information' },
  {
    code: 5,
    label: 'Maliciously targets users (@name, links, images or videos)',
  },
  {
    code: 6,
    label: 'Impersonates someone in a misleading or deceptive manner',
  },
  { code: 7, label: 'Spam' },
  { code: 8, label: 'Appeals on Boost decisions' },
  {
    code: 12,
    label: 'Due to high boost backlog, your tokens have been auto-refunded.',
    deprecated: true, // still used for auto-rejections but is no longer admin-selectable.
  },
  { code: 13, label: 'Original post removed' },
  { code: 14, label: 'High Boost backlog' },
  { code: 15, label: 'Support Request' },
  { code: 16, label: 'Onchain payment failed' },
];
