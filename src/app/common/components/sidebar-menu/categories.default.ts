const sidebarMenuCategories = [
  {
    category: {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics/dashboard/',
      permissions: ['admin', 'user'],
    },
    subcategories: [
      // {
      //   id: 'summary',
      //   label: 'Summary',
      //   permissions: ['admin', 'user'],
      // },
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
  },
  // {
  //   category: {
  //     id: 'test1',
  //     label: 'Test1',
  //     permissions: ['admin', 'user'],
  //     path: '/somepath/bork',
  //   },
  //   subcategories: [
  //     {
  //       id: 'nodes',
  //       label: 'Nodes',
  //       permissions: ['admin'],
  //     },
  //     {
  //       id: 'nodes2',
  //       label: 'Nodes2',
  //       permissions: ['admin'],
  //     },
  //   ],
  // },
  // {
  //   category: {
  //     id: 'test2',
  //     label: 'Test2 no subcats',
  //     path: '/anotherpath/test2',
  //   },
  // },
];

export default sidebarMenuCategories;
