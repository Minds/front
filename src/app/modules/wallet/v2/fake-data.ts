const fakeData: Array<any> = [
  {
    // CHART TESTS
    loading: false,
    category: 'wallet',
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
        interval: 'month',
        comparison_interval: 365,
        from_ts_ms: 1538352000000,
        from_ts_iso: '2018-10-01T00:00:00+00:00',
        selected: false,
      },
    ],
    filter: [],
    filters: [],
    metric: 'tokens',
    metrics: [
      {
        id: 'tokens',
        label: 'Tokens',
        unit: 'tokens',
        value: 1.450289,
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
          ],
        },
      },
      {
        id: 'active_users',
        label: 'Active Users B',
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
        label: 'Pageviews USD',
        permissions: ['admin', 'user'],
        summary: {
          current_value: 83898,
          comparison_value: 0,
          comparison_interval: 28,
          comparison_positive_inclination: true,
        },
        unit: 'usd',
        visualisation: null,
      },
    ],
  },
];
export default fakeData;
