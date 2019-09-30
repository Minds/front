const categories: Array<any> = [
  {
    id: 'summary',
    label: 'Summary',
    type: 'summary',
    metrics: [],
  },
  {
    id: 'traffic',
    label: 'Traffic',
    type: 'chart',
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
    id: 'engagement',
    label: 'Engagement',
    type: 'chart',
    metrics: ['posts', 'votes', 'comments', 'reminds', 'subscribers', 'tags'],
  },
  {
    id: 'trending',
    label: 'Trending',
    type: 'table',
    metrics: ['top_content', 'top_channels'],
  },
  {
    id: 'referrers',
    label: 'Referrers',
    type: 'table',
    metrics: ['top_referrers'],
  },
  {
    id: 'plus',
    label: 'Plus',
    type: 'chart',
    metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  },
  {
    id: 'pro',
    label: 'Pro',
    type: 'chart',
    metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  },
  {
    id: 'boost',
    label: 'Boost',
    type: 'chart',
    metrics: ['transactions', 'users', 'revenue_tokens'],
  },
  {
    id: 'nodes',
    label: 'Nodes',
    type: 'chart',
    metrics: ['transactions', 'users', 'revenue_usd', 'revenue_tokens'],
  },
];

export default categories;
