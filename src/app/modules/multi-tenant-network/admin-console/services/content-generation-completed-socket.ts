import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SocketsService } from '../../../../services/sockets';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Content generation completed socket service.
 */
@Injectable({ providedIn: 'root' })
export class ContentGenerationCompletedSocketService implements OnDestroy {
  /** Subject for content generation completed event. */
  public readonly contentGenerationCompleted$: Subject<boolean> =
    new Subject<boolean>();

  /** Whether the socket is joined. */
  private isJoined = false;

  /** Room name to listen to for socket events. */
  private readonly roomName: string;

  // subscriptions.
  private contentGenerationCompletedSubscription: Subscription;
  private onReadySubscription: Subscription;

  constructor(
    private sockets: SocketsService,
    private configs: ConfigsService
  ) {
    this.roomName = `tenant:bootstrap:content:${this.configs.get('tenant_id')}`;
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  /**
   * Listen for content generation completed events.
   * @returns { this }
   */
  public async listen(): Promise<this> {
    if (
      this.contentGenerationCompletedSubscription ||
      this.onReadySubscription
    ) {
      console.error(
        'Already subscribed to content generation completed events'
      );
      return;
    }

    this.onReadySubscription = this.sockets.onReady$.subscribe(() => {
      this.sockets.join(this.roomName);
      this.isJoined = true;
    });

    this.contentGenerationCompletedSubscription = this.sockets.subscribe(
      this.roomName,
      (event: string) => {
        this.contentGenerationCompleted$.next(true);
        this.leave();
        this.destroySubscriptions();
      }
    );
    return this;
  }

  /**
   * Leave the content generation completed socket room.
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
    if (this.contentGenerationCompletedSubscription) {
      this.contentGenerationCompletedSubscription.unsubscribe();
      this.contentGenerationCompletedSubscription = null;
    }
    if (this.onReadySubscription) {
      this.onReadySubscription.unsubscribe();
      this.onReadySubscription = null;
    }
    return this;
  }
}
