const fakeData = {
  timespan: '7d',
  timespans: [
    {
      // Assume today is Nov 17th
      id: '7d',
      label: '7D',
      interval: 'day',
      from_ts_ms: 1572566400000,
      from_ts_iso: '2019-11-01T00:00:00+00:00',
    },
    {
      id: '30d',
      label: '30D',
      interval: 'day',
      from_ts_ms: 1571270400000,
      from_ts_iso: '2019-10-17T00:00:00+00:00',
    },
    {
      id: '12m',
      label: '12M',
      interval: 'month',
      from_ts_ms: 1542412800000,
      from_ts_iso: '2018-11-17T00:00:00+00:00',
    },
  ],
  currency: 'tokens',
  currencies: [
    {
      id: 'tokens',
      label: 'Tokens',
      unit: 'tokens',
      value: 2167.457,
      // value_offchain: 2166.255,
      // value_onchain: 1.202,
      // top_tabs: [
      //   { id: 'overview', label: 'Overview' },
      //   { id: 'transactions', label: 'Transactions' },
      //   { id: 'settings', label: 'Settings' },
      // ],
      visualisation: {
        type: 'chart',
        unit: 'tokens',
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
      id: 'usd',
      label: 'USD',
      unit: 'usd',
      value: 13577, // this is usd in CENTS
      visualisation: null,
      // top_tabs: [
      //   { id: 'transactions', label: 'Transactions' },
      //   { id: 'settings', label: 'Settings' },
      // ],
    },
    {
      id: 'eth',
      label: 'Ether',
      unit: 'eth',
      value: 15.3570957,
      visualisation: null,
      // top_tabs: [{ id: 'settings', label: 'Settings' }],
    },
    {
      id: 'btc',
      label: 'Bitcoin',
      unit: 'btc',
      visualisation: null,
      // top_tabs: [{ id: 'settings', label: 'Settings' }],
    },
  ],
};
export default fakeData;
