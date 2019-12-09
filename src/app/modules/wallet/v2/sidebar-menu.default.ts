const sidebarMenu = {
  header: {
    id: 'Wallet',
    label: 'Wallet',
    permissions: ['admin', 'user'],
  },
  links: [
    {
      id: 'earnings',
      label: 'Earnings',
      permissions: ['pro'],
      path: 'analytics/dashboard/earnings',
    },
  ],
};

export default sidebarMenu;
