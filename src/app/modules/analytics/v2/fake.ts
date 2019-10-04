const fakeData = [
  {
    status: 'success',
    dashboard: {
      category: 'traffic',
      timespan: '30d',
      timespans: [
        {
          id: 'today',
          label: 'today',
          interval: 'day',
          comparison_interval: 1,
          from_ts_ms: 1570147200000,
          from_ts_iso: '2019-10-04T00:00:00+00:00',
        },
        {
          id: '30d',
          label: 'Last 30 days',
          interval: 'day',
          comparison_interval: 28,
          from_ts_ms: 1567555200000,
          from_ts_iso: '2019-09-04T00:00:00+00:00',
        },
        {
          id: '1y',
          label: '1 year ago',
          interval: 'month',
          comparison_interval: 365,
          from_ts_ms: 1538611200000,
          from_ts_iso: '2018-10-04T00:00:00+00:00',
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
      metric: {
        id: 'views',
        label: 'views',
        permissions: ['admin'],
        summary: {
          current_value: 558,
          comparison_value: 0,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        visualisation: {
          type: 'chart',
          buckets: [
            { key: 1568851200000, date: '2019-09-19T00:00:00+00:00', value: 1 },
            { key: 1568937600000, date: '2019-09-20T00:00:00+00:00', value: 0 },
            { key: 1569024000000, date: '2019-09-21T00:00:00+00:00', value: 1 },
            { key: 1569110400000, date: '2019-09-22T00:00:00+00:00', value: 0 },
            { key: 1569196800000, date: '2019-09-23T00:00:00+00:00', value: 2 },
            { key: 1569283200000, date: '2019-09-24T00:00:00+00:00', value: 1 },
            { key: 1569369600000, date: '2019-09-25T00:00:00+00:00', value: 0 },
            { key: 1569456000000, date: '2019-09-26T00:00:00+00:00', value: 0 },
            { key: 1569542400000, date: '2019-09-27T00:00:00+00:00', value: 0 },
            { key: 1569628800000, date: '2019-09-28T00:00:00+00:00', value: 2 },
            {
              key: 1569715200000,
              date: '2019-09-29T00:00:00+00:00',
              value: 61,
            },
            {
              key: 1569801600000,
              date: '2019-09-30T00:00:00+00:00',
              value: 161,
            },
            {
              key: 1569888000000,
              date: '2019-10-01T00:00:00+00:00',
              value: 202,
            },
            {
              key: 1569974400000,
              date: '2019-10-02T00:00:00+00:00',
              value: 127,
            },
            {
              key: 1570060800000,
              date: '2019-10-03T00:00:00+00:00',
              value: 160,
            },
            {
              key: 1570147200000,
              date: '2019-10-04T00:00:00+00:00',
              value: 19,
            },
          ],
        },
      },
      metrics: [
        {
          id: 'active_users',
          label: 'active users',
          permissions: ['admin'],
          summary: {
            current_value: 40500,
            comparison_value: 120962,
            comparison_interval: 28,
            comparison_positive_inclination: true,
          },
          visualisation: null,
        },
        {
          id: 'signups',
          label: 'signups',
          permissions: ['admin'],
          summary: {
            current_value: 49855,
            comparison_value: 62107,
            comparison_interval: 28,
            comparison_positive_inclination: true,
          },
          visualisation: null,
        },
        {
          id: 'views',
          label: 'views',
          permissions: ['admin'],
          summary: {
            current_value: 558,
            comparison_value: 0,
            comparison_interval: 28,
            comparison_positive_inclination: true,
          },
          visualisation: {
            type: 'chart',
            buckets: [
              {
                key: 1568851200000,
                date: '2019-09-19T00:00:00+00:00',
                value: 1,
              },
              {
                key: 1568937600000,
                date: '2019-09-20T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1569024000000,
                date: '2019-09-21T00:00:00+00:00',
                value: 1,
              },
              {
                key: 1569110400000,
                date: '2019-09-22T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1569196800000,
                date: '2019-09-23T00:00:00+00:00',
                value: 2,
              },
              {
                key: 1569283200000,
                date: '2019-09-24T00:00:00+00:00',
                value: 1,
              },
              {
                key: 1569369600000,
                date: '2019-09-25T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1569456000000,
                date: '2019-09-26T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1569542400000,
                date: '2019-09-27T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1569628800000,
                date: '2019-09-28T00:00:00+00:00',
                value: 2,
              },
              {
                key: 1569715200000,
                date: '2019-09-29T00:00:00+00:00',
                value: 61,
              },
              {
                key: 1569801600000,
                date: '2019-09-30T00:00:00+00:00',
                value: 161,
              },
              {
                key: 1569888000000,
                date: '2019-10-01T00:00:00+00:00',
                value: 202,
              },
              {
                key: 1569974400000,
                date: '2019-10-02T00:00:00+00:00',
                value: 127,
              },
              {
                key: 1570060800000,
                date: '2019-10-03T00:00:00+00:00',
                value: 160,
              },
              {
                key: 1570147200000,
                date: '2019-10-04T00:00:00+00:00',
                value: 19,
              },
            ],
          },
        },
      ],
      filter: ['view_type::single', 'channel::935752849747353613'],
      filters: [
        {
          id: 'platform',
          label: 'Platform',
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
          id: 'view_type',
          label: 'View types',
          options: [
            { id: 'total', label: 'Total', available: true, selected: false },
            {
              id: 'organic',
              label: 'Organic',
              available: true,
              selected: false,
            },
            {
              id: 'boosted',
              label: 'Boosted',
              available: true,
              selected: false,
            },
            { id: 'single', label: 'Single', available: true, selected: true },
          ],
        },
        {
          id: 'channel',
          label: 'Channel',
          options: [
            { id: 'all', label: 'All', available: true, selected: false },
            { id: 'self', label: 'Me', available: true, selected: false },
            {
              id: 'custom',
              label: 'Custom (Search)',
              available: true,
              selected: false,
            },
          ],
        },
      ],
    },
  },
];
export default fakeData;
