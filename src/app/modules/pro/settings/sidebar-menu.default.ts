const sidebarMenu = {
  header: {
    id: 'pro_settings',
    label: 'Pro Settings',
    path: '/pro/:username/settings/',
    permissions: ['pro'],
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
      id: 'subscription',
      label: 'Pro Subscription',
      path: 'pro',
    },
    {
      id: 'payouts',
      label: 'Payouts',
    },
    {
      id: ':user',
      label: 'View Pro Channel',
      path: 'pro/:user',
      newWindow: true,
    },
  ],
};

export default sidebarMenu;
