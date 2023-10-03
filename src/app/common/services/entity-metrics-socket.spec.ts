import { BehaviorSubject } from 'rxjs';
import { EntityMetricsSocketService } from './entity-metrics-socket';

describe('EntityMetricsSocketService', () => {
  let service: EntityMetricsSocketService;

  let socketsMock = new (function() {
    this.onReady$ = new BehaviorSubject<boolean>(false);
    this.subscribe = jasmine.createSpy('subscribe');
    this.leave = jasmine.createSpy('leave');
    this.join = jasmine.createSpy('join');
  })();

  beforeEach(() => {
    service = new EntityMetricsSocketService(socketsMock);
  });

  afterEach(() => {
    if ((service as any).onReadySubscription) {
      (service as any).onReadySubscription.unsubscribe();
    }
    if ((service as any).metricsSubscription) {
      (service as any).metricsSubscription.unsubscribe();
    }
    (service as any).isJoined = false;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup listeners and update instance subject on event', () => {
    expect((service as any).isJoined).toBeFalse();
    const guid = '123';
    service.listen(guid);

    expect((service as any).sockets.join).toHaveBeenCalledWith(
      `entity:metrics:${guid}`
    );
    expect((service as any).isJoined).toBeTrue();
    expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
      `entity:metrics:${guid}`,
      jasmine.any(Function)
    );
  });

  it('should leave a socket room and reset state', () => {
    const guid = '123';
    (service as any).isJoined = true;
    (service as any).leave(guid);

    expect((service as any).isJoined).toBe(false);
    expect((service as any).sockets.leave).toHaveBeenCalledWith(
      `entity:metrics:${guid}`
    );
    expect((service as any).metricsSubscription).toBeUndefined();
    expect((service as any).onReadySubscription).toBeUndefined();
  });

  it('should update instance subjects based on parsed event', () => {
    const metricsChangedEvent = {
      'thumbs:up:count': 1,
    };

    (service as any).updateInstanceSubjects(metricsChangedEvent);

    (service as any).thumbsUpCount$
      .subscribe(val => {
        expect(val).toBe(1);
      })
      .unsubscribe();
  });
});
