import { BehaviorSubject } from 'rxjs';
import userMock from '../../../mocks/responses/user.mock';
import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;

  let configsMock = new (function() {
    this.get = jasmine.createSpy('get');
  })();

  let sessionsMock = new (function() {
    this.user$ = new BehaviorSubject<number>(userMock);
  })();

  let activityV2ExperimentMock = new (function() {
    this.isActive = jasmine.createSpy('get');
  })();

  let entityMetricsSocketMock = new (function() {
    this.listen = jasmine.createSpy('listen');
    this.leave = jasmine.createSpy('leave');
    this.thumbsUpCount$ = new BehaviorSubject<number>(0);
    this.thumbsDownCount$ = new BehaviorSubject<number>(0);
  })();

  beforeEach(() => {
    service = new ActivityService(
      configsMock,
      sessionsMock,
      activityV2ExperimentMock,
      entityMetricsSocketMock
    );

    service.entity$.next({
      guid: '123',
      entity_guid: '321',
    });
  });

  afterEach(() => {
    if ((service as any).thumbsUpMetricSubscription) {
      (service as any).thumbsUpMetricSubscription.unsubscribe();
    }
    if ((service as any).thumbsDownMetricSubscription) {
      (service as any).thumbsDownMetricSubscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup metrics socket listener when service is present with entity guid', () => {
    service.entity$.next({ guid: '123', entity_guid: '321' });

    service.setupMetricsSocketListener();

    (service as any).entityMetricsSocket.thumbsUpCount$.next(5);
    (service as any).entityMetricsSocket.thumbsDownCount$.next(4);

    expect((service as any).entityMetricsSocket.listen).toHaveBeenCalledWith(
      '321'
    );

    service.entity$
      .subscribe(entity => {
        expect(entity['thumbs:up:count']).toBe(5);
        expect(entity['thumbs:down:count']).toBe(4);
      })
      .unsubscribe();
  });

  it('should setup metrics socket listener when service is present with guid if no entity guid is present', () => {
    service.entity$.next({ guid: '123' });
    service.setupMetricsSocketListener();

    (service as any).entityMetricsSocket.thumbsUpCount$.next(2);
    (service as any).entityMetricsSocket.thumbsDownCount$.next(3);

    expect((service as any).entityMetricsSocket.listen).toHaveBeenCalledWith(
      '123'
    );

    service.entity$
      .subscribe(entity => {
        expect(entity['thumbs:up:count']).toBe(2);
        expect(entity['thumbs:down:count']).toBe(3);
      })
      .unsubscribe();
  });

  it('should teardown subscriptions to metric sockets with entity_guid', () => {
    service.entity$.next({ guid: '123', entity_guid: '321' });
    service.setupMetricsSocketListener();

    service.teardownMetricsSocketListener();
    expect((service as any).entityMetricsSocket.leave).toHaveBeenCalledWith(
      '321'
    );
  });

  it('should teardown subscriptions to metric sockets with guid if no entity_guid is present', () => {
    service.entity$.next({ guid: '123' });
    service.setupMetricsSocketListener();

    service.teardownMetricsSocketListener();
    expect((service as any).entityMetricsSocket.leave).toHaveBeenCalledWith(
      '123'
    );
  });
});
