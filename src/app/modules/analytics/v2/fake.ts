const fakeData = [
  {
    status: 'success',
    dashboard: {
      category: 'traffic',
      timespan: 'mtd',
      timespans: [
        {
          id: 'today',
          label: 'today',
          interval: 'day',
          comparison_interval: 1,
          from_ts_ms: 1569542400000,
          from_ts_iso: '2019-09-27T00:00:00+00:00',
        },
        {
          id: '30d',
          label: 'Last 30 days',
          interval: 'day',
          comparison_interval: 28,
          from_ts_ms: 1566950400000,
          from_ts_iso: '2019-08-28T00:00:00+00:00',
        },
        {
          id: '1y',
          label: '1 year ago',
          interval: 'month',
          comparison_interval: 365,
          from_ts_ms: 1538006400000,
          from_ts_iso: '2018-09-27T00:00:00+00:00',
        },
        {
          id: 'mtd',
          label: 'month to date',
          interval: 'day',
          comparison_interval: 28,
          from_ts_ms: 1567296000000,
          from_ts_iso: '2019-09-01T00:00:00+00:00',
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
      metric: 'views',
      metrics: [
        {
          id: 'active_users',
          label: 'active users',
          permissions: ['admin'],
          summary: {
            current_value: 120962,
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
            current_value: 53060,
            comparison_value: 60577,
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
            current_value: 83898,
            comparison_value: 0,
            comparison_interval: 28,
            comparison_positive_inclination: true,
          },
          visualisation: {
            type: 'chart',
            buckets: [
              {
                key: 1567296000000,
                date: '2019-09-01T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567382400000,
                date: '2019-09-02T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567468800000,
                date: '2019-09-03T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567555200000,
                date: '2019-09-04T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567641600000,
                date: '2019-09-05T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567728000000,
                date: '2019-09-06T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567814400000,
                date: '2019-09-07T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567900800000,
                date: '2019-09-08T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1567987200000,
                date: '2019-09-09T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568073600000,
                date: '2019-09-10T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568160000000,
                date: '2019-09-11T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568246400000,
                date: '2019-09-12T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568332800000,
                date: '2019-09-13T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568419200000,
                date: '2019-09-14T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568505600000,
                date: '2019-09-15T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568592000000,
                date: '2019-09-16T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568678400000,
                date: '2019-09-17T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568764800000,
                date: '2019-09-18T00:00:00+00:00',
                value: 0,
              },
              {
                key: 1568851200000,
                date: '2019-09-19T00:00:00+00:00',
                value: 9565,
              },
              {
                key: 1568937600000,
                date: '2019-09-20T00:00:00+00:00',
                value: 10821,
              },
              {
                key: 1569024000000,
                date: '2019-09-21T00:00:00+00:00',
                value: 10674,
              },
              {
                key: 1569110400000,
                date: '2019-09-22T00:00:00+00:00',
                value: 10494,
              },
              {
                key: 1569196800000,
                date: '2019-09-23T00:00:00+00:00',
                value: 11203,
              },
              {
                key: 1569283200000,
                date: '2019-09-24T00:00:00+00:00',
                value: 14034,
              },
              {
                key: 1569369600000,
                date: '2019-09-25T00:00:00+00:00',
                value: 11618,
              },
              {
                key: 1569456000000,
                date: '2019-09-26T00:00:00+00:00',
                value: 5489,
              },
              {
                key: 1569542400000,
                date: '2019-09-27T00:00:00+00:00',
                value: 0,
              },
            ],
          },
        },
      ],
      filter: ['view_type::single'],
      filters: [
        {
          id: 'platform',
          label: 'Platform type',
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
            { id: 'total', label: 'Total', available: false, selected: false },
            {
              id: 'organic',
              label: 'Organic',
              available: false,
              selected: false,
            },
            {
              id: 'boosted',
              label: 'Boosted',
              available: false,
              selected: false,
            },
            { id: 'single', label: 'Single', available: true, selected: true },
          ],
        },
      ],
    },
  },
];
export default fakeData;
