import { BehaviorSubject } from 'rxjs';
import { BootstrapProgressSocketService } from './bootstrap-progress-socket.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ContentGenerationCompletedSocketService', () => {
  let service: BootstrapProgressSocketService;

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
    service = new BootstrapProgressSocketService(socketsMock, configsMock);
  });

  afterEach(() => {
    (service as any).bootstrapProgressEventSubscription?.unsubscribe();
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
      `tenant:bootstrap:123`
    );
    expect((service as any).isJoined).toBeTrue();
    expect((service as any).sockets.subscribe).toHaveBeenCalledWith(
      `tenant:bootstrap:123`,
      jasmine.any(Function)
    );
  }));

  it('should leave a socket room and reset state', () => {
    (service as any).isJoined = true;
    (service as any).leave();

    expect((service as any).isJoined).toBe(false);
    expect((service as any).sockets.leave).toHaveBeenCalledWith(
      `tenant:bootstrap:123`
    );
    expect((service as any).bootstrapEventSubscription).toBeUndefined();
    expect(
      (service as any).contentGenerationCompletedSubscription
    ).toBeUndefined();
  });
});
