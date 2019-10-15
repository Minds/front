const categories: Array<any> = [
  // {
  //   id: 'summary',
  //   label: 'Summary',
  //   permissions: ['admin', 'user'],
  //   metrics: [],
  // },
  {
    id: 'traffic',
    label: 'Traffic',
    permissions: ['admin', 'user'],
    metrics: [
      'active_users',
      'signups',
      'unique_visitors',
      'pageviews',
      'impressions',
      'retention',
    ],
  },
  {
    id: 'earnings',
    label: 'Earnings',
    permissions: ['admin', 'user'],
    metrics: ['total', 'pageviews', 'active_referrals', 'customers'],
  },
  // {
  //   id: 'engagement',
  //   label: 'Engagement',
  //   permissions: ['admin', 'user'],
  //   metrics: ['posts', 'votes', 'comments', 'reminds', 'subscribers', 'tags'],
  // },
  {
    id: 'trending',
    label: 'Trending',
    permissions: ['admin', 'user'],
    metrics: ['top_content', 'top_channels'],
  },
  // {
  //   id: 'referrers',
  //   label: 'Referrers',
  //   permissions: ['admin', 'user'],
  //   metrics: ['top_referrers'],
  // },
  // {
  //   id: 'plus',
  //   label: 'Plus',
  //   permissions: ['admin'],
  //   metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  // },
  // {
  //   id: 'pro',
  //   label: 'Pro',
  //   permissions: ['admin'],
  //   metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  // },
  // {
  //   id: 'boost',
  //   label: 'Boost',
  //   permissions: ['admin'],
  //   metrics: ['transactions', 'users', 'revenue_tokens'],
  // },
  // {
  //   id: 'nodes',
  //   label: 'Nodes',
  //   permissions: ['admin'],
  //   metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  // },
];

export default categories;
