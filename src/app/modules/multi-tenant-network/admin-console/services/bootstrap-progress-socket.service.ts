import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SocketsService } from '../../../../services/sockets';
import { ConfigsService } from '../../../../common/services/configs.service';

export type BootstrapSocketEvent = {
  step: string;
  completed: boolean;
};

/**
 * Bootstrap progress event socket service.
 */
@Injectable({ providedIn: 'root' })
export class BootstrapProgressSocketService implements OnDestroy {
  /** Subject for bootstrap progress events. */
  public readonly event$: Subject<BootstrapSocketEvent> =
    new Subject<BootstrapSocketEvent>();

  /** Whether the room is joined. */
  public isJoined = false;

  /** Room name to listen to for socket events. */
  private readonly roomName: string;

  // subscriptions.
  private boootstrapEventSubscription: Subscription;
  private onReadySubscription: Subscription;

  constructor(
    private sockets: SocketsService,
    private configs: ConfigsService
  ) {
    this.roomName = `tenant:bootstrap:${this.configs.get('tenant_id')}`;
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  /**
   * Listen for bootstrap progress events.
   * @returns { this }
   */
  public async listen(): Promise<this> {
    if (this.boootstrapEventSubscription || this.onReadySubscription) {
      console.error(
        'Already subscribed to content generation completed events'
      );
      return;
    }

    this.onReadySubscription = this.sockets.onReady$.subscribe(() => {
      this.sockets.join(this.roomName);
      this.isJoined = true;
    });

    this.boootstrapEventSubscription = this.sockets.subscribe(
      this.roomName,
      (rawEvent: string): void => {
        try {
          const parsedEvent: BootstrapSocketEvent = JSON.parse(rawEvent);
          this.event$.next(parsedEvent);
        } catch (error) {
          console.error('Error parsing bootstrap event:', error, rawEvent);
        }
      }
    );
    return this;
  }

  /**
   * Leave the bootstrap progress socket room.
   * @returns { this }
   */
  public leave(): this {
    if (this.isJoined) {
      this.sockets.leave(this.roomName);
      this.isJoined = false;
    }
    this.destroySubscriptions();
    return this;
  }

  /**
   * Destroy class subscriptions.
   * @returns { this }
   */
  private destroySubscriptions(): this {
    if (this.boootstrapEventSubscription) {
      this.boootstrapEventSubscription.unsubscribe();
      this.boootstrapEventSubscription = null;
    }
    if (this.onReadySubscription) {
      this.onReadySubscription.unsubscribe();
      this.onReadySubscription = null;
    }
    return this;
  }
}
