const fakeData = {
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
  token_transactions: {
    pending: {
      total_points: 7,
      contributions: [
        { id: 'checkins', label: 'Check-ins', occurences: 1, points: 2 },
        { id: 'comments', label: 'Comments', occurences: 2, points: 4 },
        { id: 'votes', label: 'Votes', occurences: 1, points: 1 },
      ],
    },
    days: [
      {
        ts_ms: 1567296000000, // today's date
        transactions: [
          {
            ts_ms: 1567296000090, // time of tx
            type_id: 'boosts',
            type_label: 'Boosts',
            diff: -5.0,
            running_total: 25.0,
          },
          {
            ts_ms: 1567296000080,
            type_id: 'rewards',
            type_label: 'Rewards',
            diff: 0.4,
            running_total: 30.0,
            details: {
              total_points: 10,
              contributions: [
                {
                  id: 'checkins',
                  label: 'Check-ins',
                  occurences: 4,
                  points: 8,
                },
                { id: 'comments', label: 'Comments', occurences: 1, points: 2 },
              ],
            },
          },
          {
            ts_ms: 1567296000070,
            type_id: 'wires',
            type_label: 'Wires', // make sure we have the label field bc this eventually needs to change to 'Pay'
            diff: -1.5,
            running_total: 29.6,
            subtype_id: 'offchain_wires_outbound',
            entity: {
              user_guid: 123,
              username: 'my_wire_recipient',
              //...etc...
            },
          },
          {
            ts_ms: 1567296000060,
            type_id: 'wires',
            type_label: 'Wires',
            diff: 2.0,
            running_total: 30.1,
            subtype_id: 'offchain_wires_inbound',
            entity: {
              user_guid: 456,
              username: 'whoever_wired_me',
              //...etc...
            },
          },
        ],
      },
      {
        ts_ms: 1567295000000, // yesterday's date
        transactions: [
          {
            ts_ms: 1567295000090,
            type_id: 'purchases',
            type_label: 'Purchases',
            diff: -10.0,
            running_total: 28.1,
            subtype_id: 'minds_pro_membership',
          },
          {
            ts_ms: 1567295000080,
            type_id: 'rewards',
            type_label: 'Rewards',
            diff: 0.9,
            running_total: 38.1,
            details: {
              total_points: 50,
              contributions: [
                {
                  id: 'jury_duty',
                  label: 'Jury Duty',
                  occurences: 2,
                  points: 50,
                },
              ],
            },
          },
        ],
      },
      // days go on...
    ],
    load_next: '',
    status: 'success',
  },
};
export default fakeData;
