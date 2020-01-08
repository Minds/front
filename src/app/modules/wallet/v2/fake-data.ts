const fakeData = {
  wallet: {
    tokens: {
      label: 'Tokens',
      unit: 'tokens',
      balance: 777.123,
      address: null,
    },
    offchain: {
      label: 'Off-chain',
      unit: 'tokens',
      balance: 445.01,
      address: 'offchain',
    },
    onchain: {
      label: 'On-chain',
      unit: 'tokens',
      balance: 333.123,
      address: '0x7bA1A2a94c799f0124B6Bf8481D529BDa844498D',
    },
    receiver: {
      label: 'Receiver',
      unit: 'tokens',
      balance: 0.223,
      address: '0x8aA1A2a94c799f0124B6Bf8481D529BDa844498D',
    },
    usd: {
      label: 'USD',
      unit: 'usd',
      balance: 25.5,
      address: null,
    },
    eth: {
      label: 'Ether',
      unit: 'eth',
      balance: 111.159,
      address: '0x7aA1A2a94c799f0124B6Bf8481D529BDa844498D',
    },
    btc: {
      label: 'Bitcoin',
      unit: 'btc',
      balance: 0,
      address: null,
    },
  },
  payout: {
    contributionValues: {
      checkin: 0,
      comments: 0,
      reminds: 0,
      votes: 0,
      subscribers: 0,
      jury_duty: 0,
      onchain_tx: 0,
      referrals: 0,
      referrals_welcome: 0,
    },
    currentReward: '0',
    nextPayout: 0,
    totalNetworkContribution: 78507,
    yourContribution: 0,
    yourRewardFactor: 0,
    yourShare: 0,
    status: 'success',
  },
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
    filters: [
      {
        id: 'transaction_types',
        label: 'Transaction Types',
        options: [
          {
            id: 'all',
            label: 'All',
            selected: true,
          },
          {
            id: 'offchain_wire',
            label: 'Off-Chain Wire',
            selected: false,
          },
          {
            id: 'onchain_wire',
            label: 'On-Chain Wire',
            selected: false,
          },
          {
            id: 'rewards',
            label: 'Rewards',
            selected: false,
          },
          {
            id: 'purchases',
            label: 'Purchases',
            selected: false,
          },
          {
            id: 'boost',
            label: 'Boost',
            selected: false,
          },
          {
            id: 'onchain_transfer',
            label: 'On-Chain Transfer',
            selected: false,
          },
        ],
      },
    ],
    pending: {
      total_points: 7,
      contributions: [
        { id: 'checkins', label: 'Check-ins', occurrences: 1, points: 2 },
        { id: 'comments', label: 'Comments', occurrences: 2, points: 4 },
        { id: 'votes', label: 'Votes', occurrences: 1, points: 1 },
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
                  occurrences: 4,
                  points: 8,
                },
                {
                  id: 'comments',
                  label: 'Comments',
                  occurrences: 1,
                  points: 2,
                },
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
                  occurrences: 2,
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
