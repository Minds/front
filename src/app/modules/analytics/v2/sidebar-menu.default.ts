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
  ],
};

export default sidebarMenu;
