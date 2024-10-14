import { BehaviorSubject } from 'rxjs';
import { ContentGenerationCompletedSocketService } from './content-generation-completed-socket';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ContentGenerationCompletedSocketService', () => {
  let service: ContentGenerationCompletedSocketService;

  let socketsMock = new (function () {
    this.onReady$ = new BehaviorSubject<boolean>(false);
    this.subscribe = jasmine.createSpy('subscribe');
    this.leave = jasmine.createSpy('leave');
    this.join = jasmine.createSpy('join');
  })();

  let configsMock = new (function () {
    this.get = jasmine
      .createSpy('get')
      .withArgs('tenant_id')
      .and.returnValue(123);
  })();

  beforeEach(() => {
    service = new ContentGenerationCompletedSocketService(
      socketsMock,
      configsMock
    );
  });

  afterEach(() => {
    if ((service as any).contentGenerationCompletedSubscription) {
      (service as any).contentGenerationCompletedSubscription.unsubscribe();
    }
    if ((service as any).metricsSubscription) {
      (service as any).metricsSubscription.unsubscribe();
    }
    (service as any).isJoined = false;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup listeners and update instance subject on event', fakeAsync(() => {
    expect((service as any).isJoined).toBeFalse();

    service.listen();
    tick();

    expect((service as any).sockets.join).toHaveBeenCalledWith(
      `tenant:bootstrap:content:123`
    );
    expect((service as any).isJoined).toBeTrue();
    expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
      `tenant:bootstrap:content:123`,
      jasmine.any(Function)
    );
  }));

  it('should leave a socket room and reset state', () => {
    (service as any).isJoined = true;
    (service as any).leave();

    expect((service as any).isJoined).toBe(false);
    expect((service as any).sockets.leave).toHaveBeenCalledWith(
      `tenant:bootstrap:content:123`
    );
    expect((service as any).metricsSubscription).toBeUndefined();
    expect(
      (service as any).contentGenerationCompletedSubscription
    ).toBeUndefined();
  });
});
