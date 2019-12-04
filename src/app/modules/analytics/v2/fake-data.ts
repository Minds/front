const fakeData: Array<any> = [
  {
    // CHART TESTS
    loading: false,
    category: 'traffic',
    description: 'traffic description bleep bloop',
    timespan: '30d',
    timespans: [
      {
        id: '30d',
        label: 'Last 30 days',
        interval: 'day',
        comparison_interval: 30,
        from_ts_ms: 1567296000000,
        from_ts_iso: '2019-09-01T00:00:00+00:00',
        selected: true,
      },
      {
        id: '12m',
        label: 'Last 12 months',
        interval: 'day',
        comparison_interval: 365,
        from_ts_ms: 1538352000000,
        from_ts_iso: '2018-10-01T00:00:00+00:00',
        selected: false,
      },
    ],
    filter: ['platform::all', 'view_type::total', 'channel::all'],
    filters: [
      {
        id: 'platform',
        label: 'Platform',
        description: 'Filter by platform type:',
        options: [
          { id: 'all', label: 'All', available: true, selected: false },
          {
            id: 'browser',
            label: 'Browser',
            available: true,
            selected: false,
          },
          { id: 'mobile', label: 'Mobile', available: true, selected: false },
        ],
      },
      {
        id: 'channel',
        label: 'Channel',
        description: null,
        options: [
          {
            id: 'all',
            label: 'All',
            available: true,
            selected: true,
            description: null,
          },
          {
            id: 'self',
            label: 'Self',
            available: true,
            selected: false,
            description: null,
          },
          {
            id: 'search',
            label: 'Search',
            available: true,
            selected: false,
            description: null,
          },
        ],
      },
      {
        id: 'view_type',
        label: 'View Type',
        description: 'Filter by view type:',
        options: [
          { id: 'total', label: 'Total', available: true, selected: false },
          {
            id: 'organic',
            label: 'Organic',
            available: true,
            selected: true,
            description: 'bobloblaw',
          },
          {
            id: 'boosted',
            label: 'Boosted',
            available: false,
            selected: false,
            description: 'blablablabla',
          },
          {
            id: 'single',
            label: 'Single',
            available: true,
            selected: false,
            description: null,
          },
        ],
      },
    ],
    metric: 'views',
    metrics: [
      {
        id: 'active_users',
        label: 'Active Users',
        permissions: ['admin', 'user'],
        summary: {
          current_value: 120962,
          comparison_value: 120962,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        unit: 'number',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentiuti atque corrupti quos dolores',
        visualisation: null,
      },
      {
        id: 'active_users',
        label: 'Active UsersA',
        permissions: ['admin', 'user'],
        summary: {
          current_value: 120962,
          comparison_value: 120962,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        unit: 'number',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentiuti atque corrupti quos dolores',
        visualisation: null,
      },
      {
        id: 'signups',
        label: 'Signups',
        permissions: ['admin', 'user'],
        summary: {
          current_value: 53060,
          comparison_value: 60577,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        unit: 'number',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentiuti atque corrupti quos dolores',
        visualisation: null,
      },
      {
        id: 'views',
        label: 'Pageviews',
        permissions: ['admin', 'user'],
        summary: {
          current_value: 83898,
          comparison_value: 0,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        unit: 'usd',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-08T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-09T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-10T00:00:00+00:00',
                  value: 7,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-11T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-12T00:00:00+00:00',
                  value: 10.2,
                },
              ],
            },
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-08-01T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567382400000,
                  date: '2019-08-02T00:00:00+00:00',
                  value: 2,
                },
                {
                  key: 1567468800000,
                  date: '2019-08-03T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567555200000,
                  date: '2019-08-04T00:00:00+00:00',
                  value: 4,
                },
                {
                  key: 1567641600000,
                  date: '2019-08-05T00:00:00+00:00',
                  value: 5,
                },
                {
                  key: 1567296000000,
                  date: '2019-08-06T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567382400000,
                  date: '2019-08-07T00:00:00+00:00',
                  value: 2,
                },
                {
                  key: 1567468800000,
                  date: '2019-08-08T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567555200000,
                  date: '2019-08-09T00:00:00+00:00',
                  value: 4,
                },
                {
                  key: 1567641600000,
                  date: '2019-08-10T00:00:00+00:00',
                  value: 5,
                },
                {
                  key: 1567555200000,
                  date: '2019-08-11T00:00:00+00:00',
                  value: 4,
                },
                {
                  key: 1567641600000,
                  date: '2019-08-12T00:00:00+00:00',
                  value: 0.5,
                },
              ],
            },
          ],
        },
      },
    ],
  },
  // -----------------------------------------
  // TABLE TESTS
  // -----------------------------------------

  {
    loading: false,
    category: 'earnings',
    description: 'imma earnings description',
    timespan: '30d',
    timespans: [
      {
        id: '30d',
        label: 'Last 30 days',
        interval: 'day',
        comparison_interval: 28,
        from_ts_ms: 1567296000000,
        from_ts_iso: '2019-09-01T00:00:00+00:00',
      },
      {
        id: '1y',
        label: '1 year ago',
        interval: 'month',
        comparison_interval: 365,
        from_ts_ms: 1538352000000,
        from_ts_iso: '2018-10-01T00:00:00+00:00',
      },
    ],
    filter: ['channel::all'],
    filters: [
      {
        id: 'channel',
        label: 'Channel',
        description: 'Filter by channel type:',
        options: [
          {
            id: 'all',
            label: 'All',
            available: true,
            selected: true,
            description: 'bibbble',
          },
          {
            id: 'self',
            label: 'Self',
            available: true,
            selected: false,
            description: 'bliblabla',
          },
          {
            id: 'search',
            label: 'cantSeeMe',
            available: true,
            selected: false,
            description: 'should not be shown',
          },
        ],
      },
      {
        id: 'platform',
        label: 'Platform',
        options: [
          { id: 'all', label: 'All', available: true, selected: false },
          {
            id: 'browser',
            label: 'BrowserBrowserBrowserBrowserBrowserBrowser',
            available: true,
            selected: false,
          },
          { id: 'mobile', label: 'Mobile', available: true, selected: false },
        ],
      },
      {
        id: 'view_type',
        label: 'View Type',
        options: [
          { id: 'total', label: 'Total', available: true, selected: false },
          {
            id: 'organic',
            label: 'Organic',
            available: true,
            selected: true,
          },
          {
            id: 'boosted',
            label: 'Boosted',
            available: false,
            selected: false,
          },
          { id: 'single', label: 'Single', available: true, selected: false },
        ],
      },
    ],
    metric: 'views_table',
    metrics: [
      {
        id: 'views_table',
        label: 'Views',
        permissions: ['admin'],
        visualisation: {
          type: 'table',
          buckets: [
            {
              key: 'urn:blog:920262483603046400',
              values: {
                'views::total': 11,
                'views::organic': 11,
                'views::single': 11,
                entity: {
                  time_created: '1568665493',
                  title:
                    'My cool blog My cool blogMy cool blogMy cool blogMy cool blogMy cool blogMy cool blog',
                  route:
                    'minds/blog/announcing-post-scheduling-bitcoin-usd-and-ethereum-payments-1020417032624504832',
                  ownerObj: {
                    guid: '100000000000000000',
                    name: 'Minds Official',
                    username: 'Minds',
                  },
                  urn: 'urn:blog:920262483603046400',
                },
              },
            },
            {
              key: 'urn:image:937185477660028928',
              values: {
                'views::total': 22,
                'views::organic': 22,
                'views::single': 16,
                entity: {
                  time_created: '1570569175',
                  message: '',
                  ownerObj: {
                    guid: '1234567',
                    name: 'dogPhotographer',
                    username:
                      'doggooooosborkborkborkborkborkborkborkborkborkbork',
                  },
                  urn: 'urn:image:937185477660028928',
                },
              },
            },
            {
              key: 'urn:video:937185477660028928',
              values: {
                'views::total': 22,
                'views::organic': 22,
                'views::single': 16,
                entity: {
                  time_created: '1570519175',
                  title: 'My cool video',
                  ownerObj: {
                    guid: '1234567',
                    name: 'dogVideogrrapher',
                    username: 'doggooooosLIVE',
                  },
                  urn: 'urn:video:937185477660028928',
                },
              },
            },
            {
              key: 'urn:user:937185477660028928',
              values: {
                'views::total': 22,
                'views::organic': 22,
                'views::single': 16,
                entity: {
                  time_created: '1520569175',
                  guid: '1234567',
                  name: 'lilyisadog',
                  username: 'lilyisadog',
                  urn: 'urn:user:937185477660028928',
                },
              },
            },
            {
              key: 'urn:activity:937185177660028928',
              values: {
                'views::total': 16000000,
                'views::organic': 22,
                'views::single': 15,
                entity: {
                  time_created: '1570369175',
                  title: '',
                  ownerObj: {
                    guid: '1234567',
                    name: 'hank',
                    username: 'hank',
                  },
                  urn: 'urn:activity:937185177660028928',
                },
              },
            },
            {
              key: 'urn:activity:837185477660028928',
              values: {
                'views::total': 22,
                'views::organic': 22,
                'views::single': 16,
                entity: {
                  time_created: '1570569175',
                  title: '',
                  message: '',
                  remind_object: {
                    title: 'my cool thing that will be reminded',
                  },
                  ownerObj: {
                    guid: '1234567',
                    name: 'lily',
                    username: 'lily',
                  },
                  urn: 'urn:activity:837185477660028928',
                },
              },
            },
          ],
          columns: [
            { id: 'entity', label: 'Views' },
            { id: 'views::total', label: 'Total Views' },
            { id: 'views::organic', label: 'Organic' },
            { id: 'views::single', label: 'Single' },
          ],
        },
      },
    ],
  },
  // -----------------------------------------
  // SUMMARY
  // -----------------------------------------

  {
    loading: false,
    category: 'summary',
    timespan: '30d',
    timespans: [
      {
        id: '30d',
        label: 'Last 30 days',
        interval: 'day',
        comparison_interval: 28,
        from_ts_ms: 1567296000000,
        from_ts_iso: '2019-09-01T00:00:00+00:00',
      },
      {
        id: '1y',
        label: '1 year ago',
        interval: 'month',
        comparison_interval: 365,
        from_ts_ms: 1538352000000,
        from_ts_iso: '2018-10-01T00:00:00+00:00',
      },
    ],
    filter: ['channel::all'],
    filters: [
      {
        id: 'channel',
        label: 'Channel',
        description: 'Filter by channel type:',
        options: [
          {
            id: 'all',
            label: 'All',
            available: true,
            selected: true,
            description: 'bibbble',
          },
          {
            id: 'self',
            label: 'Self',
            available: true,
            selected: false,
            description: 'bliblabla',
          },
          {
            id: 'search',
            label: 'cantSeeMe',
            available: true,
            selected: false,
            description: 'should not be shown',
          },
        ],
      },
      {
        id: 'platform',
        label: 'Platform',
        options: [
          { id: 'all', label: 'All', available: true, selected: false },
          {
            id: 'browser',
            label: 'BrowserBrowserBrowserBrowserBrowserBrowser',
            available: true,
            selected: false,
          },
          { id: 'mobile', label: 'Mobile', available: true, selected: false },
        ],
      },
      {
        id: 'view_type',
        label: 'View Type',
        options: [
          { id: 'total', label: 'Total', available: true, selected: false },
          {
            id: 'organic',
            label: 'Organic',
            available: true,
            selected: true,
          },
          {
            id: 'boosted',
            label: 'Boosted',
            available: false,
            selected: false,
          },
          { id: 'single', label: 'Single', available: true, selected: false },
        ],
      },
    ],
    metric: 'summary',
    metrics: [
      {
        id: 'active_users',
        label: 'Active Users On Site',
        summary: {
          current_value: 83898,
          comparison_value: 0,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        value: 455,
        visualisation: null,
      },
      // {
      //   id: 'daily_active_users',
      //   label: 'Daily Active Users',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   visualisation: {
      //     type: 'chart',
      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'monthly_active_users',
      //   label: 'Monthly Active Users',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   visualisation: {
      //     type: 'chart',
      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'unique_visitors',
      //   label: 'Unique Visitors',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   visualisation: {
      //     type: 'chart',
      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'daily_page_views',
      //   label: 'Daily Page Views',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   visualisation: {
      //     type: 'chart',
      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'core_users',
      //   label: 'Core Users',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   visualisation: {
      //     type: 'chart',
      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'token_sales_eth',
      //   label: 'Token Sales (ETH)',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   unit: 'ETH',
      //   visualisation: {
      //     type: 'chart',

      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //           {
      //             key: 1567641600000,
      //             date: '2019-09-05T00:00:00+00:00',
      //             value: 1,
      //           },
      //           {
      //             key: 1567296000000,
      //             date: '2019-09-06T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             date: '2019-09-07T00:00:00+00:00',
      //             value: 12,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      // {
      //   id: 'boost_backlog',
      //   label: 'Boost Backlog',
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   unit: 'hours',
      //   visualisation: {
      //     type: 'chart',

      //     segments: [
      //       {
      //         buckets: [
      //           {
      //             key: 1567296000000,
      //             id: 'safe_newsfeed',
      //             label: 'Safe Newsfeed',
      //             date: '2019-09-01T00:00:00+00:00',
      //             value: 11,
      //           },
      //           {
      //             key: 1567382400000,
      //             id: 'open_newsfeed',
      //             label: 'Open Newsfeed',
      //             date: '2019-09-02T00:00:00+00:00',
      //             value: 12,
      //           },
      //           {
      //             key: 1567468800000,
      //             id: 'safe_sidebar',
      //             label: 'Safe Sidebar',
      //             date: '2019-09-03T00:00:00+00:00',
      //             value: 13,
      //           },
      //           {
      //             key: 1567555200000,
      //             id: 'open_sidebar',
      //             label: 'Open Sidebar',
      //             date: '2019-09-04T00:00:00+00:00',
      //             value: 9,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
    ],
  },
  {
    tiles: [
      // {
      //   id: 'active_users',
      //   label: 'Active Users On Site',
      //   summary: {
      //     current_value: 83898,
      //     comparison_value: 0,
      //     comparison_interval: 28,
      //     comparison_positive_inclination: true,
      //   },
      //   description:
      //     'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
      //   benchmark: {
      //     key: 1567382400000,
      //     date: '2019-09-07T00:00:00+00:00',
      //     value: 455,
      //   },
      //   visualisation: null,
      // },
      {
        id: 'daily_active_users',
        label: 'Daily Active Users',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 120000000,
        },
        value: 120000000,
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 1100000,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 1200000,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 1300000,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 900000,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 100000,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 1100000,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 1200000,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'monthly_active_users',
        label: 'Monthly Active Users',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 12,
        },
        value: 13,
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'unique_visitors',
        label: 'Unique Visitors',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 12,
        },
        value: 1200000000,
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'daily_page_views',
        label: 'Daily Page Views',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 12,
        },
        value: 1200,
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'core_users',
        label: 'Core Users',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 12,
        },
        value: 12.689,
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
              ],
            },
          ],
        },
      },
      {
        id: 'token_sales_eth',
        label: 'Token Sales (ETH)',
        description:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui',
        unit: 'eth',
        benchmark: {
          key: 1567382400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 1.2,
        },
        value: 1.0673492,
        visualisation: {
          type: 'chart',
          segments: [
            {
              buckets: [
                {
                  key: 1567296000000,
                  date: '2019-09-01T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-02T00:00:00+00:00',
                  value: 12,
                },
                {
                  key: 1567468800000,
                  date: '2019-09-03T00:00:00+00:00',
                  value: 13,
                },
                {
                  key: 1567555200000,
                  date: '2019-09-04T00:00:00+00:00',
                  value: 9,
                },
                {
                  key: 1567641600000,
                  date: '2019-09-05T00:00:00+00:00',
                  value: 1,
                },
                {
                  key: 1567296000000,
                  date: '2019-09-06T00:00:00+00:00',
                  value: 11,
                },
                {
                  key: 1567382400000,
                  date: '2019-09-07T00:00:00+00:00',
                  value: 12,
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    boosts: {
      id: 'boost_backlog',
      label: 'Boost Backlog',
      unit: 'hours',
      buckets: [
        {
          id: 'safe_newsfeed',
          label: 'Safe Newsfeed',
          value: 11.079184,
        },
        {
          id: 'open_newsfeed',
          label: 'Open Newsfeed',
          value: 0.12,
        },
        {
          id: 'safe_sidebar',
          label: 'Safe Sidebar',
          value: 13,
        },
        {
          id: 'open_sidebar',
          label: 'Open Sidebar',
          value: 1,
        },
      ],
      // visualisation: {
      //   type: 'chart',

      //   segments: [
      //     {
      //       buckets: [
      //         {
      //           key: 1567296000000,
      //           id: 'safe_newsfeed',
      //           label: 'Safe Newsfeed',
      //           date: '2019-09-01T00:00:00+00:00',
      //           value: 11,
      //         },
      //         {
      //           key: 1567382400000,
      //           id: 'open_newsfeed',
      //           label: 'Open Newsfeed',
      //           date: '2019-09-02T00:00:00+00:00',
      //           value: 12,
      //         },
      //         {
      //           key: 1567468800000,
      //           id: 'safe_sidebar',
      //           label: 'Safe Sidebar',
      //           date: '2019-09-03T00:00:00+00:00',
      //           value: 13,
      //         },
      //         {
      //           key: 1567555200000,
      //           id: 'open_sidebar',
      //           label: 'Open Sidebar',
      //           date: '2019-09-04T00:00:00+00:00',
      //           value: 9,
      //         },
      //       ],
      //     },
      //   ],
      // },
    },
  },
];
export default fakeData;
