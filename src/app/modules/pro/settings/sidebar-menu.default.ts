const sidebarMenu = {
  header: {
    id: 'pro_settings',
    label: 'Pro Settings',
    permissions: ['user'],
  },
  links: [
    {
      id: 'general',
      label: 'General',
    },
    {
      id: 'theme',
      label: 'Theme',
    },
    {
      id: 'assets',
      label: 'Assets',
    },
    {
      id: 'hashtags',
      label: 'Hashtags',
    },
    {
      id: 'footer',
      label: 'Footer',
    },
    {
      id: 'domain',
      label: 'Domain',
    },
    {
      id: 'payouts',
      label: 'Payouts',
    },
    {
      id: 'earnings',
      label: 'Earnings',
      path: 'analytics/dashboard/earnings',
    },
    {
      id: ':username',
      label: 'View Pro Channel',
      path: 'pro/:username',
      newWindow: true,
    },
  ],
};

export default sidebarMenu;
