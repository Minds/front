const fakeData = [
  {
    status: 'success',
    dashboard: {
      category: 'trending',
      timespan: '30d',
      timespans: [
        {
          id: 'today',
          label: 'today',
          interval: 'day',
          comparison_interval: 1,
          from_ts_ms: 1570665600000,
          from_ts_iso: '2019-10-10T00:00:00+00:00',
        },
        {
          id: '30d',
          label: 'Last 30 days',
          interval: 'day',
          comparison_interval: 28,
          from_ts_ms: 1568073600000,
          from_ts_iso: '2019-09-10T00:00:00+00:00',
        },
        {
          id: '1y',
          label: '1 year ago',
          interval: 'month',
          comparison_interval: 365,
          from_ts_ms: 1539129600000,
          from_ts_iso: '2018-10-10T00:00:00+00:00',
        },
        {
          id: 'mtd',
          label: 'month to date',
          interval: 'day',
          comparison_interval: 28,
          from_ts_ms: 1569888000000,
          from_ts_iso: '2019-10-01T00:00:00+00:00',
        },
        {
          id: 'ytd',
          label: 'year to date',
          interval: 'month',
          comparison_interval: 365,
          from_ts_ms: 1546300800000,
          from_ts_iso: '2019-01-01T00:00:00+00:00',
        },
      ],
      metric: 'views_table',
      metrics: [
        {
          id: 'views_table',
          label: 'Views breakdown',
          description: 'Views by post',
          unit: 'number',
          permissions: ['admin'],
          summary: {
            current_value: 0,
            comparison_value: 0,
            comparison_interval: 0,
            comparison_positive_inclination: true,
          },
          visualisation: {
            type: 'table',
            buckets: [
              {
                key: 'urn:activity:1021102637907521536',
                values: {
                  'views::total': 719,
                  'views::organic': 92,
                  'views::single': 2,
                },
              },
              {
                key: 'urn:activity:1010678674885230592',
                values: {
                  'views::total': 57,
                  'views::organic': 57,
                  'views::single': 1,
                },
              },
              {
                key: 'urn:user:930229554033729554',
                values: {
                  'views::total': 31,
                  'views::organic': 31,
                  'views::single': 31,
                },
              },
              {
                key: 'urn:activity:1015453482558922752',
                values: {
                  'views::total': 30,
                  'views::organic': 30,
                  'views::single': 2,
                },
              },
              {
                key: 'urn:activity:1021102579061436416',
                values: {
                  'views::total': 24,
                  'views::organic': 24,
                  'views::single': 0,
                },
              },
              {
                key: 'urn:activity:1010675242187943936',
                values: {
                  'views::total': 21,
                  'views::organic': 21,
                  'views::single': 0,
                },
              },
              {
                key: 'urn:activity:987638722647244800',
                values: {
                  'views::total': 19,
                  'views::organic': 19,
                  'views::single': 0,
                },
              },
              {
                key: 'urn:activity:1005210094609932288',
                values: {
                  'views::total': 17,
                  'views::organic': 17,
                  'views::single': 0,
                },
              },
              {
                key: 'urn:activity:1000436853962100736',
                values: {
                  'views::total': 15,
                  'views::organic': 15,
                  'views::single': 0,
                },
              },
              {
                key: 'urn:activity:1000271846053670912',
                values: {
                  'views::total': 13,
                  'views::organic': 13,
                  'views::single': 0,
                },
              },
            ],
            columns: ['views::total', 'views::organic', 'views::single'],
          },
        },
      ],
      filter: ['view_type::total', 'channel::self'],
      filters: [
        {
          id: 'platform',
          label: 'Platform',
          description: 'Filter by device types',
          options: [
            {
              id: 'all',
              label: 'All',
              description: 'Browsers, Mobile and APIs',
              available: true,
              selected: false,
            },
            {
              id: 'browser',
              label: 'Browser',
              description: 'Browsers',
              available: true,
              selected: false,
            },
            {
              id: 'mobile',
              label: 'Mobile',
              description: 'Native mobile applications',
              available: true,
              selected: false,
            },
          ],
        },
        {
          id: 'view_type',
          label: 'View types',
          description: 'Filter by the breakdown of views',
          options: [
            {
              id: 'total',
              label: 'Total',
              description: 'All views recorded on assets',
              available: true,
              selected: true,
            },
            {
              id: 'organic',
              label: 'Organic',
              description: 'Views on assets that excludes boosted impressions',
              available: true,
              selected: false,
            },
            {
              id: 'boosted',
              label: 'Boosted',
              description: 'Views recorded on assets that were boosted',
              available: true,
              selected: false,
            },
            {
              id: 'single',
              label: 'Single',
              description: null,
              available: true,
              selected: false,
            },
          ],
        },
        {
          id: 'channel',
          label: 'Channel',
          description: 'Filter by channels or by the full site',
          options: [
            {
              id: 'all',
              label: 'All',
              description: 'Global, site-wide metrics',
              available: true,
              selected: false,
            },
            {
              id: 'self',
              label: 'Me',
              description: 'Your currently logged in user',
              available: true,
              selected: true,
            },
            {
              id: 'custom',
              label: 'Custom (Search)',
              description: 'Search for a channel to view their metrics',
              available: true,
              selected: false,
            },
          ],
        },
      ],
    },
  },
  // {
  //   status: 'success',
  //   dashboard: {
  //     category: 'traffic',
  //     timespan: '30d',
  //     timespans: [
  //       {
  //         id: 'today',
  //         label: 'today',
  //         interval: 'day',
  //         comparison_interval: 1,
  //         from_ts_ms: 1570147200000,
  //         from_ts_iso: '2019-10-04T00:00:00+00:00',
  //       },
  //       {
  //         id: '30d',
  //         label: 'Last 30 days',
  //         interval: 'day',
  //         comparison_interval: 28,
  //         from_ts_ms: 1567555200000,
  //         from_ts_iso: '2019-09-04T00:00:00+00:00',
  //       },
  //       {
  //         id: '1y',
  //         label: '1 year ago',
  //         interval: 'month',
  //         comparison_interval: 365,
  //         from_ts_ms: 1538611200000,
  //         from_ts_iso: '2018-10-04T00:00:00+00:00',
  //       },
  //       {
  //         id: 'mtd',
  //         label: 'month to date',
  //         interval: 'day',
  //         comparison_interval: 28,
  //         from_ts_ms: 1569888000000,
  //         from_ts_iso: '2019-10-01T00:00:00+00:00',
  //       },
  //       {
  //         id: 'ytd',
  //         label: 'year to date',
  //         interval: 'month',
  //         comparison_interval: 365,
  //         from_ts_ms: 1546300800000,
  //         from_ts_iso: '2019-01-01T00:00:00+00:00',
  //       },
  //     ],
  //     metric: {
  //       id: 'views',
  //       label: 'views',
  //       permissions: ['admin'],
  //       summary: {
  //         current_value: 558,
  //         comparison_value: 0,
  //         comparison_interval: 28,
  //         comparison_positive_inclination: true,
  //       },
  //       visualisation: {
  //         type: 'chart',
  //         buckets: [
  //           { key: 1568851200000, date: '2019-09-19T00:00:00+00:00', value: 1 },
  //           { key: 1568937600000, date: '2019-09-20T00:00:00+00:00', value: 0 },
  //           { key: 1569024000000, date: '2019-09-21T00:00:00+00:00', value: 1 },
  //           { key: 1569110400000, date: '2019-09-22T00:00:00+00:00', value: 0 },
  //           { key: 1569196800000, date: '2019-09-23T00:00:00+00:00', value: 2 },
  //           { key: 1569283200000, date: '2019-09-24T00:00:00+00:00', value: 1 },
  //           { key: 1569369600000, date: '2019-09-25T00:00:00+00:00', value: 0 },
  //           { key: 1569456000000, date: '2019-09-26T00:00:00+00:00', value: 0 },
  //           { key: 1569542400000, date: '2019-09-27T00:00:00+00:00', value: 0 },
  //           { key: 1569628800000, date: '2019-09-28T00:00:00+00:00', value: 2 },
  //           {
  //             key: 1569715200000,
  //             date: '2019-09-29T00:00:00+00:00',
  //             value: 61,
  //           },
  //           {
  //             key: 1569801600000,
  //             date: '2019-09-30T00:00:00+00:00',
  //             value: 161,
  //           },
  //           {
  //             key: 1569888000000,
  //             date: '2019-10-01T00:00:00+00:00',
  //             value: 202,
  //           },
  //           {
  //             key: 1569974400000,
  //             date: '2019-10-02T00:00:00+00:00',
  //             value: 127,
  //           },
  //           {
  //             key: 1570060800000,
  //             date: '2019-10-03T00:00:00+00:00',
  //             value: 160,
  //           },
  //           {
  //             key: 1570147200000,
  //             date: '2019-10-04T00:00:00+00:00',
  //             value: 19,
  //           },
  //         ],
  //       },
  //     },
  //     metrics: [
  //       {
  //         id: 'active_users',
  //         label: 'active users',
  //         permissions: ['admin'],
  //         summary: {
  //           current_value: 40500,
  //           comparison_value: 120962,
  //           comparison_interval: 28,
  //           comparison_positive_inclination: true,
  //         },
  //         visualisation: null,
  //       },
  //       {
  //         id: 'signups',
  //         label: 'signups',
  //         permissions: ['admin'],
  //         summary: {
  //           current_value: 49855,
  //           comparison_value: 62107,
  //           comparison_interval: 28,
  //           comparison_positive_inclination: true,
  //         },
  //         visualisation: null,
  //       },
  //       {
  //         id: 'views',
  //         label: 'views',
  //         permissions: ['admin'],
  //         summary: {
  //           current_value: 558,
  //           comparison_value: 0,
  //           comparison_interval: 28,
  //           comparison_positive_inclination: true,
  //         },
  //         visualisation: {
  //           type: 'chart',
  //           buckets: [
  //             {
  //               key: 1568851200000,
  //               date: '2019-09-19T00:00:00+00:00',
  //               value: 1,
  //             },
  //             {
  //               key: 1568937600000,
  //               date: '2019-09-20T00:00:00+00:00',
  //               value: 0,
  //             },
  //             {
  //               key: 1569024000000,
  //               date: '2019-09-21T00:00:00+00:00',
  //               value: 1,
  //             },
  //             {
  //               key: 1569110400000,
  //               date: '2019-09-22T00:00:00+00:00',
  //               value: 0,
  //             },
  //             {
  //               key: 1569196800000,
  //               date: '2019-09-23T00:00:00+00:00',
  //               value: 2,
  //             },
  //             {
  //               key: 1569283200000,
  //               date: '2019-09-24T00:00:00+00:00',
  //               value: 1,
  //             },
  //             {
  //               key: 1569369600000,
  //               date: '2019-09-25T00:00:00+00:00',
  //               value: 0,
  //             },
  //             {
  //               key: 1569456000000,
  //               date: '2019-09-26T00:00:00+00:00',
  //               value: 0,
  //             },
  //             {
  //               key: 1569542400000,
  //               date: '2019-09-27T00:00:00+00:00',
  //               value: 0,
  //             },
  //             {
  //               key: 1569628800000,
  //               date: '2019-09-28T00:00:00+00:00',
  //               value: 2,
  //             },
  //             {
  //               key: 1569715200000,
  //               date: '2019-09-29T00:00:00+00:00',
  //               value: 61,
  //             },
  //             {
  //               key: 1569801600000,
  //               date: '2019-09-30T00:00:00+00:00',
  //               value: 161,
  //             },
  //             {
  //               key: 1569888000000,
  //               date: '2019-10-01T00:00:00+00:00',
  //               value: 202,
  //             },
  //             {
  //               key: 1569974400000,
  //               date: '2019-10-02T00:00:00+00:00',
  //               value: 127,
  //             },
  //             {
  //               key: 1570060800000,
  //               date: '2019-10-03T00:00:00+00:00',
  //               value: 160,
  //             },
  //             {
  //               key: 1570147200000,
  //               date: '2019-10-04T00:00:00+00:00',
  //               value: 19,
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //     filter: ['view_type::single', 'channel::935752849747353613'],
  //     filters: [
  //       {
  //         id: 'platform',
  //         label: 'Platform',
  //         options: [
  //           { id: 'all', label: 'All', available: true, selected: false },
  //           {
  //             id: 'browser',
  //             label: 'Browser',
  //             available: true,
  //             selected: false,
  //           },
  //           { id: 'mobile', label: 'Mobile', available: true, selected: false },
  //         ],
  //       },
  //       {
  //         id: 'view_type',
  //         label: 'View types',
  //         options: [
  //           { id: 'total', label: 'Total', available: true, selected: false },
  //           {
  //             id: 'organic',
  //             label: 'Organic',
  //             available: true,
  //             selected: false,
  //           },
  //           {
  //             id: 'boosted',
  //             label: 'Boosted',
  //             available: true,
  //             selected: false,
  //           },
  //           { id: 'single', label: 'Single', available: true, selected: true },
  //         ],
  //       },
  //       {
  //         id: 'channel',
  //         label: 'Channel',
  //         options: [
  //           { id: 'all', label: 'All', available: true, selected: false },
  //           { id: 'self', label: 'Me', available: true, selected: false },
  //           {
  //             id: 'custom',
  //             label: 'Custom (Search)',
  //             available: true,
  //             selected: false,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
];
export default fakeData;
