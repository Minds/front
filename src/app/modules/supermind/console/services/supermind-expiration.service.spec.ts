import { SupermindConsoleExpirationService } from './supermind-expiration.service';
import { Supermind } from '../../supermind.types';
import * as moment from 'moment';

describe('SupermindConsoleExpirationService', () => {
  let service: SupermindConsoleExpirationService;
  let mockSupermind: Supermind = null;

  beforeEach(() => {
    service = new SupermindConsoleExpirationService();
    mockSupermind = {
      guid: '123',
      activity_guid: '234',
      sender_guid: '345',
      receiver_guid: '456',
      status: 1,
      payment_amount: 1,
      payment_method: 1,
      payment_txid: '567',
      created_timestamp: 1662715004,
      updated_timestamp: 1662715004,
      expiry_threshold: 604800,
      twitter_required: true,
      reply_type: 1,
      entity: { guid: '123' },
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get time till expiration based on created_timestamp and expiry_threshold when days', () => {
    mockSupermind.created_timestamp = moment().unix();
    mockSupermind.expiry_threshold = 604800;

    expect(service.getTimeTillExpiration(mockSupermind)).toBe('6d');
  });

  it('should get time till expiration based on created_timestamp and expiry_threshold when hours', () => {
    mockSupermind.created_timestamp = moment().utc().subtract(6, 'days').unix();
    mockSupermind.expiry_threshold = 604800;

    expect(service.getTimeTillExpiration(mockSupermind)).toBe('23h');
  });

  it('should get time till expiration based on created_timestamp and expiry_threshold when minutes', () => {
    mockSupermind.created_timestamp = moment()
      .utc()
      .subtract(6, 'days')
      .subtract(23, 'hours')
      .unix();
    mockSupermind.expiry_threshold = 604800;

    expect(service.getTimeTillExpiration(mockSupermind)).toBe('59m');
  });

  it('should get time till expiration based on created_timestamp and expiry_threshold when seconds', () => {
    mockSupermind.created_timestamp = moment()
      .utc()
      .subtract(6, 'days')
      .subtract(23, 'hours')
      .subtract(59, 'minutes')
      .unix();
    mockSupermind.expiry_threshold = 604800;

    expect(service.getTimeTillExpiration(mockSupermind)).toBe('59s');
  });

  it('should get NO time till expiration based on created_timestamp and expiry_threshold when expired', () => {
    mockSupermind.created_timestamp = moment()
      .utc()
      .subtract(7, 'days')
      .subtract(1, 'second')
      .unix();
    mockSupermind.expiry_threshold = 604800;

    expect(service.getTimeTillExpiration(mockSupermind)).toBe('');
  });
});
