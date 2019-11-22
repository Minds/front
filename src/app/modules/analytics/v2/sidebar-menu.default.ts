const sidebarMenu = {
  header: {
    id: 'analytics',
    label: 'Analytics',
    permissions: ['admin', 'user'],
  },
  links: [
    {
      id: 'summary',
      label: 'Summary',
      permissions: ['admin'],
      // path: '/some/path/outside/analytics/dashboard',
    },
    {
      id: 'traffic',
      label: 'Traffic',
      permissions: ['admin', 'user'],
    },
    {
      id: 'earnings',
      label: 'Earnings',
      permissions: ['admin', 'user'],
    },
    {
      id: 'engagement',
      label: 'Engagement',
      permissions: ['admin', 'user'],
    },
    {
      id: 'trending',
      label: 'Trending',
      permissions: ['admin', 'user'],
    },
    // {
    //   id: 'referrers',
    //   label: 'Referrers',
    //   permissions: ['admin', 'user'],
    // },
    // {
    //   id: 'plus',
    //   label: 'Plus',
    //   permissions: ['admin'],
    // },
    // {
    //   id: 'pro',
    //   label: 'Pro',
    //   permissions: ['admin'],
    // {
    //   id: 'boost',
    //   label: 'Boost',
    //   permissions: ['admin'],
    // },
    // {
    //   id: 'nodes',
    //   label: 'Nodes',
    //   permissions: ['admin'],
    // },
  ],
};

export default sidebarMenu;
